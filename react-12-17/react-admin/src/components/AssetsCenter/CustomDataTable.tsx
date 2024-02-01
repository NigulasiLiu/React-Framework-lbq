import React from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Menu,Pagination, Select } from 'antd';
import SidebarComponent from '../SubComponents/SidebarComponent'
import moment, { Moment } from 'moment';
import { buildRangeQueryParams} from './DataService';

const { Option } = Select;

type RangeValue<T> = [T | null, T | null] | null;
const { RangePicker } = DatePicker;
interface GenericDataItem {
    [key: string]: any;
}

interface CustomDataTableProps {
    externalDataSource: GenericDataItem[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    // 可以根据需要添加其他 props，比如分页大小等
    currentPanel?: string;
    //selectedRowKeys: React.Key[]; // 可选属性，代表被选中行的keys，用于控制独立的key
    
    //handleApplicationTypeSelect: (applicationType: string) => void; // 添加方法的类型声明
    fetchLatestData: (field: string, query: string, rangeQueryParams:string) => void; 
    //renderSearchFieldDropdown:()=>void;
    //handleSearch:()=>void;
    
    onUpdateSearchField: (field: string) => void;
    onUpdateSearchQuery: (query: string) => void;
    onUpdateRangeField:(queryParams:string) => void;
    onDeleteSelected:(selectedRowKeys: React.Key[]) => void;
    onSelectedRowKeysChange:(selectedRowKeys: React.Key[]) => void;
}

interface CustomDataTableState {
    currentPage: number;
    pageSize: number; // 可以根据需要设置默认值
    total: number; // 数据总数，用于分页计算
    lastUpdated: string | null;
    selectedDateRange: [string | null, string | null];

    selectedRowKeys: React.Key[];// 可选属性，代表被选中行的keys，用于控制独立的key

    selectedApplicationType: string|null,
    searchQuery: string;
    selectedSearchField:string;
    currentPanelName:string;

    selectrangequeryParams:string;
}

class CustomDataTable extends React.Component<CustomDataTableProps, CustomDataTableState> {
    constructor(props: CustomDataTableProps) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            currentPage: 1,
            pageSize: 10, // 默认每页显示10条数据，可根据需要调整
            total: props.externalDataSource.length, // 初始总数设为数据源的长度
            lastUpdated:null,
            selectedDateRange: [null,null],
            
            searchQuery: '',
            selectedSearchField:'',
            selectrangequeryParams: '',

