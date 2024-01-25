import React from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Menu,Pagination, Select } from 'antd';
import SidebarComponent from '../SubComponents/SidebarComponent'
import { SyncOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { buildRangeQueryParams,fetchDataFromAPI, processData } from './DataService';

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
        this.props.fetchLatestData('','','')
        //const newColumns = autoPopulateFilters();
    }
    componentDidUpdate(prevProps: any, prevState:any) {

        if (prevProps.externalDataSource !== this.props.externalDataSource) {
            // 处理新数据：例如重置分页或更新最后更新时间
            this.setState({
                currentPage: 1,
                lastUpdated: new Date().toLocaleString(),
                total: this.props.externalDataSource.length,
            });
        // 检查面板是否发生变化
        if (this.props.currentPanel !== prevProps.currentPanel) {
            // 如果面板发生变化，重置selectedRowKeys和lastUpdated
            this.setState(
                {
                    selectedRowKeys: [],
                    lastUpdated: null, // 重置lastUpdated
                    
                    // 重置各种筛选条件
                    searchQuery: '',
                    selectedSearchField: '', 
                    selectrangequeryParams: '',
                    
                    selectedApplicationType: null,//只用于‘应用’这个子页面
                    selectedDateRange: [null, null],//日期筛选器重置
                    currentPage: 1,


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
    };
    handlePageChange = (page: number, pageSize?: number) => {
        this.setState({ currentPage: page });
        // 如果需要，也可以在这里处理 pageSize 的变化
    };
    // onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
    //     if (dates) {
    //         const [start, end] = dateStrings;
    //         this.setState({ selectedDateRange: [start, end] });
    //     } else {
    //         this.setState({ selectedDateRange: [null, null] });
    //     }
    //     const { selectedDateRange } = this.state;
    //     const { timeColumnIndex } = this.props;
    //     if (selectedDateRange[0] && selectedDateRange[1] && timeColumnIndex) {
    //         // 假设 timeColumnIndex 是一个包含 dataIndex 的数组
    //         const timeColumnDataIndex = timeColumnIndex[0]; // 选择适当的索引或字段
    
    //         const startDate = moment(selectedDateRange[0]).format('YYYY-MM-DD');
    //         const endDate = moment(selectedDateRange[1]).format('YYYY-MM-DD');
            
    //         const selectedqueryParams = buildRangeQueryParams(startDate, endDate, timeColumnDataIndex);
    //         this.setState({ selectrangequeryParams: selectedqueryParams});

    //         //调用 API
    //         try{
    //             this.handleRangeFieldChange(selectedqueryParams);
    //             this.props.fetchLatestData('', '', selectedqueryParams);
    //         }catch(error){
    //                 console.error('Error fetching data:', error);
    //         }
    //     };
    // }
    onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
        if (dates) {
            const [start, end] = dateStrings;
            this.setState({ selectedDateRange: [start, end] });
        } else {
            this.setState({ selectedDateRange: [null, null] });
        }
        const { selectedDateRange } = this.state;
        const { timeColumnIndex } = this.props;
        if (selectedDateRange[0] && selectedDateRange[1] && timeColumnIndex) {
            // 转换日期为 Unix 时间戳（秒）
            const startDateTimestamp = moment(selectedDateRange[0]).startOf('day').unix();
            const endDateTimestamp = moment(selectedDateRange[1]).endOf('day').unix();
    
            const selectedqueryParams = buildRangeQueryParams(startDateTimestamp.toString(), endDateTimestamp.toString(), timeColumnIndex[0]);
            this.setState({ selectrangequeryParams: selectedqueryParams });
    
            this.handleRangeFieldChange(selectedqueryParams);
            this.props.fetchLatestData('', '', selectedqueryParams);
            // 调用 API
            // try {
            //     this.handleRangeFieldChange(selectedqueryParams);
            //     this.props.fetchLatestData('', '', selectedqueryParams);
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            // }
        }
    };
    
    // 渲染侧边栏组件
    renderSidebar = () => {
        const applicationTypes = ['全部应用', '数据库', 'Web服务器', 'DevOps工具', '缓存服务']; // 示例应用类型，后续最好读取后再构造菜单

        
        return (<div></div>
            // <SidebarComponent onApplicationTypeSelect={this.props.handleApplicationTypeSelect} />
        );
    };
    handleExport = () => {
        const { externalDataSource } = this.props;

        // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
        if (this.state.selectedRowKeys.length === 0 || externalDataSource.length === 0) {
            alert('没有可导出的数据');
            return;
        }
        const dataToExport = externalDataSource.filter((item) => this.state.selectedRowKeys.includes(item.id));
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // 处理侧边栏选择事件
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
    handleRangeFieldChange = (queryParams: string) => {
        this.props.onUpdateRangeField(queryParams);
        this.setState({ selectrangequeryParams: queryParams });
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
        const { externalDataSource, columns } = this.props;
        const { currentPage, pageSize, total } = this.state;
        
        const rowSelection = {//checkbox勾选状态独立
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const isButtonDisabled = this.props.externalDataSource.length === 0 || this.state.selectedRowKeys.length === 0;
        return (//Table的宽度被设置为1330px
        <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', width: '1330px', maxWidth: '100%' }}>
            <Row gutter={[12, 6]} style={{ marginTop: '10px'}}>
                {/* Conditionally render the sidebar for applications */}
                {this.props.currentPanel === 'applications' && (
                    <Col md={4} style={{ paddingRight: '12px', borderRight: '1px solid #ccc' }}>
                        {/* Render Sidebar here */}
                        {this.renderSidebar()}
                    </Col>
                )}

                {/* Main content area */}
                <Col
                    md={this.props.currentPanel === 'applications' ? 20 : 24}
                    style={{
                        paddingLeft: this.props.currentPanel === 'applications' ? '12px' : '0px',
                    }}
                >
                    <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
                                <Col flex="none">
                                    <Button
                                        style={{ marginRight: 8,
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleExport}
                                        disabled={isButtonDisabled}
                                    >
                                        批量导出
                                    </Button>
                                    <Button onClick={() =>this.props.fetchLatestData('', '', '')}>采集最新数据</Button>
                                    {/* <Button onClick={fetchData}>采集最新数据</Button> */}
                                </Col>
                                <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10 }}>
                                    <span>最近更新时间: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
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
                                    style={{ width: this.props.currentPanel === 'applications' ? '67%' : '77%' }}
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
                            pagination={false}
                            dataSource={this.props.externalDataSource}
                            columns={this.props.columns}
                            rowKey="id"
                            //locale={{ emptyText: 'No Data' }} // 可以指定无数据时展示的文本
                        />
                        <Pagination // 分页组件
                        current={this.state.currentPage}
                        pageSize={this.state.pageSize}
                        total={this.props.externalDataSource.length} // 总行数
                        onChange={this.handlePageChange} // 处理分页切换
                        showSizeChanger={false} // 不显示每页行数切换
                        style={{ marginTop: '16px', textAlign: 'center' }}
                    />
                    </Card>
                </Col>
            </Row>
            
            {/* <Table
                    className="customTable"
                    dataSource={externalDataSource}
                    columns={columns}
                    pagination={false} // 禁用表格自带的分页
                />
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={this.handlePageChange}
                    // 根据需要添加其他分页属性
                /> */}
        </div>
        );
    }
}

export default CustomDataTable;
