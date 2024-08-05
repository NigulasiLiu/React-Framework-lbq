import React from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, notification, message } from 'antd';
import CustomNotification from '../ui/CustomNotification';
import { ExclamationCircleOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from '../Columns';
import { handleExport } from '../ContextAPI/DataService';
import { Link } from 'react-router-dom';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import moment from 'moment';
import ReactDOM from 'react-dom';
import { blueButton } from '../../style/config';

const { RangePicker } = DatePicker;

interface GenericDataItem {
    [key: string]: any;
}

interface DataDisplayTableProps {
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    searchColumns?: string[];
    currentPanel: string;

    externalDataSource: any[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    apiEndpoint: string;
    apiUuid?: (uuid: string) => string;
    uuid?:string;
    childrenColumnName?: string; // 作为可选属性
    expandedRowRender?: (record: any) => React.ReactNode; // 添加expandedRowRender属性
    indentSize?: number; // 也可以声明为可选属性，如果您希望为其提供默认值
    additionalButton?: () => void;
    additionalButtonTitile?: string;
}

interface DataDisplayTableState {
    lastUpdated: string | null;
    data: any[];
    selectedDateRange: { [key: string]: [moment.Moment | null, moment.Moment | null] };

    selectedRowKeys: React.Key[];// 可选属性，代表被选中行的keys，用于控制独立的key
    selectedDeletedRows: any[];

    searchQuery: string;
    selectedSearchField: string;
    currentPanelName: string;
    panelChangeCount: number;

    selectrangequeryParams: string;

    // 排序或者过滤处理后的data
    sortedData: GenericDataItem[],
    sortConfig: null,

    showModal: boolean;
    user_character: string;
    dataSourceChanged: boolean;
}


class DataDisplayTable extends React.Component<DataDisplayTableProps, DataDisplayTableState> {
    private refreshInterval: NodeJS.Timeout | null = null;
    constructor(props: DataDisplayTableProps) {
        super(props);
        this.state = {
            showModal: false,
            user_character: 'admin',
            selectedRowKeys: [],
            selectedDeletedRows: [],
            lastUpdated: null,
            selectedDateRange: {},
            searchQuery: '',
            selectedSearchField: '',
            selectrangequeryParams: '',
            currentPanelName: this.props.currentPanel,
            panelChangeCount: 0,

            // 排序或者过滤处理后的data
            sortedData: [],
            sortConfig: null,

            dataSourceChanged: false,
            data: [],
        };
    }

    componentDidMount() {
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        });
    }

    componentDidUpdate(prevProps: any) {

        if (this.state.panelChangeCount === 1 || prevProps.currentPanel !== this.props.currentPanel) { // 修改条件检查逻辑
            console.log('Panel changed from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
            this.setState({
                lastUpdated: new Date().toLocaleString(),
                // selectedSearchField: '',
                // searchQuery: '',
                // selectrangequeryParams: '',
                // selectedDateRange: [null, null], // 日期筛选器重置
                selectedRowKeys: [], //切换页面时，重置keys
                dataSourceChanged: true, // 此状态字段可能需要进一步审查其必要性
                currentPanelName: this.props.currentPanel,
            }, () => {
            });
        }
        // else {
        //     console.log('Panel did not change, from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
        // }
    }



    generate_new_columns = (columns: any[], search_index = [''], rangePickerColumns = ['']): any[] => {
        // 遍历this.props.columns中的每一列
        return columns.map((column: any) => {
            // 如果列名在search_index中
            if (search_index.includes(column.dataIndex)) {
                // 为这列添加搜索功能
                return {
                    ...column,
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
            }
            // if (rangePickerColumns && rangePickerColumns.includes(column.dataIndex)) {
            //     return {
            //         ...column,
            //         filterDropdown: (filterDropdownProps: FilterDropdownProps) => (
            //             <div style={{ padding: 8 }}>
            //                 <RangePicker
            //                     onChange={(dates) => {
            //                         filterDropdownProps.setSelectedKeys(dates ? [dates] : []);
            //                         this.setState(prevState => ({
            //                             selectedDateRange: {
            //                                 ...prevState.selectedDateRange,
            //                                 [column.dataIndex]: dates,
            //                             },
            //                         }));
            //                     }}
            //                     value={filterDropdownProps.selectedKeys[0]}
            //                     style={{ width: '100%' }}
            //                 />
            //                 <Button
            //                     type="primary"
            //                     onClick={() => filterDropdownProps.confirm()}
            //                     size="small"
            //                     style={{ width: 90, marginTop: 8 }}
            //                 >
            //                     筛选
            //                 </Button>
            //                 <Button
            //                     disabled={filterDropdownProps.clearFilters === undefined}
            //                     onClick={() => {
            //                         filterDropdownProps.clearFilters?.();
            //                         this.setState(prevState => ({
            //                             selectedDateRange: {
            //                                 ...prevState.selectedDateRange,
            //                                 [column.dataIndex]: [null, null],
            //                             },
            //                         }));
            //                     }}
            //                     size="small"
            //                     style={{ width: 90, marginTop: 8 }}
            //                 >重置</Button>
            //             </div>
            //         ),
            //         onFilter: (value: [any, any], record: { [x: string]: import('moment').MomentInput; }) => {
            //             const [start, end] = value;
            //             const date = moment(record[column.dataIndex]);
            //             return start && end ? date.isBetween(start, end, 'day', '[]') : true;
            //         },
            //         sorter: (a: { [x: string]: moment.MomentInput; }, b: {
            //             [x: string]: moment.MomentInput;
            //         }) => moment(a[column.dataIndex]).unix() - moment(b[column.dataIndex]).unix(),
            //     };
            // }
            else {
                // 如果不在search_index中，直接返回原列
                return column;
            }
        }).filter((column: any) => !column.hide);
    };

    onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        // 新的 selectedRowKeys 将基于当前选择的行，同时考虑子行
        let newSelectedRowKeys = [...selectedRowKeys];

        selectedRows.forEach(row => {
            if (row.children && row.children.length > 0) {
                // 对于每个选中的行，如果它有子行，则将这些子行的 key 也加入到 newSelectedRowKeys 中
                const childKeys = row.children.map((child: any) => child.key);
                newSelectedRowKeys = [...newSelectedRowKeys, ...childKeys];
            }
        });

        // 更新状态以反映新的选择
        this.setState({ selectedRowKeys: newSelectedRowKeys });
        this.setState({ selectedDeletedRows: selectedRows });
        // message.info('keys:' + newSelectedRowKeys);

    };

    render() {
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                // 更新 selectedRowKeys 状态以包括父行和子行的键值
                // this.setState({ selectedRowKeys });
                this.onSelectChange(selectedRowKeys, selectedRows);
            },
            // 如果需要，可以在这里添加 getCheckboxProps 来定制每一行复选框的行为
        };
        const new_columns = this.generate_new_columns(this.props.columns, this.props.searchColumns, this.props.timeColumnIndex);
        const externalDataSource = this.props.externalDataSource;
        const data = Array.isArray(externalDataSource) ? externalDataSource:[externalDataSource];

        const selectedTableStyle = 'customTable';

        const isButtonDisabled = this.props.externalDataSource.length === 0
            || this.state.selectedRowKeys.length === 0;

        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const { refreshDataFromAPI,refreshDataFromAPIWithUuid } = context;

                    const {apiEndpoint, apiUuid, uuid} = this.props;
                    // this.handleRefresh_delete = refreshDataFromAPI;
                    const handleRefresh = (api: string,apiUuid?: (uuid: string) => string,uuid?:string) => {
                        if(apiUuid && uuid) {
                            refreshDataFromAPIWithUuid(apiUuid,uuid);
                        }
                        else {
                            refreshDataFromAPI(api, 0);
                        }
                        this.setState({
                            lastUpdated: new Date().toLocaleString(),
                        });
                    };
                    return (//Table的宽度被设置为1330px
                        <div style={{
                            // fontFamily: '\'YouYuan\', sans-serif',
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold',
                        }}>
                            {/*{this.renderModal(this.state.selectedDeletedRows)}*/}
                            <Row gutter={[12, 6]} style={{ marginTop: '-10px' }}>
                                <Col md={24}>
                                    <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <Row gutter={[2, 2]}>
                                                <Col flex="none">
                                                    {(this.props.currentPanel === 'TaskDetail') && (
                                                        <Link to="/app/create_agent_task" target="_blank">
                                                            <Button
                                                                {...blueButton}
                                                            >
                                                                新增任务
                                                            </Button>
                                                        </Link>)}
                                                    {(['HoneypotDefenselist', 'threathuntinglist', 'UserManagementlist', 'memHorseList',
                                                        'brute-force','privilege-escalation','defense-avoidance'].includes(this.props.currentPanel)) && (
                                                        <Button
                                                            onClick={this.props.additionalButton}
                                                            {...blueButton}
                                                        >
                                                            {this.props.additionalButtonTitile}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        style={{
                                                            marginRight: '10px',
                                                            opacity: isButtonDisabled ? 0.5 : 1,
                                                        }}
                                                        onClick={() => handleExport(this.props.externalDataSource,
                                                            this.props.currentPanel, this.state.selectedRowKeys)}
                                                        disabled={isButtonDisabled}
                                                    >
                                                        批量导出
                                                    </Button>
                                                    {/*{!["TaskDetail","TaskRecord",'memHorseList'].includes(this.props.currentPanel)&&(*/}
                                                    {/*    <Button*/}
                                                    {/*    style={{*/}
                                                    {/*        backgroundColor: isButtonDisabled ? '#f6c6cf' : '#fb1440',*/}
                                                    {/*        color: 'white',*/}
                                                    {/*        marginRight: '10px',*/}
                                                    {/*        transition: 'opacity 0.3s', // 添加过渡效果*/}
                                                    {/*        opacity: 1, // 初始透明度*/}
                                                    {/*    }}*/}
                                                    {/*    onMouseEnter={(e) => {*/}
                                                    {/*        e.currentTarget.style.opacity = 0.7;*/}
                                                    {/*    }} // 鼠标进入时将透明度设置为0.5*/}
                                                    {/*    onMouseLeave={(e) => {*/}
                                                    {/*        e.currentTarget.style.opacity = 1;*/}
                                                    {/*    }} // 鼠标离开时恢复透明度为1*/}
                                                    {/*    onClick={() => this.toggleModal()}*/}
                                                    {/*    disabled={isButtonDisabled}*/}
                                                    {/*>*/}
                                                    {/*    批量删除*/}
                                                    {/*</Button>)}*/}
                                                </Col>
                                                <Col flex="auto"
                                                     style={{ textAlign: 'left', marginLeft: 10, marginTop: '5px' }}>
                                                    <span>最近更新时间: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                                </Col>
                                                <Col style={{ textAlign: 'left', marginLeft: 10, marginRight: '0px' }}>
                                                    <Button icon={<ReloadOutlined />}
                                                        // onClick={() => refreshDataFromAPI(this.props.apiEndpoint)}
                                                            onClick={() => {
                                                                if(apiUuid && uuid) {
                                                                    handleRefresh('',apiUuid,uuid);
                                                                    message.info("主机"+uuid+"数据已刷新.");
                                                                }
                                                                else{
                                                                    handleRefresh(this.props.apiEndpoint);
                                                                    message.info("数据已刷新.");
                                                                }
                                                            }}
                                                    >刷新</Button>
                                                </Col>
                                            </Row>
                                        </div>
                                        {/* {(data.length===0)?(                
                        <Card bordered={true}
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center',backgroundColor: '#ffffff', width: '100%' }}>
                            <LoadingOutlined style={{ fontSize: '3em' }} />
                        </Card>)
                        :(<Table
                            className={selectedTableStyle}
                            rowSelection={rowSelection}
                            rowKey={this.props.columns[0].key}//使用第一个字段区分各个row，最好是PK
                            dataSource={data}
                            columns={this.props.columns}
                            childrenColumnName={this.props.childrenColumnName}
                            expandedRowRender={this.props.expandedRowRender}
                            //indentSize={this.props.indentSize}
                            locale={(this.state.dataSourceChanged) && (this.props.externalDataSource.length === 0) 
                                ? customLocale:undefined}
                        />)} */}
                                        <Table
                                            className={selectedTableStyle}
                                            rowSelection={rowSelection}
                                            rowKey={this.props.columns[0].key}//使用第一个字段区分各个row，最好是PK
                                            dataSource={data || []}
                                            columns={new_columns}
                                            pagination={{
                                                showQuickJumper: true,
                                            }}
                                            childrenColumnName={this.props.childrenColumnName}
                                            expandedRowRender={this.props.expandedRowRender}
                                            //indentSize={this.props.indentSize}
                                            rowClassName={(this.props.currentPanel.toLowerCase().includes("base") || this.props.currentPanel.toLowerCase().includes("virus")) ? (record) => {
                                                const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
                                                const ignoredVirus_array = JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}');
                                                const isIgnored = (uuid: string, check_name?: string, Virus?: string) => {
                                                    const ignoredBLCheckItems = ignoredBLCheckItem_array[uuid] || [];
                                                    const ignoredViruses = ignoredVirus_array[uuid] || [];
                                                    return (check_name && ignoredBLCheckItems.includes(check_name)) ||
                                                        (Virus && ignoredViruses.includes(Virus));
                                                };
                                                return isIgnored(record.uuid, record.check_name, record.Virus) ? 'ignored-row' : '';
                                            } : undefined}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        );


    }
}

export default DataDisplayTable;