            selectedApplicationType: null,
            currentPanelName: '',

        };
    }
    componentDidMount() {
        this.props.fetchLatestData('all','','')
        //const newColumns = autoPopulateFilters();
        //渲染筛选器等等
    }
    componentDidUpdate(prevProps: any, prevState:any) {
        if (prevProps.externalDataSource !== this.props.externalDataSource) {
            // 处理新数据：例如重置分页或更新最后更新时间
            this.setState({
                currentPage: 1,
                lastUpdated: new Date().toLocaleString(),
                total: this.props.externalDataSource.length,
                // 重置各种筛选条件
                searchQuery: '',
                selectedSearchField: 'all', 
                selectrangequeryParams: '',
                selectedDateRange: [null, null],//日期筛选器重置
                selectedRowKeys: [],
            });
        // 检查面板是否发生变化
        if (this.props.currentPanel !== prevProps.currentPanel) {
            // 如果面板发生变化，重置selectedRowKeys和lastUpdated
            this.setState(
                {
                    lastUpdated: null,
                    // 重置各种筛选条件
                    searchQuery: '',
                    selectedSearchField: 'all', 
                    selectrangequeryParams: '',
                    selectedDateRange: [null, null],//日期筛选器重置
                    selectedRowKeys: [],
                    
                    selectedApplicationType: null,//只用于‘应用’这个子页面
                },
                () => {
                    // 异步调用fetchLatestData来确保setState完成后执行
                    this.props.fetchLatestData(this.state.selectedSearchField, '', '');
                }
            );
        }
        }
    }

    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys });
        //傳遞給父組件以構建DELETE請求，刪除在數據庫中刪除被選中的條目
        if (this.props.onSelectedRowKeysChange) {
            this.props.onSelectedRowKeysChange(selectedRowKeys);
        }
    };

    handlePageChange = (page: number, pageSize?: number) => {
        this.setState({ 
            currentPage: page, 
            pageSize: pageSize?pageSize:10,
            selectedRowKeys: [],
        });
    };
    autoPopulateFilters = () => {
        const { columns, externalDataSource } = this.props;

        const newColumns = columns.map(column => {
          if (column.onFilter && externalDataSource) {
            const fieldVarieties = new Set(externalDataSource.map(item => item[column.dataIndex]));
            const filters = Array.from(fieldVarieties).map(variety => ({
              text: (
                <span style={{ color: '#000'}}>
                  {variety ? variety.toString() : ''}
                </span>
              ),
              value: variety,
            }));
            return { ...column, filters };
          }
          return column;
        });

        return newColumns;
    };
    // 渲染侧边栏组件
    renderSidebar = () => {
        const applicationTypes = ['全部应用', '数据库', 'Web服务器', 'DevOps工具', '缓存服务']; // 示例应用类型，后续最好读取后再构造菜单

        
        return (<div></div>
            // <SidebarComponent onApplicationTypeSelect={this.props.handleApplicationTypeSelect} />
        );
    };

    handleExport = () => {
        const { externalDataSource, columns } = this.props;
    
        // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
        if (this.state.selectedRowKeys.length === 0 || externalDataSource.length === 0) {
            alert('没有可导出的数据');
            return;
        }
    
        // 筛选出要导出的数据
        const dataToExport = externalDataSource.filter((item) => this.state.selectedRowKeys.includes(item.id));
    
        // 创建 CSV 字符串
        let csvContent = '';
    
        // 添加标题行（从 columns 获取列标题）
        const headers = columns.map(column => `"${column.title}"`).join(",");
        csvContent += headers + "\r\n";
    
        // 添加数据行（根据 columns 的 dataIndex 来获取值）
        dataToExport.forEach(item => {
            const row = columns.map(column => {
                const value = item[column.dataIndex];
                return `"${value}"`; // 用引号包裹，以便正确处理包含逗号或换行符的数据
            }).join(",");
            csvContent += row + "\r\n";
        });
    
        // UTF-8 编码的字节顺序标记 (BOM)
        const BOM = "\uFEFF";
    
        // 创建 Blob 对象
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const href = URL.createObjectURL(blob);
    
        // 创建下载链接并点击
        const link = document.createElement('a');
        link.href = href;
        link.download = 'export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
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

    renderSearchFieldDropdown = (columns: any[]) => {
        return (
            <Select
                style={{ width: '200px', marginRight: '8px' }}
                placeholder="选择搜索字段"
                onChange={this.handleSearchFieldChange}
            >
                {columns.map((column, index) => (
                    <Option key={index} value={column.dataIndex}>
                        {column.title}
                    </Option>
                ))}
            </Select>
        );
    };

    handleDeleteSelected = () => {
        // 调用父组件的删除方法
        if (this.props.onDeleteSelected) {
            this.props.onDeleteSelected(this.state.selectedRowKeys);
        }

        // 重置选中的行
        this.setState({ selectedRowKeys: [] });
    };
    onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
        if (dates) {
            const [start, end] = dateStrings;
            this.setState({ selectedDateRange: [start, end] });
    
            const { timeColumnIndex } = this.props;
            if (timeColumnIndex) {
                // 转换日期为 Unix 时间戳（秒）
                const startDateTimestamp = moment(start).unix();
                const endDateTimestamp = moment(end).unix();
                
                const selectedqueryParams = buildRangeQueryParams(startDateTimestamp.toString(), endDateTimestamp.toString(), timeColumnIndex[0]);
                
                this.props.onUpdateRangeField(selectedqueryParams);
                this.setState({ selectrangequeryParams: selectedqueryParams }, () => {
                    // 在状态更新后立即触发数据获取
                    this.props.fetchLatestData('', '', selectedqueryParams);
                });
            }
        } else {
            this.setState({ selectedDateRange: [null, null], selectrangequeryParams: '' }, () => {
                // 当日期范围被清空时，重置数据
                this.props.fetchLatestData('all', '', '');
            });
        }
    };
    
    handleSearchFieldChange = (selectedField: string) => {
        this.props.onUpdateSearchField(selectedField);
        this.setState({ selectedSearchField: selectedField });
      };
    
      handleSearch = (query: string) => {
        this.props.onUpdateSearchQuery(query);
        // 调用 fetchLatestData 使用最新的搜索字段和查询值
        this.props.fetchLatestData(this.state.selectedSearchField, query, '');
      };


    render() {
        // const { externalDataSource, columns } = this.props;
        // const { currentPage, pageSize, total } = this.state;
        
        const rowSelection = {//checkbox勾选状态独立
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const newColumns = this.autoPopulateFilters();

        const isButtonDisabled = this.props.externalDataSource.length === 0 || this.state.selectedRowKeys.length === 0;
        return (//Table的宽度被设置为1330px
        <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', width: '1320px', maxWidth: '100%' }}>
            <Row gutter={[12, 6]} style={{ marginTop: '10px'}}>
                {/* Conditionally render the sidebar for applications */}
                {this.props.currentPanel === 'applications1' && (
                    <Col md={4} style={{ paddingRight: '12px', borderRight: '1px solid #ccc' }}>
                        {/* Render Sidebar here */}
                        {this.renderSidebar()}
                    </Col>
                )}

                {/* Main content area */}
                <Col
                    md={this.props.currentPanel === 'applications1' ? 20 : 24}
                    style={{
                        paddingLeft: this.props.currentPanel === 'applications1' ? '12px' : '0px',
                    }}
                >
                    <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
                                <Col flex="none">
                                    <Button
                                        style={{ 
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleExport}
                                        disabled={isButtonDisabled}
                                    >
                                        批量导出
                                    </Button>
                                    <Button
                                        style={{ 
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleDeleteSelected}
                                        disabled={isButtonDisabled}
                                    >
                                    刪除選中行
                                    </Button>
                                    <Button onClick={() =>this.props.fetchLatestData('all', '', '')}>采集最新数据</Button>
                                    {/* <Button onClick={fetchData}>采集最新数据</Button> */}
                                </Col>
                                <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10 }}>
                                    <span>最近更新時間: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                </Col>
                                {this.props.timeColumnIndex && this.props.timeColumnIndex.length > 0 && (
                                <Col flex="none" style={{ marginLeft: 'auto' }}>
                                    <RangePicker style={{ width: 250 }} onChange={this.onDateRangeChange}/>
                                </Col>
                                )}
                                {/* <Col flex="none" style={{ marginLeft: 'auto' }}>
                                    <RangePicker style={{ width: 200 }} />
                                </Col> */}
                            </Row>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Row>
                                {this.renderSearchFieldDropdown(this.props.columns)}  
                                <Input.Search
                                    placeholder="搜索已选字段"
                                    onSearch={this.handleSearch}
                                    style={{ width: this.props.currentPanel === 'applications' ? '67%' : '83%' }}
                                />
                                {/* <Button
                                    icon={<SyncOutlined />}
                                    onClick={() =>this.props.fetchLatestData('', '', '')} // 直接调用函数引用//this.state.selectedSearchField
                                    style={{ marginLeft: this.props.currentPanel === 'applications' ? '12px' : '27px' }}
                                /> */}
                            </Row>
                        </div>
                        {/* <span>{this.state.selectedSearchField}</span> */}
                        <Table
                            className="customTable"
                            rowSelection={rowSelection}
                            //pagination={false}
                            dataSource={this.props.externalDataSource}
                            columns={newColumns}
                            rowKey={this.props.columns[0].key}//使用第一个字段区分各个row，最好是PK
                            //locale={{ emptyText: 'No Data' }} // 可以指定无数据时展示的文本
                        />
                        {/* <Pagination // 分页组件
                            current={this.state.currentPage}
                            pageSize={this.state.pageSize}
                            total={this.props.externalDataSource.length} // 总行数
                            onChange={this.handlePageChange} // 处理分页切换
                            showSizeChanger={false} // 不显示每页行数切换
                            style={{ marginTop: '16px', textAlign: 'center' }}
                    /> */}
                    </Card>
                </Col>
            </Row>
        </div>
        );
    }
}

export default CustomDataTable;
