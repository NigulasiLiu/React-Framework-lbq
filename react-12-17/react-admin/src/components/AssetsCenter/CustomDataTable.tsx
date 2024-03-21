import React, {useState} from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Select, Form, Modal } from 'antd';
import SidebarComponent from '../SubComponents/SidebarComponent'
import moment, { Moment } from 'moment';
import { buildRangeQueryParams} from './DataService';
import { simplifiedTablePanel } from '../tableUtils';

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
    currentPanel: string;

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

    // 排序或者过滤处理后的data
    sortedData: GenericDataItem[],
    sortConfig: null,
    topFiveSortedData: GenericDataItem[];

    showModal: boolean;
    user_character: string;
    dataSourceChanged:boolean;
    panelChanged: boolean;
}
const { TextArea } = Input;


class CustomDataTable extends React.Component<CustomDataTableProps, CustomDataTableState> {
    constructor(props: CustomDataTableProps) {
        super(props);
        this.state = {
            showModal: false,
            user_character: 'admin',


            topFiveSortedData: [],

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

            
            // 排序或者过滤处理后的data
            sortedData: [],
            sortConfig: null,

            panelChanged: false,
            dataSourceChanged: false,

        };
    }
    componentDidMount() {
        this.props.fetchLatestData('all','','')
        //const newColumns = autoPopulateFilters();
        //渲染筛选器等等Pp
        //this.sortAndExtractTopFive(this.props.externalDataSource);
    }
    componentDidUpdate(prevProps: any, prevState:any) {
        if (prevProps.externalDataSource !== this.props.externalDataSource) {
            //this.sortAndExtractTopFive(this.props.externalDataSource);
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
                dataSourceChanged: true,
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
                    panelChanged: true,
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
    // 处理表格排序变化的函数

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
            <Row style={{width:'15%', marginLeft: '0px', marginRight: 'auto'}}>
                <Select
                    style={{ width: this.props.currentPanel.includes('sidebar')?'120px':'200px', marginRight: '8px' }}
                    placeholder="选择搜索字段"
                    onChange={this.handleSearchFieldChange}
                >
                    {columns.map((column, index) => (
                        <Option key={index} value={column.dataIndex}>
                            {column.title}
                        </Option>
                    ))}
                </Select>
            </Row>
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

      showModal = () => {
          this.setState({
            showModal: true,
          });
      };
      toggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
        }));
    };

      handleFormCharaterFieldChange = (value:string) => {
        this.setState({
            user_character: value,
          });
      };
        handleOk = () => {
          this.setState({
            showModal: false,
          });
          // 这里处理确认操作
        };
      
        handleCancel = () => {
          this.setState({
            showModal: false,
          });
        };
        formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 14 },
            },
          };


        renderModal = () => {
          return (
            <>
            {/* <Button type="primary" onClick={this.showModal}>
              新建 SHA256 任务
            </Button> */}
            <Modal
            style={{fontWeight:'bolder'}}
              title="新增用户"
              visible={this.state.showModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button style={{backgroundColor:'white',color:'black'}} key="back" onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button style={{backgroundColor:'#1664FF',color:'white'}} key="submit" type="primary" onClick={this.handleOk}>
                  提交任务
                </Button>,
              ]}
            >
                <Form {...this.formItemLayout}
                    name="new_user_info"
                >
                    <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '用户名支持中英文和数字，不少于四个字符' }]}
                    >
                    <Input placeholder="用户名支持中英文和数字，不少于四个字符" />
                    </Form.Item>
                    <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '密码长度不少于4个字符' }]}
                    >
                    <Input placeholder="密码长度不少于4个字符" />
                    </Form.Item>
                    <Form.Item
                    label="确认密码"
                    name="password"
                    rules={[{ required: true, message: '请再次输入密码' }]}
                    >
                    <Input placeholder="请再次输入密码" />
                    </Form.Item>
                    <Form.Item
                    label="用户角色"
                    name="cycle"
                    rules={[{ required: true, message: '请选择用户角色' }]}
                    >
                    <Select placeholder="用户角色" defaultValue="admin" onChange={this.handleFormCharaterFieldChange}>
                        <Option value="admin">管理员</Option>
                        <Option value="user">普通用户</Option>
                        {/* 更多选项... */}
                    </Select>
                    </Form.Item>
                    
                    {this.state.user_character === 'admin' && (
                    <>
                    <Form.Item label="说明"
                    name="description">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 拥有全部功能的读写权限
                        </p>
                    </Form.Item>
                    <Form.Item label="用户权限"
                    name="auth">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 读写
                        </p>
                    </Form.Item>
                    </>)}
                    {this.state.user_character === 'user' && (
                    <>
                    <Form.Item label="说明"
                    name="description">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 拥有全部功能的只读权限
                        </p>
                    </Form.Item>
                    <Form.Item label="用户权限"
                    name="auth">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 只读
                        </p>
                    </Form.Item>
                    </>)}
                </Form>
            </Modal>
          </>
          );
        };

    render() {       
          // 构建无数据时的展示配置
            const customLocale = {
                emptyText: '没有数据'
            }; 
        const rowSelection = {//checkbox勾选状态独立
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const newColumns = this.autoPopulateFilters();
        const isSidebar=this.props.currentPanel.includes("sidebar")
        const isButtonDisabled = this.props.externalDataSource.length === 0 
                    || this.state.selectedRowKeys.length === 0
                    || isSidebar;

        const tableWidth=this.props.currentPanel.includes('large')?'1000px':(this.props.currentPanel?.includes('sidebar')?'100%':'100%');
    

        const compStyle_small={
            textAlign: 'center',
            maxwidth: '90px',
            height: '30px',
            // 由于按钮高度较小，可能需要调整字体大小或内边距来改善显示
            fontSize: '12px', // 根据需要调整字体大小
            //borderRadius: '4px', // 如果您想要圆角边框
            
        }

        const compStyle_normal={
            //opacity: isButtonDisabled ? 0.5 : 1,
        }

        const selectedcompStyle = isSidebar
        ? compStyle_small
        : compStyle_normal;

        const selectedTableStyle = isSidebar
        ? 'customTable':'customTable';

        const fontSizeSmall=this.props.currentPanel?.includes('sidebar')?'12px':'14px';

        // 传递 toggleModal 方法给 FetchAPIDataTable 组件
        const dataTableProps = {
            toggleModal: this.toggleModal,
            // ...这里添加更多需要传递的props
        };



        return (//Table的宽度被设置为1330px
        <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', 
        width: this.props.currentPanel?.includes('baseLineDetectScanResult1')?'64%':tableWidth }}>
            <Row gutter={[12, 6]} style={{ marginTop: '-10px'}}>
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
                        {!simplifiedTablePanel.includes(this.props.currentPanel) && (
                        <div style={{ marginBottom: '16px' }}>
                            <Row gutter={16} >
                                <Col flex="none">
                                    <Button
                                        style={{...selectedcompStyle,
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleExport}
                                        disabled={isButtonDisabled}
                                    >
                                        批量导出
                                    </Button>
                                    <Button
                                        style={{...selectedcompStyle,
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleDeleteSelected}
                                        disabled={isButtonDisabled}
                                    >
                                    待定按键
                                    </Button>
                                    <Button 
                                        style={{...selectedcompStyle,}}
                                        onClick={() =>this.props.fetchLatestData('all', '', '')}>
                                    采集最新数据
                                    </Button>
                                </Col>
                                <Col flex="auto" style={{ textAlign: 'left', marginLeft: isSidebar?2:10,marginTop:'5px', 
                                fontSize: isSidebar?'12px':''}}>
                                    <span>最近更新時間: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                </Col>
                                {!isSidebar && this.props.timeColumnIndex && this.props.timeColumnIndex.length > 0 && (
                                <Col flex="none" style={{ marginLeft: 'auto' }}>
                                    <RangePicker style={{ width: 250 }} onChange={this.onDateRangeChange}/>
                                </Col>
                                )}
                                {/* <Col flex="none" style={{ marginLeft: 'auto' }}>
                                    <RangePicker style={{ width: 200 }} />
                                </Col> */}
                            </Row>
                        </div>)}
                        {this.props.currentPanel==='UserManagementlist' && (
                        <div style={{ marginBottom: '16px' }}>
                            <Row gutter={16} >
                                <Col flex="none">
                                    <Button 
                                        onClick={this.showModal}
                                        style={{backgroundColor:'#1664FF',color:'white'}}>新增用户
                                    </Button>
                                    <Button
                                        style={{...selectedcompStyle,
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleExport}
                                        disabled={isButtonDisabled}
                                    >
                                        批量导出
                                    </Button>
                                    {/* <Button 
                                    style={{backgroundColor:'white',color:'black'}} 
                                    onClick={this.handleExport}
                                    disabled={isButtonDisabled}>批量删除</Button> */}
                                </Col>
                            </Row>
                        </div>)}
                        <div style={{ marginBottom: 16 }}>
                            <Row>
                                {this.renderSearchFieldDropdown(this.props.columns)}  
                                <Row style={{width: isSidebar?'50%':'70%',}}>
                                <Input.Search
                                    placeholder="搜索已选字段"
                                    onSearch={this.handleSearch}
                                    //style={{ width: isSidebar?300:1000 }}
                                    style={{width: isSidebar?300:1000, marginLeft: 'auto', marginRight: '0px'}}
                                />
                                </Row>
                            </Row>
                        </div>
                        <Table
                            className={selectedTableStyle}
                            rowSelection={rowSelection}
                            rowKey={this.props.columns[0].key}//使用第一个字段区分各个row，最好是PK
                            dataSource={this.props.externalDataSource}
                            //dataSource={this.state.topFiveSortedData}
                            columns={newColumns}
                            //pagination={false}
                            locale={(this.state.panelChanged&&this.state.dataSourceChanged) && (this.props.externalDataSource.length === 0) 
                                ? customLocale:undefined}
                        />
                    </Card>
                </Col>
            </Row>
            {this.renderModal()}
        </div>
        );
    }
}

export default CustomDataTable;
