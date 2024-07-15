import React from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Select, Form, Modal, message } from 'antd';
import moment, { Moment } from 'moment';
import { FilterDropdownProps, TableWithoutTimestamp } from '../Columns';
import { ExclamationCircleOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { handleExport } from '../ContextAPI/DataService';
import { Link } from 'react-router-dom';

const { Option } = Select;

type RangeValue<T> = [T | null, T | null] | null;
const { RangePicker } = DatePicker;

interface GenericDataItem {
    [key: string]: any;
}

interface TaskDisplayTableProps {
    externalDataSource: any[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    searchColumns?: string[];
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

    handleReload?: () => void;
}

interface TaskDisplayTableState {
    triggerUpdate:number,
    newColumns: any[],
    lastUpdated: string | null;
    selectedDateRange: [string | null, string | null];

    selectedRowKeys: React.Key[];// 可选属性，代表被选中行的keys，用于控制独立的key
    selectedRows: any[];//存储整行数据
    clearKeys: boolean;

    selectedApplicationType: string | null,
    searchQuery: string;
    selectedSearchField: string;
    currentPanelName: string;
    panelChangeCount: number;

    selectrangequeryParams: string;

    // 排序或者过滤处理后的data
    sortedData: GenericDataItem[],
    sortConfig: null,

    showModal: boolean;
    // user_character: string;
    fetchDataCalled: number;
}


class TaskDisplayTable extends React.Component<TaskDisplayTableProps, TaskDisplayTableState> {
    constructor(props: TaskDisplayTableProps) {
        super(props);
        this.state = {
            triggerUpdate:0,
            newColumns: [],
            // showModal: false,
            // user_character: 'admin',

            selectedRowKeys: [],
            selectedRows: [],
            clearKeys: false,

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

            showModal: false,
            fetchDataCalled: 0, // 初始化数据获取调用计数
        };
    }

    componentDidMount() {
        this.fetchDataIfNeeded();
        this.setState({
            lastUpdated: new Date().toLocaleString(),
            // newColumns:this.generate_new_columns(this.props.columns, this.props.searchColumns),
        });
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
        // if (prevProps.columns!==this.props.columns) {
        //     this.setState({
        //         newColumns: this.generate_new_columns(this.state.newColumns, this.props.searchColumns),
        //     });
        //     // const tempColumn = this.state.newColumns.map((column: any) => {
        //     //         if (column.filterDropdown) {
        //     //             // 手动清除筛选条件
        //     //             if (column.filterDropdown.clearFilters) {
        //     //                 console.log("清空 " + this.props.apiEndpoint + "input 中的值");
        //     //                 column.filterDropdown.clearFilters();
        //     //             }
        //     //             else {
        //     //                 console.log("没有clearFilters");
        //     //             }
        //     //         }
        //     //         return column;
        //     //     });
        //     // this.setState({
        //     //     newColumns: tempColumn,
        //     // });
        // }
    }

    fetchDataIfNeeded() {
        // 如果数据未被获取过，或者只获取了一次，则调用获取数据
        if (this.state.fetchDataCalled < 1) {
            console.log('this.state.fetchDataCalled change ' + this.state.fetchDataCalled + ' times.');

            this.props.fetchLatestData(this.props.apiEndpoint, '', '', '');
            this.setState(prevState => ({
                lastUpdated: new Date().toLocaleString(),
                fetchDataCalled: prevState.fetchDataCalled + 1, // 增加调用次数
            }));
        }
    }

    //更新 handleFetchLatestData 以接受搜索字段和搜索查询
    handleFetchLatestData = (field: string, query: string, rangeQueryParams: string) => {
        this.props.fetchLatestData(this.props.apiEndpoint, '', '', '');
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        });
        console.log('time changed:' + this.state.lastUpdated);
    };


    onSelectChange = (selectedRowKeys: React.Key[]) => {
        // 使用选中行的键值获取对应的行数据，存储到 selectedRows 中
        const selectedRows = selectedRowKeys.map(key => {
            const row = this.props.externalDataSource.find(row => row[this.props.columns[this.props.keyIndex || 0].key] === key);
            return row ? { ...row } : null; // 复制对象以避免直接修改原始数据
        }).filter(row => row !== null); // 过滤掉空行数据

        // 在这里输出一下选中的行数据，以确保它们被正确地获取到了
        if(selectedRows){
            console.log('Selected rows:', selectedRows);
            selectedRows.map(row=>console.log('Selected selectedRows uuid:', row.uuid));

            // 过滤出状态为 'Online' 的行的 keys
            const onlineSelectedRowKeys = selectedRows.filter(row => row.status === 'Online').map(row => row[this.props.columns[this.props.keyIndex || 0].key]);

            onlineSelectedRowKeys.map(row=>console.log('Selected onlineSelectedRowKeys uuid:', row.uuid));
            this.setState({
                selectedRowKeys,
                selectedRows, // 更新 selectedRows
            });

            if (this.props.onSelectedRowKeysChange) {
                this.props.onSelectedRowKeysChange(onlineSelectedRowKeys);
            }
        }
    };


    //后续为这里的输入参数column添加筛选
    generate_new_columns = (columns: any[], search_index = ['']): any[] => {
        // 遍历this.props.columns中的每一列
        return columns.map((column: any) => {
            if (!column.filterDropdown){
                // 如果列名在search_index中
                if (search_index.includes(column.dataIndex)) {
                    // 为这列添加搜索功能
                    return {
                        ...column,
                        //   filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#FF0000' : undefined }} />, // 调整颜色以引人注目

                        filterIcon: (filtered: boolean) => (
                            <div>
                                {/* 添加动画效果 */}
                                <SearchOutlined
                                    style={{ color: filtered ? '#1890ff' : undefined, transition: 'color 0.3s' }} />
                                {/* 显示提醒标志 */}
                                {filtered && <ExclamationCircleOutlined
                                    style={{ position: 'absolute', top: -4, right: -4, color: '#FF4500' }} />}
                                {/* 增加背景色或边框 */}
                                <div style={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -6,
                                    width: 16,
                                    height: 16,
                                    backgroundColor: '#FF4500',
                                    borderRadius: '50%',
                                    display: filtered ? 'block' : 'none',
                                }}></div>
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
                                        filterDropdownProps.confirm();
                                        this.setState({ selectedRowKeys: [] });
                                    }}
                                    size="small"
                                    style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
                                >
                                    搜索
                                </Button>
                                <Button
                                    disabled={filterDropdownProps.clearFilters === undefined}
                                    onClick={() => {
                                        filterDropdownProps.clearFilters?.();
                                        this.setState({ selectedRowKeys: [] });
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
            }
            // else{
            //     // 手动清除筛选条件
            //     if (column.filterDropdown.clearFilters) {
            //         console.log("清空 " + this.props.apiEndpoint + "input 中的值");
            //         column.filterDropdown.clearFilters();
            //     }
            //     else {
            //         console.log("没有clearFilters");
            //     }
            // }
        });

    };

    // toggleModal = () => {
    //     this.setState(prevState => ({
    //         showModal: !prevState.showModal,
    //         // selectedRows: record, // 设置当前记录，以便后续操作
    //     }));
    // };
    // handleOk = async () => {
    //     // 处理忽略操作
    //     console.log("selectedRows:", this.state.selectedRows);
    //     if (this.state.selectedRows && this.state.selectedRows.length > 0 && this.state.selectedRows[0]) {
    //         const record = this.state.selectedRows.map(row => row.uuid);
    //         await handleDelete(this.props.currentPanel, record);
    //     } else {
    //         message.info("selectedRows中没有有效数据");
    //     }
    //     this.toggleModal(); // 关闭模态框
    // };
    // handleCancel = () => {
    //     this.toggleModal(); // 关闭模态框
    // };
    // renderModal = (rows: any[]) => {
    //     return (
    //         <>
    //             <Modal
    //                 title="确认操作"
    //                 visible={this.state.showModal}
    //                 onOk={this.handleOk}
    //                 onCancel={this.handleCancel}
    //                 footer={[
    //                     <Button key="back" onClick={this.handleCancel}>
    //                         取消
    //                     </Button>,
    //                     <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }}
    //                             onClick={this.handleOk}>
    //                         是
    //                     </Button>,
    //                 ]}
    //                 //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
    //             >
    //                 确认删除选中的:{rows.map(row => (
    //                         <span key={row.uuid}>
    //                 <Link to={`/app/detailspage?uuid=${encodeURIComponent(row.uuid)}`} target="_blank">
    //                     <Button style={{
    //                         fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF',
    //                         padding: '0 0'
    //                     }}>{row.uuid.slice(0, 5)}</Button>
    //                 </Link>
    //                             {' '}
    //                 </span>
    //                     ))}
    //                         条目?
    //             </Modal>
    //         </>
    //     );
    // };


    render() {
        // 构建无数据时的展示配置

        const new_columns = this.generate_new_columns(this.props.columns, this.props.searchColumns);
        let columns_map:Record<string, any[]> = {};
        columns_map[this.props.currentPanel] = new_columns;
        const rowSelection = {//checkbox勾选状态独立
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { externalDataSource } = this.props;

        //const newColumns = this.autoPopulateFilters();
        const isSidebar = this.props.currentPanel.includes('sidebar');
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

        };

        const compStyle_normal = {
            //opacity: isButtonDisabled ? 0.5 : 1,
        };

        const selectedcompStyle = isSidebar
            ? compStyle_small
            : compStyle_normal;

        const selectedTableStyle = isSidebar
            ? 'customTable' : 'customTable';

        const fontSizeSmall = this.props.currentPanel?.includes('sidebar') ? '12px' : '14px';


        return (//Table的宽度被设置为1330px
            <div style={{
                // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                fontWeight: 'bold',
                width: this.props.currentPanel?.includes('baseLineDetectScanResult1') ? '64%' : tableWidth,
            }}>
                {/*{this.renderModal(this.state.selectedRows)}*/}
                <Row gutter={[12, 6]} style={{ marginTop: '-10px' }}>
                    {/* Main content area */}
                    <Col
                        md={this.props.currentPanel === 'applications1' ? 20 : 24}
                        style={{
                            paddingLeft: this.props.currentPanel === 'applications1' ? '12px' : '0px',
                        }}
                    >
                        <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                            {!TableWithoutTimestamp.includes(this.props.currentPanel) && (
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={[2, 2]}>
                                        <Col flex="none">
                                            <Button
                                                style={{
                                                    ...selectedcompStyle, marginRight: '10px',
                                                    opacity: isButtonDisabled ? 0.5 : 1,
                                                }}
                                                onClick={() => handleExport(this.props.externalDataSource,
                                                    this.props.currentPanel, this.state.selectedRowKeys)}
                                                disabled={isButtonDisabled}
                                            >
                                                批量导出
                                            </Button>
                                            {/*{(this.props.currentPanel!=="createnewtask" &&*/}
                                            {/*    <Button*/}
                                            {/*        style={{*/}
                                            {/*            ...selectedcompStyle, backgroundColor: isButtonDisabled?'#f6c6cf':'#fb1440', color: 'white', marginRight: '10px',*/}
                                            {/*            transition: 'opacity 0.3s', // 添加过渡效果*/}
                                            {/*            opacity: 1, // 初始透明度*/}
                                            {/*        }}*/}
                                            {/*        onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.7; }} // 鼠标进入时将透明度设置为0.5*/}
                                            {/*        onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }} // 鼠标离开时恢复透明度为1*/}
                                            {/*        onClick={() => this.toggleModal()}*/}
                                            {/*        disabled={isButtonDisabled}*/}
                                            {/*    >*/}
                                            {/*        批量删除*/}
                                            {/*    </Button>)}*/}

                                        </Col>
                                        <Col flex="auto" style={{
                                            textAlign: 'left', marginLeft: isSidebar ? 2 : 10, marginTop: '5px',
                                            fontSize: isSidebar ? '12px' : '',
                                        }}>
                                            <span>最近更新時間: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                        </Col>

                                        <Col style={{ textAlign: 'left', marginLeft: 10, marginRight: '0px' }}>
                                            <Button icon={<ReloadOutlined />}
                                                    onClick={this.props.handleReload}>刷新</Button>
                                        </Col>
                                        {/* {!isSidebar && this.props.timeColumnIndex && this.props.timeColumnIndex.length > 0 && (
                                <Col flex="none" span={5} style={{ marginLeft: 'auto',marginRight:'0px' }}>
                                    <RangePicker onChange={this.onDateRangeChange}/>
                                </Col>
                                )} */}
                                    </Row>
                                </div>
                            )}
                            <Table
                                className={selectedTableStyle}
                                rowSelection={rowSelection}
                                rowKey={this.props.columns[this.props.keyIndex || 0].key}//使用第一个字段区分各个row，最好是PK
                                dataSource={externalDataSource}//externalDataSource
                                columns={columns_map[this.props.currentPanel]}
                                pagination={{
                                    showQuickJumper: true,
                                    pageSize: (this.props.currentPanel.includes('_details') ? 5 : 8),
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

export default TaskDisplayTable;