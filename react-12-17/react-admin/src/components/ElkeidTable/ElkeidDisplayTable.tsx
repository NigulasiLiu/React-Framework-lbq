import React from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Select, Form, Modal } from 'antd';
import moment, { Moment } from 'moment';
import { FilterDropdownProps, simplifiedTablePanel } from '../tableUtils';
import { ExclamationCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { handleExport } from '../ContextAPI/DataService';

const { Option } = Select;

type RangeValue<T> = [T | null, T | null] | null;
const { RangePicker } = DatePicker;
interface GenericDataItem {
    [key: string]: any;
}

interface ElkeidDisplayTableProps {
    externalDataSource: GenericDataItem[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    searchColumns?:string[];
    // 可以根据需要添加其他 props，比如分页大小等
    currentPanel: string;
    //prePanel:string;

    //selectedRowKeys: React.Key[]; // 可选属性，代表被选中行的keys，用于控制独立的key

    //handleApplicationTypeSelect: (applicationType: string) => void; // 添加方法的类型声明
    //renderSearchFieldDropdown:()=>void;
    //handleSearch:()=>void;

    apiEndpoint: string;
    fetchLatestData: (apiEndpoint: string,
        searchField?: string | undefined, searchQuery?: string | undefined, rangeQuery?: string | undefined,
        timeColumnIndex?: string[] | undefined) => void;
    
    onSelectedRowKeysChange: (selectedRowKeys: React.Key[]) => void;

    childrenColumnName?: string; // 作为可选属性
    indentSize?: number; // 也可以声明为可选属性，如果您希望为其提供默认值
    expandedRowRender?: (record: any) => React.ReactNode; // 添加expandedRowRender属性
    keyIndex?: number;

}

interface ElkeidDisplayTableState {
    newColumns: any[],
    lastUpdated: string | null;
    selectedDateRange: [string | null, string | null];

    selectedRowKeys: React.Key[];// 可选属性，代表被选中行的keys，用于控制独立的key
    selectedRows: any[];//存储整行数据
    clearKeys:boolean;

    selectedApplicationType: string | null,
    searchQuery: string;
    selectedSearchField: string;
    currentPanelName: string;
    panelChangeCount: number;

    selectrangequeryParams: string;

    // 排序或者过滤处理后的data
    sortedData: GenericDataItem[],
    sortConfig: null,

    // showModal: boolean;
    // user_character: string;
    fetchDataCalled:number;
}


class ElkeidDisplayTable extends React.Component<ElkeidDisplayTableProps, ElkeidDisplayTableState> {
    constructor(props: ElkeidDisplayTableProps) {
        super(props);
        this.state = {
            newColumns: [],
            // showModal: false,
            // user_character: 'admin',

            selectedRowKeys: [],
            selectedRows: [],
            clearKeys:false,

            lastUpdated: null,
            selectedDateRange: [null, null],

            searchQuery: '',
            selectedSearchField: '',
            selectrangequeryParams: '',

            selectedApplicationType: null,
            currentPanelName: this.props.currentPanel,
            panelChangeCount: 0,

            // 排序或者过滤处理后的data
            sortedData: [],
            sortConfig: null,

            fetchDataCalled: 0 // 初始化数据获取调用计数
        };
    }
    componentDidMount() {
        this.fetchDataIfNeeded();
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        })
    }
    componentDidUpdate(prevProps: any) {
        //this.state.panelChangeCount === 1 || 
        if (prevProps.currentPanel !== this.props.currentPanel) { // 修改条件检查逻辑
            console.log('Panel changed from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
            this.setState({
                lastUpdated: new Date().toLocaleString(),
                selectedDateRange: [null, null], // 日期筛选器重置
                selectedRowKeys: [],
                //newColumns: this.autoPopulateFilters(),
                currentPanelName: this.props.currentPanel,
            });
        }
        // if(this.state.clearKeys){
        //     this.setState({
        //         selectedRowKeys: [],
        //     });
        // }
        // else {
        //     console.log('Panel did not change, from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
        // }
    }

    fetchDataIfNeeded() {
        // 如果数据未被获取过，或者只获取了一次，则调用获取数据
        if (this.state.fetchDataCalled < 1) {
            console.log('this.state.fetchDataCalled change ' + this.state.fetchDataCalled + ' times.');
            
            this.props.fetchLatestData(this.props.apiEndpoint, '', '', '');
            this.setState(prevState => ({
                lastUpdated: new Date().toLocaleString(),
                fetchDataCalled: prevState.fetchDataCalled + 1 // 增加调用次数
            }));
        }
    }
    //更新 handleFetchLatestData 以接受搜索字段和搜索查询
    handleFetchLatestData = (field: string, query: string, rangeQueryParams: string) => {
        this.props.fetchLatestData(this.props.apiEndpoint, '', '', '');
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        })
        console.log('time changed:' + this.state.lastUpdated)
    };

    // 当你再次需要允许更新操作时，重置状态
    //   autoPopulateFilters = ( ) => {//如果属性包含onFilter，那么将自动填充filter中的各个值
    //     const {columns,externalDataSource} = this.props;
    //     const newColumns = columns.map(column => {
    //       if (column.onFilter && externalDataSource) {
    //         const fieldVarieties = new Set(externalDataSource.map(item => item[column.dataIndex]));
    //         const filters = Array.from(fieldVarieties).map(variety => ({
    //           text: (
    //             <span style={{ color: '#000'}}>
    //               {variety ? variety.toString() : ''}
    //             </span>
    //           ),
    //           value: variety,
    //         }));
    //         return { ...column, filters };
    //       }
    //       return column;
    //     });

    //     return newColumns;
    // };


    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({
            selectedRowKeys,
        });
        if (this.props.onSelectedRowKeysChange) {
            this.props.onSelectedRowKeysChange(selectedRowKeys);
        }
    };

    // handleExport = () => {
    //     const { externalDataSource, columns } = this.props;

    //     // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
    //     if (this.state.selectedRowKeys.length === 0 || externalDataSource.length === 0) {
    //         alert('没有可导出的数据');
    //         return;
    //     }

    //     // 筛选出要导出的数据
    //     const dataToExport = externalDataSource.filter((item) => this.state.selectedRowKeys.includes(item.id));

    //     // 创建 CSV 字符串
    //     let csvContent = '';

    //     // 添加标题行（从 columns 获取列标题）
    //     const headers = columns.map(column => `"${column.title}"`).join(",");
    //     csvContent += headers + "\r\n";

    //     // 添加数据行（根据 columns 的 dataIndex 来获取值）
    //     dataToExport.forEach(item => {
    //         const row = columns.map(column => {
    //             const value = item[column.dataIndex];
    //             return `"${value}"`; // 用引号包裹，以便正确处理包含逗号或换行符的数据
    //         }).join(",");
    //         csvContent += row + "\r\n";
    //     });

    //     // UTF-8 编码的字节顺序标记 (BOM)
    //     const BOM = "\uFEFF";

    //     // 创建 Blob 对象
    //     const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    //     const href = URL.createObjectURL(blob);

    //     // 创建下载链接并点击
    //     const link = document.createElement('a');
    //     link.href = href;
    //     link.download = this.props.currentPanel + '_export.csv';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    handleApplicationTypeSelect = (e: any) => {
        const applicationType = e.key;
        // 选择新的应用类型后，也重置selectedRowKeys
        this.setState(
            {
                selectedApplicationType: applicationType,
                selectedRowKeys: [], // 重置selectedRowKeys
            },
            //this.props.fetchLatestData
        );
    };
    //后续为这里的输入参数column添加筛选
    generate_new_columns = (columns: any[], search_index=['']): any[] => {
        // 遍历this.props.columns中的每一列
        return columns.map((column: any) => {
          // 如果列名在search_index中
          if (search_index.includes(column.dataIndex)) {
            // 为这列添加搜索功能
            return {
              ...column,
            //   filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#FF0000' : undefined }} />, // 调整颜色以引人注目
            
            filterIcon: (filtered: boolean) => (
                <div >
                  {/* 添加动画效果 */}
                  <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, transition: 'color 0.3s' }} />
                  {/* 显示提醒标志 */}
                  {filtered && <ExclamationCircleOutlined style={{ position: 'absolute', top: -4, right: -4, color: '#FF4500' }} />}
                  {/* 增加背景色或边框 */}
                  <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, backgroundColor: '#FF4500', borderRadius: '50%', display: filtered ? 'block' : 'none' }}></div>
                </div>
              ),
              filterDropdown: (filterDropdownProps: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                  <Input
                    autoFocus
                    placeholder={`搜索${column.title}...`}
                    value={filterDropdownProps.selectedKeys[0]}
                    onChange={e => filterDropdownProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => filterDropdownProps.confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                  />
                  <Button
                    onClick={() => {
                        filterDropdownProps.confirm()
                        this.setState({selectedRowKeys:[]})
                    }}
                    size="small"
                    style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
                  >
                    搜索
                  </Button>
                  <Button
                    disabled={filterDropdownProps.clearFilters === undefined}
                    onClick={() => {
                        filterDropdownProps.clearFilters?.()
                        this.setState({selectedRowKeys:[]})
                    }}
                    size="small"
                    style={{ width: 90 }}
                  >
                    重置
                  </Button>
                </div>
              ),
              // 添加onFilter属性，以处理搜索逻辑
              onFilter: (value: string, record: any) =>
                record[column.dataIndex]
                  ? record[column.dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                  : false,
            };
          } else {
            // 如果不在search_index中，直接返回原列
            return column;
          }
        });
    }
      
    // renderSearchFieldDropdown = (columns: any[]) => {
    //     return (
    //         <Row style={{width:'15%', marginLeft: '0px', marginRight: 'auto'}}>
    //             <Select
    //                 style={{ width: this.props.currentPanel.includes('sidebar')?'120px':'200px', marginRight: '8px' }}
    //                 placeholder="选择搜索字段"
    //                 onChange={this.handleSearchFieldChange}
    //             >
    //                 {columns.map((column, index) => (
    //                     <Option key={index} value={column.dataIndex}>
    //                         {column.title}
    //                     </Option>
    //                 ))}
    //             </Select>
    //         </Row>
    //     );
    // };
    // generate_new_columns=(columns: any[], search_index=['']): any[] =>{
    //     // 遍历this.props.columns中的每一列
    //     return columns.map((column: any) => {
    //       // 如果列名在search_index中
    //       if (search_index.includes(column.dataIndex)) {
    //         // 为这列添加搜索功能
    //         return {
    //           ...column,
    //           filterDropdown: (filterDropdownProps: FilterDropdownProps) => (
    //             <div style={{ padding: 8 }}>
    //               <Input
    //                 autoFocus
    //                 placeholder={`搜索${column.title}...`}
    //                 value={filterDropdownProps.selectedKeys[0]}
    //                 onChange={e => filterDropdownProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={() => filterDropdownProps.confirm()}
    //                 style={{ width: 188, marginBottom: 8, display: 'block' }}
    //               />
    //               <Button
    //                 onClick={() => {
    //                     filterDropdownProps.confirm()
    //                     this.setState({selectedRowKeys:[]})
    //                 }}
    //                 size="small"
    //                 style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
    //               >
    //                 搜索
    //               </Button>
    //               <Button
    //                 disabled={filterDropdownProps.clearFilters === undefined}
    //                 onClick={() => {
    //                     filterDropdownProps.clearFilters?.()
    //                     this.setState({selectedRowKeys:[]})
    //                 }}
    //                 size="small"
    //                 style={{ width: 90 }}
    //               >
    //                 重置
    //               </Button>
    //             </div>
    //           ),
    //         };
    //       } else {
    //         // 如果不在search_index中，直接返回原列
    //         return column;
    //       }
    //     });
    //   }

    // onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
    //     if (dates) {
    //         const [start, end] = dateStrings;
    //         this.setState({ selectedDateRange: [start, end] });

    //         const { timeColumnIndex, externalDataSource } = this.props;
    //         if (timeColumnIndex && timeColumnIndex.length > 0) {
    //             // 转换日期为 Unix 时间戳（秒）
    //             const startDateTimestamp = moment(start).unix();
    //             const endDateTimestamp = moment(end).unix();

    //             // 筛选 externalDataSource 中符合日期范围的数据
    //             const filteredData = externalDataSource.filter(item => {
    //                 const itemTimestamp = item[timeColumnIndex[0]]; // 假设时间戳已经是 Unix 时间戳格式
    //                 return itemTimestamp >= startDateTimestamp && itemTimestamp <= endDateTimestamp;
    //             });

    //             // 更新状态以重新渲染表格
    //             this.setState({
    //                 sortedData: filteredData,
    //             });
    //         }
    //     } else {
    //         // 如果日期范围被清除，显示全部数据
    //         this.setState({
    //             sortedData: this.props.externalDataSource,
    //             selectedDateRange: [null, null],
    //         });
    //     }
    // };




    render() {
        // 构建无数据时的展示配置
        
        const new_columns = this.generate_new_columns(this.props.columns,this.props.searchColumns);
        const rowSelection = {//checkbox勾选状态独立
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { externalDataSource } = this.props;

        //const newColumns = this.autoPopulateFilters();
        const isSidebar = this.props.currentPanel.includes("sidebar")
        const isButtonDisabled = this.props.externalDataSource.length === 0
            || this.state.selectedRowKeys.length === 0
            || isSidebar;

        const tableWidth = this.props.currentPanel.includes('large') ? '1000px' : (this.props.currentPanel?.includes('sidebar') ? '100%' : '100%');


        const compStyle_small = {
            textAlign: 'center',
            maxwidth: '90px',
            height: '30px',
            // 由于按钮高度较小，可能需要调整字体大小或内边距来改善显示
            fontSize: '12px', // 根据需要调整字体大小
            //borderRadius: '4px', // 如果您想要圆角边框

        }

        const compStyle_normal = {
            //opacity: isButtonDisabled ? 0.5 : 1,
        }

        const selectedcompStyle = isSidebar
            ? compStyle_small
            : compStyle_normal;

        const selectedTableStyle = isSidebar
            ? 'customTable' : 'customTable';

        const fontSizeSmall = this.props.currentPanel?.includes('sidebar') ? '12px' : '14px';



        return (//Table的宽度被设置为1330px
            <div style={{
                fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold',
                width: this.props.currentPanel?.includes('baseLineDetectScanResult1') ? '64%' : tableWidth
            }}>
                <Row gutter={[12, 6]} style={{ marginTop: '-10px' }}>
                    {/* Main content area */}
                    <Col
                        md={this.props.currentPanel === 'applications1' ? 20 : 24}
                        style={{
                            paddingLeft: this.props.currentPanel === 'applications1' ? '12px' : '0px',
                        }}
                    >
                        <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                            {!simplifiedTablePanel.includes(this.props.currentPanel) && (
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={[2, 2]} >
                                        <Col flex="none">
                                            <Button
                                                style={{
                                                    ...selectedcompStyle, marginRight: '10px',
                                                    opacity: isButtonDisabled ? 0.5 : 1
                                                }}
                                                onClick={()=>handleExport(this.props.externalDataSource,
                                                    this.props.currentPanel,this.state.selectedRowKeys)}
                                                disabled={isButtonDisabled}
                                            >
                                                批量导出
                                            </Button>

                                            {/* <Button
                                            style={{...selectedcompStyle,
                                                opacity: isButtonDisabled ? 0.5 : 1 }}
                                            // onClick={()=>handleDelete(this.props.currentPanel,this.state.selectedRowKeys)}
                                            disabled={isButtonDisabled}
                                            >
                                            批量删除
                                            </Button> */}

                                            <Button
                                                style={{ ...selectedcompStyle, }}
                                                onClick={() => this.handleFetchLatestData('', '', '')}>
                                                采集最新数据
                                            </Button>

                                        </Col>
                                        <Col flex="auto" style={{
                                            textAlign: 'left', marginLeft: isSidebar ? 2 : 10, marginTop: '5px',
                                            fontSize: isSidebar ? '12px' : ''
                                        }}>
                                            <span>最近更新時間: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                        </Col>
                                        {/* {!isSidebar && this.props.timeColumnIndex && this.props.timeColumnIndex.length > 0 && (
                                <Col flex="none" span={5} style={{ marginLeft: 'auto',marginRight:'0px' }}>
                                    <RangePicker onChange={this.onDateRangeChange}/>
                                </Col>
                                )} */}
                                    </Row>
                                </div>
                            )}
                            {/* {this.props.currentPanel === 'UserManagementlist' && (
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={16} >
                                        <Col flex="none">
                                            <Button
                                                onClick={this.showModal}
                                                style={{ backgroundColor: '#1664FF', color: 'white', marginRight: '10px' }}>新增用户
                                            </Button>
                                            <Button
                                                style={{
                                                    ...selectedcompStyle,
                                                    opacity: isButtonDisabled ? 0.5 : 1
                                                }}
                                                onClick={()=>handleExport(this.props.externalDataSource,this.props.currentPanel,this.state.selectedRowKeys)}
                                                disabled={isButtonDisabled}
                                            >
                                                批量导出
                                            </Button>
                                            <Button 
                                    style={{backgroundColor:'white',color:'black'}} 
                                    onClick={this.handleExport}
                                    disabled={isButtonDisabled}>批量删除</Button>
                                        </Col>
                                    </Row>
                                </div>)} */}



                            {/* {externalDataSource.length !== 0 && (
                                <Table
                                    className={selectedTableStyle}
                                    rowSelection={rowSelection}
                                    rowKey={this.props.columns[this.props.keyIndex || 0].key}//使用第一个字段区分各个row，最好是PK
                                    dataSource={externalDataSource}//externalDataSource
                                    columns={this.props.columns}
                                    childrenColumnName={this.props.childrenColumnName}
                                    expandedRowRender={this.props.expandedRowRender}
                                //indentSize={this.props.indentSize}
                                //dataSource={this.state.topFiveSortedData}
                                //pagination={false}
                                // locale={(this.state.dataSourceChanged) && (this.props.externalDataSource.length === 0) 
                                //     ? customLocale:undefined}
                                />)}
                            {externalDataSource.length === 0 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <LoadingOutlined style={{ fontSize: '3em' }} />
                                </div>
                            )} */}
                                <Table
                                    className={selectedTableStyle}
                                    rowSelection={rowSelection}
                                    rowKey={this.props.columns[this.props.keyIndex || 0].key}//使用第一个字段区分各个row，最好是PK
                                    dataSource={externalDataSource}//externalDataSource
                                    columns={new_columns}
                                    pagination={{
                                        showQuickJumper:true,
                                        pageSize:(this.props.currentPanel.includes("_details")?5:8)
                                    }}
                                    childrenColumnName={this.props.childrenColumnName}
                                    expandedRowRender={this.props.expandedRowRender}
                                    //indentSize={this.props.indentSize}
                                />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ElkeidDisplayTable;
