import React, { ReactNode } from 'react';
import { Row, Col, Card, Menu, Button, Modal, Statistic, Empty, Alert, Tooltip, Table } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import HostOverview from './HostOverview';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import VulnerabilityDetailsSidebar from '../SideBar/VulnerabilityDetailsSidebar';
import {
    baselineDetectColumnsType,
    constRenderTable,
    Honeypotcolumns,
    threatHuntingColumns,
    threatHuntingColumns_2,
} from '../Columns';
import VirusScanning from '../VirusScanning/VirusScanning';
import PerformanceMonitor from './PerformanceMonitor';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import moment from 'moment';
import {
    APP_Server_URL,
    Brute_TTPs_API,
    Defense_TTPs_API,
    Honey_API,
    Privilege_TTPs_API,
    Vul_Data_API,
} from '../../service/config';
import CustomNotification from '../ui/CustomNotification';
import { vulDetectColumnsType } from '../RiskManagement/VulnerabilityList';
import { StatusItem } from '../Columns';
import BaseLineDetectScanSidebar from '../SideBar/ScanProcessSidebar';
import DataDisplayTable from '../OWLTable/DataDisplayTable';
import { determineOS } from '../ContextAPI/DataService';


interface DetailsPageProps extends RouteComponentProps<{ uuid: string }> {
    host_name: string;
}

interface DetailsPageState {
    host_uuid: string;
    dataSource: any[];

    currentRecord: any,
    selectedVulnUuid: string;
    ignoredVulnerabilitiesCount: number;
    doneVulnerabilitiesCount: number;
    showModal: boolean,
    vulnColumns: any[];
    expColumns: any[];
    fingerColumns: any[];
    pocColumns: any[];
    ignoredBugExps_array: { [uuid: string]: string[] }; // 修改为键值对形式存储
    ignoredBugExps: any[], // 添加被忽略的 bug_exp 数组
    ignoredBugExpsData: { uuid: string; bugExps: string }[]; // 新增
    showIgnoredModal: boolean; // 新增

    showBLModal: boolean,
    ignoredBLCheckItem_array: { [uuid: string]: string[] }; // 修改为键值对形式存储
    ignoredBLCheckItem: any[], // 添加被忽略的 check_name 数组
    ignoredBLCheckItemData: { uuid: string; BLCheckItem: string }[]; // 新增
    blColumns: any[];


    isSidebarOpen: boolean;
    currentTime: string;

    baselineTableReloadCount: number;
    deleteIndex: number | null;

    selectedRowKeys: React.Key[];
    activeIndex: any;
    areRowsSelected: boolean;


    statusData: StatusItem[]; // 初始状态
    currentPanel: string;
    // 新增状态字段，记录每个面板的选中行键
    panelSelectedRowKeys: {
        [panelName: string]: React.Key[];
    };
};


class DetailsPage extends React.Component<DetailsPageProps, DetailsPageState> {
    constructor(props: any) {
        super(props);
        const queryParams = new URLSearchParams(this.props.location.search);
        const host_uuid = queryParams.get('uuid') || 'default';

        const ignoredBugExps_array = JSON.parse(localStorage.getItem('ignoredBugExps_array') || '{}');
        const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
        this.state = {
            host_uuid,
            dataSource: [],
            statusData: [], // 初始状态

            currentRecord: null, // 当前选中的记录
            selectedVulnUuid: '', // 添加状态来存储当前选中的漏洞 id
            showModal: false, // 控制模态框显示
            ignoredBugExps_array,
            ignoredBugExps: [], // 添加被忽略的 bug_exp 数组

            showIgnoredModal: false, // 新增
            ignoredBugExpsData: this.getIgnoredBugExpsData(ignoredBugExps_array, host_uuid),
            ignoredVulnerabilitiesCount: 0,
            vulnColumns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                // {
                //     title: '主机名称',
                //     dataIndex: 'uuid',
                //     key: 'uuid',
                //     filterIcon: (filtered: boolean) => <SearchOutlined
                //         style={{ color: filtered ? '#1890ff' : undefined }} />,
                //     render: (text: string, record: any) => (
                //         <div>
                //             <div>
                //                 <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                //                     <Button style={{
                //                         fontWeight: 'bold',
                //                         border: 'transparent',
                //                         backgroundColor: 'transparent',
                //                         color: '#4086FF',
                //                         padding: '0 0',
                //                     }}>
                //                         {record.uuid.slice(0, 5)}
                //                     </Button>
                //                 </Link>
                //             </div>
                //             <div style={{
                //                 fontSize: 'small', // 字体更小
                //                 background: '#f0f0f0', // 灰色背景
                //                 padding: '2px 4px', // 轻微内边距
                //                 borderRadius: '2px', // 圆角边框
                //                 display: 'inline-block', // 使得背景色仅围绕文本
                //                 marginTop: '4px', // 上边距
                //             }}>
                //                 <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.ip}
                //             </div>
                //         </div>
                //     ),
                // },
                {
                    title: '主机名称',
                    dataIndex: 'uuid',
                    key: 'uuid',
                    filterIcon: (filtered: boolean) => <SearchOutlined
                        style={{ color: filtered ? '#1890ff' : undefined }} />,
                    render: (text: string, record: vulDetectColumnsType) => (
                        <div>
                            <div>
                                <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                                    <Button style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#4086FF',
                                        padding: '0 0',
                                    }}>
                                        <Tooltip title={record.uuid}>
                                            <div style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '80px',
                                            }}>
                                                {record.uuid || '-'}
                                            </div>
                                        </Tooltip>
                                    </Button>
                                </Link>
                            </div>
                            <div style={{
                                fontSize: 'small', // 字体更小
                                background: '#f0f0f0', // 灰色背景
                                padding: '2px 4px', // 轻微内边距
                                borderRadius: '2px', // 圆角边框
                                display: 'inline-block', // 使得背景色仅围绕文本
                                marginTop: '4px', // 上边距
                            }}>
                                <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.ip}
                            </div>
                        </div>
                    ),
                },
                {
                    title: '端口',
                    dataIndex: 'port',
                },
                {
                    title: '扫描时刻',
                    dataIndex: 'scanTime',
                    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
                    sorter: (a: any, b: any) => parseFloat(a.scanTime) - parseFloat(b.scanTime),
                },
                {
                    title: '扫描类型',
                    dataIndex: 'scanType',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (text: string, record: any) => (
                        <div>
                            {/* <Button onClick={() => this.toggleVulOperationModal(record)} className="custom-link-button"
                        style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',marginRight: '20px',
                        padding:'0 0' }}>忽略</Button> */}
                            <Button onClick={() => this.toggleDetailSidebar(record.uuid)} className="custom-link-button"
                                    style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#4086FF',
                                        padding: '0 0',
                                    }}
                            >详情</Button>
                        </div>
                    ),
                },
            ],
            // 漏洞检测结果列配置
            expColumns: [
                // { title: 'id', dataIndex: 'id', key: 'id' },
                { title: '漏洞', dataIndex: 'bug_exp', key: 'bug_exp' },
                {
                    title: '扫描时间', dataIndex: 'scanTime', key: 'scanTime',
                    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
                    //sorter: (a: any, b: any) => parseFloat(a.scanTime) - parseFloat(b.scanTime),
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (text: string, record: any) => (
                        <Button onClick={() => this.toggleVulOperationModal(record)} className="custom-link-button"
                                disabled=
                                    {(JSON.parse(localStorage.getItem('ignoredBugExps_array') || '{}')[record.uuid] || [])
                                        .includes(record.bug_exp)}
                                style={{
                                    fontWeight: 'bold',
                                    border: 'transparent',
                                    backgroundColor: 'transparent',
                                    color: '#4086FF',
                                }}>忽略</Button>
                    ),
                },
            ],
            // 指纹识别结果列配置
            fingerColumns: [
                // { title: 'id', dataIndex: 'id', key: 'id' },
                { title: '指纹', dataIndex: 'finger', key: 'finger' },
                { title: 'URL', dataIndex: 'url', key: 'url' },
                {
                    title: '扫描时间', dataIndex: 'scanTime', key: 'scanTime',
                    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
                    //sorter: (a: any, b: any) => parseFloat(a.scanTime) - parseFloat(b.scanTime),
                },
            ],
            // POC检测结果列配置
            pocColumns: [
                // { title: 'id', dataIndex: 'id', key: 'id' },
                { title: 'POC', dataIndex: 'bug_poc', key: 'bug_poc' },
                { title: 'URL', dataIndex: 'url', key: 'url' },
                {
                    title: '扫描时间',
                    dataIndex: 'scanTime',
                    key: 'scanTime',
                    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
                },
            ],
            doneVulnerabilitiesCount: 0,

            showBLModal: false,

            ignoredBLCheckItem_array,
            ignoredBLCheckItem: [], // 添加被忽略的 check_name 数组
            ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array, host_uuid),
            isSidebarOpen: false,
            currentTime: new Date().toLocaleString(), // 添加用于存储当前时间的状态变量
            baselineTableReloadCount: 0,
            blColumns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    Maxwidth: '15px',
                },
                {
                    title: '主机名称',
                    dataIndex: 'uuid',
                    key: 'uuid',
                    filterIcon: (filtered: boolean) => <SearchOutlined
                        style={{ color: filtered ? '#1890ff' : undefined }} />,
                    render: (text: string, record: baselineDetectColumnsType) => (
                        <div>
                            <div>
                                <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                                    <Button style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#4086FF',
                                        padding: '0 0',
                                    }}>
                                        {record.uuid.slice(0, 5)}
                                    </Button>
                                </Link>
                            </div>
                            <div style={{
                                fontSize: 'small', // 字体更小
                                background: '#f0f0f0', // 灰色背景
                                padding: '2px 4px', // 轻微内边距
                                borderRadius: '2px', // 圆角边框
                                display: 'inline-block', // 使得背景色仅围绕文本
                                marginTop: '4px', // 上边距
                            }}>
                                <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.ip}
                            </div>
                        </div>
                    ),
                },
                {
                    title: '基线名称',
                    dataIndex: 'check_name',

                    filterIcon: (filtered: boolean) => <SearchOutlined
                        style={{ color: filtered ? '#1890ff' : undefined }} />,
                    render: (text: string, record: baselineDetectColumnsType) => (
                        <Tooltip title={record.check_name}>
                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '150px',
                            }}>
                                {record.check_name}
                            </div>
                        </Tooltip>
                    ),
                },
                {
                    title: '检查详情',
                    dataIndex: 'details',
                },
                {
                    title: '调整建议',
                    dataIndex: 'adjustment_requirement',
                    filters: [{ text: '建议调整', value: '建议调整' }, { text: '自行判断', value: '自行判断' },
                    ],
                    onFilter: (value: string | number | boolean, record: any) => record.adjustment_requirement.includes(value as string),

                    render: (text: string, record: baselineDetectColumnsType) => (
                        <Tooltip title={record.instruction}>
                            {text}
                        </Tooltip>
                    ),
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    filters: [{ text: 'true', value: 'true' }, { text: 'fail', value: 'fail' },
                    ],
                    onFilter: (value: string | number | boolean, record: baselineDetectColumnsType) => record.status.includes(value as string),
                },
                {
                    title: '最新扫描时间',
                    dataIndex: 'last_checked',
                    sorter: (a: { occurrenceTime: string | number | Date; }, b: {
                        occurrenceTime: string | number | Date;
                    }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
                    sortDirections: ['ascend', 'descend'],
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (text: string, record: baselineDetectColumnsType) => (
                        <div>
                            {/*<Link to={`/app/baseline_detail?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">*/}
                            {/*    <Button style={{*/}
                            {/*        fontWeight: 'bold',*/}
                            {/*        border: 'transparent',*/}
                            {/*        backgroundColor: 'transparent',*/}
                            {/*        color: '#4086FF',*/}
                            {/*        marginRight: '20px',*/}
                            {/*        padding: '0 0',*/}
                            {/*    }} className="custom-link-button">详情</Button>*/}
                            {/*</Link>*/}
                            <Button onClick={() => this.toggleBLOperationModal(record)} className="custom-link-button"
                                    style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#4086FF',
                                        padding: '0 0',
                                    }}>忽略</Button>
                        </div>
                    ),

                },
            ],
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图


            currentPanel: 'hostoverview', // 默认选中的面板

            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            panelSelectedRowKeys: {
                HostOverview: [],
                'hostAlertInfo': [],
                'vulnerabilityalertlist': [],
                'baselineDetectalertlist': [],
                'runningalertlist': [],
                'virusscanning': [],
                'assetfingerprint': [],
                // 根据您的应用添加或删除面板
            },
        };
    }

    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const host_uuid = queryParams.get('uuid');
        this.setState({
            host_uuid: host_uuid ? host_uuid : 'default',
        });

    }

    filteredData = (originData: any[], name: string) => {
        // 针对TTPs数据的筛选
        if (!originData) {
            return {
                data: [],
                error: (
                    <div>
                        <Alert message={`No ${name} available for this host.`} type="warning" showIcon />
                    </div>
                ),
            };
        }

        const OriginDataArray = Array.isArray(originData) ? originData : [originData];
        if (OriginDataArray.length === 0) {
            return {
                data: [],
                error: (
                    <div>
                        <Alert message={`No ${name} data available for this host.`} type="warning" showIcon />
                    </div>
                ),
            };
        }

        const filteredData = OriginDataArray.filter(Item => Item.uuid === this.state.host_uuid);
        if (filteredData.length === 0) {
            return {
                data: [],
                error: (
                    <div>
                        <Alert message={`No ${name} data available for this host.`} type="warning" showIcon />
                    </div>
                ),
            };
        }

        return { data: filteredData, error: null };
    };

    getIgnoredBugExpsData = (ignoredBugExps_array: { [uuid: string]: string[] }, host_uuid: string) => {
        // 使用 filter 方法过滤出 uuid 等于 host_uuid 的数据，并进行格式转换
        return Object.keys(ignoredBugExps_array)
            .filter(uuid => uuid === host_uuid)
            .map(uuid => ({
                uuid,
                bugExps: ignoredBugExps_array[uuid].join(', '),
            }));
    };

    getIgnoredVulnerabilitiesCount = (ignoredBugExps_array: { [uuid: string]: string[] }, host_uuid: string) => {
        // 使用 reduce 方法遍历 ignoredBugExps_array 中的值数组，并累加漏洞数量
        return Object.keys(ignoredBugExps_array).reduce((count, uuid) => {
            // 判断 uuid 是否等于 host_uuid，并累加相应的漏洞数量
            if (uuid === host_uuid) {
                count += ignoredBugExps_array[uuid].length;
            }
            return count;
        }, 0);
    };

    expandedRowRender = (record: any) => {
        // 根据子记录的类型选择对应的列配置
        const getColumns = (type: string) => {
            switch (type) {
                case 'exp':
                    return this.state.expColumns;
                case 'finger':
                    return this.state.fingerColumns;
                case 'poc':
                    return this.state.pocColumns;
                default:
                    return [];
            }
        };
        const isIgnored = (uuid: string, bugExp: any) => {
            const ignoredBugExps = this.state.ignoredBugExps_array[uuid] || [];
            // console.log('1111111111111111:' + ignoredBugExps);
            return ignoredBugExps.includes(bugExp);
        };
        // const isIgnored1 = (bugExp: any) => this.state.ignoredBugExps.includes(bugExp);
        return (
            <>
                {/* 漏洞检测结果子表格 */}
                <Table
                    columns={getColumns('exp')}
                    dataSource={record.vul_detection_exp_result}
                    pagination={false}
                    rowKey="id"
                    title={() => '漏洞检测结果'}
                    rowClassName={(record) => isIgnored(record.uuid, record.bug_exp) ? 'ignored-row' : ''}
                />
                {/* 指纹识别结果子表格 */}
                <Table
                    columns={getColumns('finger')}
                    dataSource={record.vul_detection_finger_result}
                    pagination={false}
                    rowKey="id"
                    title={() => '指纹识别结果'}
                />
                {/* POC检测结果子表格 */}
                <Table
                    columns={getColumns('poc')}
                    dataSource={record.vul_detection_poc_result}
                    pagination={false}
                    rowKey="id"
                    title={() => 'POC检测结果'}
                />
            </>
        );
    };

    //对漏洞条目的操作
    toggleVulOperationModal = (record = null) => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            currentRecord: record, // 设置当前记录，以便后续操作
        }));
    };
    toggleModal = (record = null) => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            currentRecord: record, // 设置当前记录，以便后续操作
        }));
    };
    handleIgnoreButtonClick = async (record: any) => {
        try {
            // message.info("handleIgnoreButtonClick:"+record.uuid);
            const { ignoredBugExps_array } = this.state;
            if (!ignoredBugExps_array[record.uuid]) {
                ignoredBugExps_array[record.uuid] = [];
            }
            // message.info("record.uuid:"+record.uuid)
            ignoredBugExps_array[record.uuid].push(record.bug_exp);
            localStorage.setItem('ignoredBugExps_array', JSON.stringify(ignoredBugExps_array));

            this.setState({
                currentRecord: null,
                ignoredBugExps_array,
                ignoredBugExpsData: this.getIgnoredBugExpsData(ignoredBugExps_array, this.state.host_uuid),
            });
        } catch (error) {
            console.error('请求错误:', error);
        }
    };
    handleDoneButtonClick = async (record: any) => {
        try {
            const response = await fetch('apiEndpoint', {
                method: 'POST', // 或 'GET', 根据您的API要求
                headers: {
                    'Content-Type': 'application/json',
                    // 可能还需要其他头部信息，如认证令牌
                },
                body: JSON.stringify({
                    // 这里根据API的需要发送适当的数据
                    vulnId: record.id, // 假设每条记录有唯一的id来标识漏洞
                }),
            });

            if (1) {
                // 如果API调用成功，更新状态以增加累计忽略的漏洞计数
                this.setState(prevState => ({
                    doneVulnerabilitiesCount: prevState.doneVulnerabilitiesCount + 1,
                }));
            } else {
                // 处理API调用失败的情况
                console.error('API调用失败:', response.statusText);
            }
        } catch (error) {
            console.error('请求错误:', error);
        }
    };
    handleOk = async () => {
        // 处理忽略操作
        const record = this.state.currentRecord;
        if (record) {
            // 调用API
            // 假设API调用的逻辑是放在handleIgnoreButtonClick方法中实现的
            await this.handleIgnoreButtonClick(record);
        }
        this.toggleModal(); // 关闭模态框
    };
    handleCancel = () => {
        this.toggleModal(); // 关闭模态框
    };
    renderModal = () => {
        return (
            <>
                <Modal
                    title="确认操作"
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }}
                                onClick={this.handleOk}>
                            是
                        </Button>,
                    ]}
                    //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
                >
                    确认忽略选中的漏洞?
                </Modal>
            </>
        );
    };


    showIgnoredExpsModal = () => {
        const ignoredBugExps_array = JSON.parse(localStorage.getItem('ignoredBugExps_array') || '{}');
        this.setState({
            showIgnoredModal: true,
            ignoredBugExpsData: this.getIgnoredBugExpsData(ignoredBugExps_array, this.state.host_uuid),
        });
    };
    handleRemoveIgnored = (uuid: string) => {
        const ignoredBugExps_array = JSON.parse(localStorage.getItem('ignoredBugExps_array') || '{}');
        delete ignoredBugExps_array[uuid];
        localStorage.setItem('ignoredBugExps_array', JSON.stringify(ignoredBugExps_array));
        this.setState({
            ignoredBugExps_array,
            ignoredBugExpsData: this.getIgnoredBugExpsData(ignoredBugExps_array, this.state.host_uuid),
        });
    };
    renderIgnoreModal = () => {
        return (
            <div>
                <Modal
                    wrapClassName="vertical-center-modal"
                    visible={this.state.showIgnoredModal}
                    title="忽略的漏洞"
                    onCancel={() => this.setState({ showIgnoredModal: false })}
                    footer={null}
                    width={600}
                    style={{ top: 20 }}
                >
                    <Table
                        className="customTable"
                        dataSource={this.state.ignoredBugExpsData}
                        rowKey="uuid"
                        pagination={{ pageSize: 5 }}
                        columns={[
                            {
                                title: 'UUID',
                                dataIndex: 'uuid',
                                key: 'uuid',
                                render: (text: string, record: any) => (
                                    <div>
                                        <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`}
                                              target="_blank">
                                            <Button
                                                style={{
                                                    fontWeight: 'bold',
                                                    border: 'transparent',
                                                    backgroundColor: 'transparent',
                                                    color: '#4086FF',
                                                    padding: '0 0',
                                                }}
                                            >
                                                <Tooltip title={record.uuid}>
                                                    <div
                                                        style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px', // 调整最大宽度
                                                        }}
                                                    >
                                                        {record.uuid || '-'}
                                                    </div>
                                                </Tooltip>
                                            </Button>
                                        </Link>
                                    </div>
                                ),
                            },
                            {
                                title: '漏洞名称',
                                dataIndex: 'bugExps',
                                key: 'bugExps',
                                render: (text: string) => (
                                    <div>
                                        <Tooltip title={text}>
                                            <div
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '150px', // 调整最大宽度
                                                }}
                                            >
                                                {text || '-'}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: '操作',
                                key: 'action',
                                render: (_, record) => (
                                    <Button
                                        style={{
                                            fontWeight: 'bold',
                                            padding: '0 0',
                                            border: 'transparent',
                                            backgroundColor: 'transparent',
                                            color: '#4086FF',
                                        }}
                                        onClick={() => this.handleRemoveIgnored(record.uuid)}
                                    >
                                        移出白名单
                                    </Button>
                                ),
                            },
                        ]}

                        scroll={{ y: 240 }}
                    />
                </Modal>
            </div>
        );
    };

    toggleSidebar = () => {
        this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
        this.setCurrentTime();
    };
    toggleDetailSidebar = (uuid: string) => {
        this.setState(prevState => ({
            isSidebarOpen: !prevState.isSidebarOpen,
            selectedVulnUuid: uuid,
        }));
        this.setCurrentTime();
        //message.info('selectedVulnUuid:'+uuid);
    };
    closeSidebar = () => {
        this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    };
    //对基线检查条目的操作
    toggleBLOperationModal = (record: any) => {
        this.setState(prevState => ({
            showBLModal: !prevState.showBLModal,
            currentRecord: record, // 设置当前记录，以便后续操作
        }));
    };

    renderBLWhiteListModal = () => {
        return (
            <>
                <Modal
                    title="确认操作"
                    visible={this.state.showBLModal}
                    onOk={this.handleblOk}
                    onCancel={this.handleblCancel}
                    footer={[
                        <Button key="back" onClick={this.handleblCancel}>
                            取消
                        </Button>,
                        <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }}
                                onClick={this.handleblOk}>
                            是
                        </Button>,
                    ]}
                    //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
                >
                    确认忽略选中的基线基线检查项?
                </Modal>
            </>
        );
    };
    handleblOk = async () => {
        // 处理忽略操作
        const record = this.state.currentRecord;
        if (record) {
            // 调用API
            // 假设API调用的逻辑是放在handleIgnoreButtonClick方法中实现的
            await this.handleIgnoreBLButtonClick(record);
        }
        this.toggleBLOperationModal(record); // 关闭模态框
    };
    handleblCancel = () => {
        this.toggleBLOperationModal([]); // 关闭模态框
    };

    getIgnoredBLCheckItemData = (ignoredBLCheckItem_array: { [uuid: string]: string[] }, host_uuid: string) => {
        // 使用 filter 方法过滤出 uuid 等于 host_uuid 的数据，并进行格式转换
        return Object.keys(ignoredBLCheckItem_array)
            .filter(uuid => uuid === host_uuid)
            .map(uuid => ({
                uuid,
                BLCheckItem: ignoredBLCheckItem_array[uuid].join(', '),
            }));
    };

    getIgnoredBLItemCount = (ignoredBLCheckItem_array: { [uuid: string]: string[] }, host_uuid: string) => {
        // 使用 reduce 方法遍历 ignoredBLCheckItem_array 中的值数组，并累加数量
        return Object.keys(ignoredBLCheckItem_array).reduce((count, uuid) => {
            // 判断 uuid 是否等于 host_uuid，并累加相应的数量
            if (uuid === host_uuid) {
                count += ignoredBLCheckItem_array[uuid].length;
            }
            return count;
        }, 0);
    };

    handleIgnoreBLButtonClick = async (record: any) => {
        try {
            // message.info("handleIgnoreBLButtonClick:"+record.uuid);
            const { ignoredBLCheckItem_array } = this.state;
            if (!ignoredBLCheckItem_array[record.uuid]) {
                ignoredBLCheckItem_array[record.uuid] = [];
            }
            // message.info("record.uuid:"+record.uuid)
            ignoredBLCheckItem_array[record.uuid].push(record.check_name);
            localStorage.setItem('ignoredBLCheckItem_array', JSON.stringify(ignoredBLCheckItem_array));

            this.setState({
                currentRecord: null,
                ignoredBLCheckItem_array,
                ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array, this.state.host_uuid),
            });
        } catch (error) {
            console.error('请求错误:', error);
        }
    };
    showIgnoredBLCheckItemsModal = () => {
        const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
        this.setState({
            showIgnoredModal: true,
            ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array, this.state.host_uuid),
        });
    };
    handleRemoveBLIgnored = (uuid: string) => {
        const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
        delete ignoredBLCheckItem_array[uuid];
        localStorage.setItem('ignoredBLCheckItem_array', JSON.stringify(ignoredBLCheckItem_array));
        this.setState({
            ignoredBLCheckItem_array,
            ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array, this.state.host_uuid),
        });
    };
    renderBLIgnoreModal = () => {
        return (
            <div>
                <Modal
                    wrapClassName="vertical-center-modal"
                    visible={this.state.showIgnoredModal}
                    title="忽略的检查项"
                    onCancel={() => this.setState({ showIgnoredModal: false })}
                    footer={null}
                    width={600}
                    style={{ top: 20 }}
                >
                    <Table
                        className="customTable"
                        dataSource={this.state.ignoredBLCheckItemData}
                        rowKey="uuid"
                        pagination={{ pageSize: 5 }}
                        columns={[
                            {
                                title: 'UUID',
                                dataIndex: 'uuid',
                                key: 'uuid',
                                render: (text: string, record: any) => (
                                    <div>
                                        <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`}
                                              target="_blank">
                                            <Button
                                                style={{
                                                    fontWeight: 'bold',
                                                    border: 'transparent',
                                                    backgroundColor: 'transparent',
                                                    color: '#4086FF',
                                                    padding: '0 0',
                                                }}
                                            >
                                                <Tooltip title={record.uuid}>
                                                    <div
                                                        style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px', // 调整最大宽度
                                                        }}
                                                    >
                                                        {record.uuid || '-'}
                                                    </div>
                                                </Tooltip>
                                            </Button>
                                        </Link>
                                    </div>
                                ),
                            },
                            {
                                title: '检查项名称',
                                dataIndex: 'BLCheckItem',
                                key: 'BLCheckItem',
                                render: (text: string) => (
                                    <div>
                                        <Tooltip title={text}>
                                            <div
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '150px', // 调整最大宽度
                                                }}
                                            >
                                                {text || '-'}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: '操作',
                                key: 'action',
                                render: (_, record) => (
                                    <Button
                                        style={{
                                            fontWeight: 'bold',
                                            padding: '0 0',
                                            border: 'transparent',
                                            backgroundColor: 'transparent',
                                            color: '#4086FF',
                                        }}
                                        onClick={() => this.handleRemoveBLIgnored(record.uuid)}
                                    >
                                        移出白名单
                                    </Button>
                                ),
                            },
                        ]}

                        scroll={{ y: 240 }}
                    />
                </Modal>
            </div>
        );
    };


    setCurrentTime = () => {
        const now = new Date();
        // 格式化时间为 YYYY-MM-DD HH:MM:SS
        const formattedTime = now.getFullYear() + '-' +
            ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
            ('0' + now.getDate()).slice(-2) + ' ' +
            ('0' + now.getHours()).slice(-2) + ':' +
            ('0' + now.getMinutes()).slice(-2) + ':' +
            ('0' + now.getSeconds()).slice(-2);
        this.setState({ currentTime: formattedTime });
    };
    changePanel = (panelName: string) => {
        this.setState({ currentPanel: panelName });
    };
    // 点击Menu.Item时调用的函数
    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };
    renderVulOrBLTable = (apiEndpoint: string, uuid: string, timeColumnIndex: string[], columns: any[], currentPanel: string, title: string, searchIndex: string[],
                          VulOriginData: any[], WinBLOriginData: any[], LinuxBLOriginData: any[],os_type:string) => {
        if (uuid !== undefined) {
            if (currentPanel == 'vulnerabilityDetailList') {
                if (VulOriginData !== undefined) {
                    const originDataArray = Array.isArray(VulOriginData) ? VulOriginData : [VulOriginData];
                    const filteredData = originDataArray.filter(item => item.uuid === this.state.host_uuid);
                    return (
                        <div style={{ width: '100%' }}>
                            <Col md={24} style={{ width: '100%', maxWidth: 2640, border: 'false' }}>
                                <Row gutter={[8, 16]} style={{ marginTop: '0px', marginLeft: '-8px' }}>
                                    <Col md={24}>
                                        <Card bordered={false}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 10,
                                            }}>
                                                <h2 style={{
                                                    fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                }}>{title}</h2>
                                            </div>

                                            <DataDisplayTable
                                                key={currentPanel}
                                                externalDataSource={filteredData}
                                                apiEndpoint={apiEndpoint + uuid}
                                                timeColumnIndex={timeColumnIndex}
                                                columns={columns}
                                                currentPanel={currentPanel}
                                                expandedRowRender={this.expandedRowRender}
                                                indentSize={15} // 设置缩进大小，单位是像素
                                                childrenColumnName="children" // 指定子数据的属性名称
                                                searchColumns={['uuid', 'port']}
                                            />

                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </div>
                    );
                }
            }
            if (currentPanel == 'baseLineDetectDetailList') {
                if(os_type=="windows"){
                    if (WinBLOriginData !== undefined) {
                        const originDataArray = Array.isArray(WinBLOriginData) ? WinBLOriginData : [WinBLOriginData];
                        const filteredData = originDataArray.filter(item => item.uuid === this.state.host_uuid);
                        return (
                            <div style={{ width: '100%' }}>
                                <Col md={24} style={{ width: '100%', maxWidth: 2640, border: 'false' }}>
                                    <Row gutter={[8, 16]} style={{ marginTop: '0px', marginLeft: '-8px' }}>
                                        <Col md={24}>
                                            <Card bordered={false}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 10,
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                    }}>{title}</h2>
                                                </div>

                                                <DataDisplayTable
                                                    key={currentPanel}
                                                    externalDataSource={filteredData}
                                                    apiEndpoint={apiEndpoint + uuid}
                                                    timeColumnIndex={timeColumnIndex}
                                                    columns={columns}
                                                    currentPanel={currentPanel}
                                                    searchColumns={['uuid', 'check_name']}
                                                />

                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </div>
                        );
                    }
                }
                if(os_type=="linux"){
                    if (LinuxBLOriginData !== undefined) {
                        const originDataArray = Array.isArray(LinuxBLOriginData) ? LinuxBLOriginData : [LinuxBLOriginData];
                        const filteredData = originDataArray.filter(item => item.uuid === this.state.host_uuid);
                        return (
                            <div style={{ width: '100%' }}>
                                <Col md={24} style={{ width: '100%', maxWidth: 2640, border: 'false' }}>
                                    <Row gutter={[8, 16]} style={{ marginTop: '0px', marginLeft: '-8px' }}>
                                        <Col md={24}>
                                            <Card bordered={false}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 10,
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                    }}>{title}</h2>
                                                </div>

                                                <DataDisplayTable
                                                    key={currentPanel}
                                                    externalDataSource={filteredData}
                                                    apiEndpoint={apiEndpoint + uuid}
                                                    timeColumnIndex={timeColumnIndex}
                                                    columns={columns}
                                                    currentPanel={currentPanel}
                                                    searchColumns={['uuid', 'check_name']}
                                                />

                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </div>
                        );
                    }
                }
            }
            // <FetchDataForElkeidTable
            //     key={currentPanel + this.state.baselineTableReloadCount}
            //     apiEndpoint={apiEndpoint + uuid}
            //     timeColumnIndex={timeColumnIndex}
            //     columns={columns}
            //     currentPanel={currentPanel}
            //     expandedRowRender={this.expandedRowRender}
            //     indentSize={15} // 设置缩进大小，单位是像素
            //     childrenColumnName="children" // 指定子数据的属性名称
            //     search={searchIndex}
            //     handleReload={
            //         () => {
            //             CustomNotification.successNotification('BaseLine_Data_API');
            //             console.log('baselineTableReloadCount:this.state.baselineTableReloadCount+1:' + this.state.baselineTableReloadCount);
            //             this.setState({ baselineTableReloadCount: this.state.baselineTableReloadCount + 1 });
            //         }
            //     }
            // />
        }
    };
    renderCurrentPanel = (agentOriginData: any, linuxbaselineOriginData: any, windowsbaselineOriginData: any,
                          vulOriginData: any[],
                          HoneyPotOriginData: any[],
                          bruteforceTTPsOriginData: any[], privilegeescalationTTPsOriginData: any[], defenseavoidanceTTPsOriginData: any[],
                          VirusOriginData: any[],
                          HoneyPotHostCount: number, TTPsHostCount: number, VirusHostCount: number) => {

        const { currentPanel, host_uuid } = this.state;

        const ignoredVulnerabilitiesCount = this.getIgnoredVulnerabilitiesCount(this.state.ignoredBugExps_array, host_uuid);

        const IgnoredBLItemCount = this.getIgnoredBLItemCount(this.state.ignoredBLCheckItem_array, host_uuid);
        //const os_version = ['ubuntu', 'windows'];
        if (agentOriginData !== undefined) {
            // 确保agentOriginData总是作为数组处理
            const originDataArray = Array.isArray(agentOriginData) ? agentOriginData : [agentOriginData];
            if (originDataArray && originDataArray.length > 0) {
                const filteredData = originDataArray.find(item => item.uuid === this.state.host_uuid);

                if (!filteredData) {
                    // return <div>No data available for this host.</div>;
                    return (
                        <div>
                            <Alert message="No data available for this host." type="warning" showIcon />
                            {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                            {/* <Empty description="No data available for this host." /> */}
                        </div>
                    );
                }

                // const os_version = filteredData.os_version.toLowerCase().includes('ubuntu') ? 'linux' : 'windows';
                const os_version = determineOS(filteredData);

                const baselineOriginData = os_version === 'linux' ? linuxbaselineOriginData : windowsbaselineOriginData;


                //针对基线检查数据的筛选
                if (baselineOriginData === undefined) {
                    return (
                        <div>
                            <Alert message="No baselineOriginData available for this host." type="warning" showIcon />
                            {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                            {/* <Empty description="No data available for this host." /> */}
                        </div>
                    );
                }
                const blDataArray = Array.isArray(baselineOriginData) ? baselineOriginData : [baselineOriginData];
                if (blDataArray.length === 0) {
                    return (
                        <div>
                            <Alert message="No blDataArray available for this host." type="warning" showIcon />
                            {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                            {/* <Empty description="No data available for this host." /> */}
                        </div>
                    );
                }
                const filteredBLData = blDataArray.filter(Item => Item.uuid === this.state.host_uuid);
                if (!filteredBLData) {
                    return (
                        <div>
                            <Alert message="No filteredBLData available for this host." type="warning" showIcon />
                            {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                            {/* <Empty description="No data available for this host." /> */}
                        </div>
                    );
                }
                const filteredAdjData = filteredBLData.filter(Item => Item.adjustment_requirement === '建议调整');
                if (!filteredAdjData) {
                    return (
                        <div>
                            <Alert message="No filteredAdjData available for this host." type="warning" showIcon />
                            {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                            {/* <Empty description="No data available for this host." /> */}
                        </div>
                    );
                }

                //针对漏洞数据的筛选
                // if (vulOriginData === undefined) {
                //     return (
                //         <div>
                //             <Alert message="No vulOriginData available for this host." type="warning" showIcon />
                //         </div>
                //     );
                // }
                // const vulOriginDataArray = Array.isArray(vulOriginData) ? vulOriginData : [vulOriginData];
                // if (vulOriginDataArray.length === 0) {
                //     return (
                //         <div>
                //             <Alert message="No vulOriginDataArray available for this host." type="warning" showIcon />
                //             {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                //             {/* <Empty description="No data available for this host." /> */}
                //         </div>
                //     );
                // }
                // const filteredvulData = vulOriginDataArray.filter(Item => Item.uuid === this.state.host_uuid);
                // if (!filteredvulData) {
                //     return (
                //         <div>
                //             <Alert message="No filteredvulData available for this host." type="warning" showIcon />
                //             {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                //             {/* <Empty description="No data available for this host." /> */}
                //         </div>
                //     );
                // }

                const vulResult = this.filteredData(vulOriginData, 'Vuln');
                // if (vulResult.error) {
                //     return vulResult.error; // 显示错误消息
                // }
                const filteredvulData = vulResult.data;
                let totalExpResultCount = 0;
                filteredvulData.forEach(item => {
                    totalExpResultCount += item.vul_detection_exp_result.length;
                });


                // //针对蜜罐数据的筛选
                // if (HoneyPotOriginData === undefined) {
                //     return (
                //         <div>
                //             <Alert message="No vulOriginData available for this host." type="warning" showIcon />
                //         </div>
                //     );
                // }
                // const honeyPotOriginDataArray = Array.isArray(HoneyPotOriginData) ? HoneyPotOriginData : [HoneyPotOriginData];
                // if (honeyPotOriginDataArray.length === 0) {
                //     return (
                //         <div>
                //             <Alert message="No honeyPotOriginDataArray available for this host." type="warning" showIcon />
                //             {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                //             {/* <Empty description="No data available for this host." /> */}
                //         </div>
                //     );
                // }
                // const filteredHoneyPotData = honeyPotOriginDataArray.filter(Item => Item.uuid === this.state.host_uuid);
                // if (!filteredHoneyPotData) {
                //     return (
                //         <div>
                //             <Alert message="No filteredhoneyPotData available for this host." type="warning" showIcon />
                //             {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                //             {/* <Empty description="No data available for this host." /> */}
                //         </div>
                //     );
                // }
                const honeyPotResult = this.filteredData(HoneyPotOriginData, 'honeyPot');
                // if (honeyPotResult.error) {
                //     return honeyPotResult.error; // 显示错误消息
                // }
                const filteredHoneyPotData = honeyPotResult.data;

                // 针对TTPs数据的筛选
                const ttpsResult1 = this.filteredData(bruteforceTTPsOriginData, 'bruteforceTTPs');
                // if (ttpsResult1.error) {
                //     return ttpsResult1.error; // 显示错误消息
                // }
                const filteredTTPsData1 = ttpsResult1.data;

                const ttpsResult2 = this.filteredData(privilegeescalationTTPsOriginData, 'privilegeescalationTTPs');
                // if (ttpsResult2.error) {
                //     return ttpsResult2.error; // 显示错误消息
                // }
                const filteredTTPsData2 = ttpsResult2.data;
                const ttpsResult3 = this.filteredData(defenseavoidanceTTPsOriginData, 'defenseavoidanceTTPs');
                // if (ttpsResult3.error) {
                //     return ttpsResult3.error; // 显示错误消息
                // }
                const filteredTTPsData3 = ttpsResult3.data;

                //针对病毒扫描数据的筛选
                // if (VirusOriginData === undefined) {
                //     return (
                //         <div>
                //             <Alert message="No VirusOriginData available for this host." type="warning" showIcon />
                //         </div>
                //     );
                // }
                // const virusOriginDataArray = Array.isArray(VirusOriginData) ? VirusOriginData : [VirusOriginData];
                // if (virusOriginDataArray.length === 0) {
                //     return (
                //         <div>
                //             <Alert message="No virusOriginDataArray available for this host." type="warning" showIcon />
                //             {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                //             {/* <Empty description="No data available for this host." /> */}
                //         </div>
                //     );
                // }
                // const filteredVirusData = virusOriginDataArray.filter(Item => Item.uuid === this.state.host_uuid);
                // if (!filteredVirusData) {
                //     return (
                //         <div>
                //             <Alert message="No filteredVirusData available for this host." type="warning" showIcon />
                //             {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                //             {/* <Empty description="No data available for this host." /> */}
                //         </div>
                //     );
                // }

                const AlertData_uuid = [
                    { label: '蜜罐告警', value: HoneyPotHostCount ? HoneyPotHostCount : 0, color: '#FFBB28' },
                    { label: 'TTPs告警', value: TTPsHostCount ? TTPsHostCount : 0, color: '#468DFF' },
                    { label: '病毒扫描告警', value: VirusHostCount === 0 ? 20 : VirusHostCount, color: '#846CCE' },
                ];

                switch (currentPanel) {
                    case 'HostOverview':
                        return (
                            <HostOverview
                                changePanel={this.changePanel}
                            />
                        );
                    case 'hostAlertInfo':
                        return (
                            <div style={{ marginTop: '-20px' }}>
                                <div style={{
                                    // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                    fontWeight: 'bold',
                                }}>
                                    <Col md={24}>
                                        <Row gutter={[12, 6]} style={{ width: '100%', margin: '0 auto' }}>
                                            <Col md={24}>
                                                <Card bordered={false}
                                                      style={{ fontWeight: 'bolder', marginTop: '10px', height: 200 }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: 16,
                                                        fontWeight: 'bold',
                                                    }}>
                                                        <h2 style={{
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            marginTop: '0px',
                                                        }}>告警概览</h2>
                                                    </div>
                                                    <Row gutter={[6, 6]}>
                                                        <Col md={2} />
                                                        <Col md={10}>
                                                            <Card
                                                                bordered={false}
                                                                style={{
                                                                    height: '100px',
                                                                    width: '500px',
                                                                    minWidth: '150px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: '#F6F7FB',
                                                                }}
                                                            >
                                                                <Row style={{ width: '100%' }}>
                                                                    <Col span={8}
                                                                         style={{ transform: 'translateX(-90px) translateY(50px)' }}>
                                                                        <Statistic title={<span
                                                                            style={{ fontSize: '16px' }}>待处理告警</span>}
                                                                                   value={HoneyPotHostCount + TTPsHostCount + 40} />
                                                                    </Col>
                                                                    <Col span={12} style={{
                                                                        height: '90px',
                                                                        minWidth: '200px',
                                                                        transform: 'translateX(75px) translateY(-30px)',
                                                                    }}>
                                                                        <StatusPanel statusData={AlertData_uuid}
                                                                                     orientation="vertical" />
                                                                    </Col>
                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                        <Col md={2} />
                                                        <Col md={10}>
                                                            <Card
                                                                bordered={false}
                                                                style={{
                                                                    height: '100px',
                                                                    width: '330px',
                                                                    minWidth: '150px', // 最小宽度300px，而非100px
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                                }}
                                                            >
                                                                <Row>
                                                                    <Col style={{ marginRight: '250px' }} span={24}>
                                                                        <Statistic title={<span
                                                                            style={{ fontSize: '16px' }}>累计处理的告警</span>}
                                                                                   value={0} />
                                                                    </Col>

                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                        {/*<Col md={7}>*/}
                                                        {/*    <Card*/}
                                                        {/*        bordered={false}*/}
                                                        {/*        style={{*/}
                                                        {/*            height: '100px',*/}
                                                        {/*            width: '300px',*/}
                                                        {/*            minWidth: '150px', // 最小宽度300px，而非100px*/}
                                                        {/*            display: 'flex',*/}
                                                        {/*            alignItems: 'center',*/}
                                                        {/*            justifyContent: 'center',*/}
                                                        {/*            backgroundColor: '#F6F7FB', // 设置Card的背景颜色*/}
                                                        {/*        }}*/}
                                                        {/*    >*/}
                                                        {/*        <Row>*/}
                                                        {/*            <Col style={{ marginRight: '250px' }} span={24}>*/}
                                                        {/*                <Statistic title={<span*/}
                                                        {/*                    style={{ fontSize: '16px' }}>白名单规则数</span>}*/}
                                                        {/*                           value={0} />*/}
                                                        {/*            </Col>*/}
                                                        {/*        */}
                                                        {/*        </Row>*/}
                                                        {/*    </Card>*/}
                                                        {/*</Col>*/}
                                                    </Row>

                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row gutter={[12, 6]}/*(列间距，行间距)*/
                                             style={{ width: '100%', margin: '0 auto' }}>
                                            <Col md={24}>
                                                {/*<Card bordered={false}>*/}
                                                {/*    <div style={{*/}
                                                {/*        display: 'flex',*/}
                                                {/*        justifyContent: 'space-between',*/}
                                                {/*        marginBottom: 16,*/}
                                                {/*        fontWeight: 'bold',*/}
                                                {/*    }}>*/}
                                                {/*        <h2 style={{*/}
                                                {/*            fontWeight: 'bold',*/}
                                                {/*            marginLeft: '0px',*/}
                                                {/*        }}>告警内容</h2>*/}
                                                {/*        /!*<Button onClick={this.handleAdd} style={{ padding: '5px 15px', fontWeight: 'bold' }} name="del" >添加告警</Button>*!/*/}
                                                {/*    </div>*/}


                                                {/*</Card>*/}

                                                {constRenderTable(
                                                    filteredHoneyPotData, '蜜罐信息', [],
                                                    Honeypotcolumns, 'HoneypotDefenselistDetails', Honey_API, ['uuid'],
                                                )}
                                                {constRenderTable(
                                                    filteredTTPsData1, '威胁狩猎-暴力破解', [],
                                                    threatHuntingColumns, 'brute-force-details',
                                                    Brute_TTPs_API, ['uuid', 'atk_ip'],
                                                )}
                                                {constRenderTable(
                                                    filteredTTPsData2, '威胁狩猎-权限提升', [],
                                                    threatHuntingColumns_2, 'privilege-escalation-details',
                                                    Privilege_TTPs_API, ['uuid', 'atk_ip'],
                                                )}
                                                {constRenderTable(
                                                    filteredTTPsData3, '威胁狩猎-防御规避', [],
                                                    threatHuntingColumns_2, 'defense-avoidance-details',
                                                    Defense_TTPs_API, ['uuid', 'atk_ip'],
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>
                                </div>
                            </div>
                        );
                    case 'vulnerabilityDetailList':
                        return (
                            <div style={{ marginTop: '0px' }}>
                                {this.renderIgnoreModal()}
                                <Row style={{ width: '100%', margin: '0 auto' }}>
                                    <Col md={24}>
                                        <Card bordered={false} /*title="主机状态分布" 产生分界线*/
                                              style={{ fontWeight: 'bolder', width: '100%', height: 220 }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 16,
                                                fontWeight: 'bold',
                                            }}>
                                                <h2 style={{
                                                    fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    marginLeft: '0px',
                                                }}>漏洞概览</h2>
                                                <Button onClick={this.showIgnoredExpsModal}>白名单</Button>
                                            </div>
                                            <Row gutter={[6, 6]}>
                                                <Col span={2}>
                                                </Col>
                                                <Col span={10}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            width: '470px',
                                                            minWidth: '200px', // 最小宽度300px，而非100px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row style={{ width: '100%', marginTop: '0px', paddingRight: '10px' }}>
                                                            <Col span={8}
                                                                 style={{ paddingTop: '20px', width: '400px', height: '90px' }}>
                                                                <Statistic
                                                                    title={<span style={{ fontSize: '16px' }}>待处理漏洞</span>}
                                                                    value={totalExpResultCount} />
                                                            </Col>
                                                            <Col span={9} style={{
                                                                width: '400px',
                                                                transform: 'translateX(0px) translateY(10px)',
                                                            }}>
                                                                <CustomPieChart
                                                                    data={
                                                                        [
                                                                            {
                                                                                color: '#E63F3F',
                                                                                label: '风险项',
                                                                                value: totalExpResultCount,
                                                                            },
                                                                            { color: '#468DFF', label: '通过项', value: 99 },
                                                                        ]
                                                                    }
                                                                    innerRadius={27}
                                                                    deltaRadius={2}
                                                                    outerRadius={33}
                                                                    cardWidth={90}
                                                                    cardHeight={90}
                                                                    hasDynamicEffect={true}
                                                                />
                                                            </Col>
                                                            <Col span={7}
                                                                 style={{
                                                                     width: '420px',
                                                                     height: '100px',
                                                                     paddingTop: '5px',
                                                                     marginTop: '10px',
                                                                     transform: 'translateX(0px) translateY(10px)',
                                                                 }}>
                                                                <StatusPanel statusData={[
                                                                    {
                                                                        label: '风险项',
                                                                        value: totalExpResultCount,
                                                                        color: '#EA635F',
                                                                    },
                                                                    { label: '通过项', value: 99, color: '#468DFF' },
                                                                ]} orientation="vertical" />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col span={1}>
                                                </Col>

                                                <Col span={10} style={{ marginLeft: '10px' }}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            width: '440px',
                                                            minWidth: '200px', // 最小宽度300px，而非100px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col pull={2} span={24}
                                                                 style={{
                                                                     marginRight: '50px',
                                                                     transform: 'translateX(-50%)',
                                                                 }}>
                                                                <Statistic title={<span
                                                                    style={{ fontSize: '16px' }}>累计忽略的漏洞</span>}
                                                                           value={ignoredVulnerabilitiesCount} />
                                                            </Col>

                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <div className="container">
                                                    <div className={this.state.isSidebarOpen ? 'overlay open' : 'overlay'}
                                                         onClick={this.closeSidebar}></div>
                                                    <div className={this.state.isSidebarOpen ? 'sidebar open' : 'sidebar'}>
                                                        <button onClick={() => this.toggleSidebar}
                                                                className="close-btn">&times;</button>
                                                        <VulnerabilityDetailsSidebar
                                                            //vulnOriginData={vulnOriginData}
                                                            //vulnInfoArray={getSelectedVulnDetails()}
                                                            onDoneButtonClick={this.handleDoneButtonClick}//点击‘处理’按键
                                                            toggleSidebar={this.toggleSidebar}
                                                            host_uuid={this.state.selectedVulnUuid}
                                                            isSidebarOpen={this.state.isSidebarOpen}
                                                        />
                                                    </div>
                                                </div>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={{ width: '100%', margin: '0 auto' }}>
                                    {this.renderModal()}
                                    {this.renderVulOrBLTable(APP_Server_URL + '/api/vulndetetion/query_uuid?uuid=',
                                        this.state.host_uuid, ['scanTime'], this.state.vulnColumns, currentPanel,
                                        '漏洞内容', ['port'],
                                        vulOriginData, windowsbaselineOriginData, linuxbaselineOriginData,os_version)}
                                </Row>
                            </div>
                        );
                    case 'baseLineDetectDetailList':
                        return (
                            <div>
                                {this.renderBLIgnoreModal()}
                                <Row style={{ width: '100%', margin: '0 auto' }}>
                                    <Col md={24}>
                                        <Card bordered={false}
                                              style={{ fontWeight: 'bolder', marginTop: '0px', height: 200 }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 16,
                                                fontWeight: 'bold',
                                            }}>
                                                <h2 style={{
                                                    fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    marginTop: '0px',
                                                }}>基线概览</h2>
                                                <Button
                                                    onClick={this.showIgnoredBLCheckItemsModal}>白名单</Button>
                                            </div>
                                            <Row gutter={[6, 6]}>
                                                <Col md={1} />
                                                <Col md={6}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            // width: '520px',
                                                            width: '100%',
                                                            minWidth: '150px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB',
                                                        }}
                                                    >
                                                        <Row style={{ width: '100%', marginBottom: '-130px' }}>
                                                            <Col span={12} style={{
                                                                height: '100px',
                                                                marginRight: '20px',
                                                                marginLeft: '20px',
                                                                marginBottom: '-170px',
                                                                paddingTop: '10px',
                                                            }}>
                                                                <Statistic title={<span style={{
                                                                    fontSize: '16px',
                                                                    transform: 'translateX(70%)',
                                                                }}>最近检查通过率</span>}
                                                                           value={100 * (1 - filteredAdjData.length / filteredBLData.length) + '%'} />
                                                            </Col>
                                                            <Col span={12} style={{
                                                                height: '90px',
                                                                marginLeft: '150px',
                                                                marginRight: '150px',
                                                                marginBottom: '130px',
                                                            }}>
                                                                {/* <StatusPanel statusData={statusData} orientation="vertical" /> */}
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col md={1} />
                                                <Col md={8}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            // width: '620px',
                                                            width: '100%',
                                                            minWidth: '150px', // 最小宽度300px，而非100px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row style={{
                                                            width: '100%',
                                                            marginTop: '0px',
                                                            paddingRight: '10px',
                                                        }}>
                                                            <Col span={3} style={{
                                                                paddingTop: '25px',
                                                                paddingLeft: '20px',
                                                                width: '440px',
                                                                height: '100px',
                                                            }}>
                                                                {/* <StatusPanel statusData={RASPdata_2} orientation="vertical" /> */}
                                                            </Col>
                                                            <Col span={5} style={{
                                                                marginLeft: '20px',
                                                                paddingTop: '20px',
                                                                width: '180px',
                                                                height: '90px',
                                                            }}>
                                                                <Statistic title={<span
                                                                    style={{ fontSize: '16px' }}>检查项</span>}
                                                                           value={filteredBLData.length} />
                                                            </Col>
                                                            <Col span={5} style={{
                                                                marginLeft: '-20px',
                                                                marginRight: '20px',
                                                                width: '100px',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}>
                                                                <CustomPieChart
                                                                    data={[
                                                                        {
                                                                            label: '风险项',
                                                                            value: filteredAdjData.length,
                                                                            color: '#EA635F',
                                                                        },
                                                                        {
                                                                            label: '通过项',
                                                                            value: filteredBLData.length - filteredAdjData.length,
                                                                            color: '#468DFF',
                                                                        },
                                                                    ]}
                                                                    innerRadius={24}
                                                                    deltaRadius={2}
                                                                    outerRadius={30}
                                                                    cardWidth={130}
                                                                    cardHeight={90}
                                                                    hasDynamicEffect={true}
                                                                />
                                                            </Col>
                                                            <Col span={8} style={{
                                                                paddingTop: '15px',
                                                                width: '450px',
                                                                height: '100px',
                                                            }}>
                                                                <StatusPanel statusData={[
                                                                    {
                                                                        label: '风险项',
                                                                        value: filteredAdjData.length,
                                                                        color: '#EA635F',
                                                                    },
                                                                    {
                                                                        label: '通过项',
                                                                        value: filteredBLData.length - filteredAdjData.length,
                                                                        color: '#E5E8EF',
                                                                    },
                                                                ]}
                                                                             orientation="vertical" />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col md={1} />
                                                <Col md={6}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            // width: '520px',
                                                            width: '100%',
                                                            minWidth: '150px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB',
                                                        }}
                                                    >
                                                        <Row style={{ width: '100%', marginBottom: '-130px' }}>
                                                            <Col span={12} style={{
                                                                height: '100px',
                                                                marginRight: '20px',
                                                                marginLeft: '20px',
                                                                marginBottom: '-170px',
                                                                paddingTop: '10px',
                                                            }}>
                                                                <Statistic title={<span style={{
                                                                    fontSize: '16px',
                                                                    transform: 'translateX(70%)',
                                                                }}>白名单</span>}
                                                                           value={IgnoredBLItemCount} />
                                                            </Col>
                                                            <Col span={12} style={{
                                                                height: '90px',
                                                                marginLeft: '150px',
                                                                marginRight: '150px',
                                                                marginBottom: '130px',
                                                            }}>
                                                                {/* <StatusPanel statusData={statusData} orientation="vertical" /> */}
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col md={1} />
                                            </Row>

                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={{ width: '100%', margin: '0 auto' }}>
                                    {this.renderBLWhiteListModal()}
                                    {this.renderVulOrBLTable(APP_Server_URL + '/api/baseline_check/' + os_version + '/query_uuid?uuid=',
                                        this.state.host_uuid, ['last_checked'], this.state.blColumns, currentPanel, '基线内容', ['check_name'],
                                        vulOriginData, windowsbaselineOriginData, linuxbaselineOriginData,os_version)}
                                </Row>
                            </div>
                        );
                    case 'virusscanning':
                        return (
                            <div style={{ marginTop: '-20px' }}>
                                <VirusScanning
                                    hostID=""
                                    pageWidth={1320}
                                />
                            </div>
                        );
                    case 'honeyPot':
                        return (
                            <div style={{ fontWeight: 'bold' }}>
                                <Row gutter={[12, 6]} style={{ marginTop: '0px' }}>
                                    <Col md={24}>
                                        {/*{this.renderTable(filteredHoneyPotData, '蜜罐信息', Honeypotcolumns,*/}
                                        {/*    'honeyPot_host', Honey_API)}*/}
                                    </Col>
                                </Row>
                            </div>
                        )
                            ;
                    case 'performancemonitor':
                        return (
                            <div style={{ marginTop: '-20px' }}>
                                <PerformanceMonitor />
                            </div>
                        );
                    default:
                        return (
                            <HostOverview
                                changePanel={this.changePanel}
                            />
                        );
                }
            }
        } else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingOutlined style={{ fontSize: '3em' }} />
                </div>
            );
        }
    };

    render() {
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
                    const {
                        agentOriginData, linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                        vulnOriginData, honeyPotOriginData, virusOriginData,
                        bruteforceTTPsOriginData,
                        privilegeescalationTTPsOriginData,
                        defenseavoidanceTTPsOriginData,
                        bruteforceTTPsMetaData_uuid,
                        privilegeescalationTTPsMetaData_uuid,
                        defenseavoidanceTTPsMetaData_uuid,
                        VirusMetaData_uuid,
                        HoneyPotMetaData_uuid,
                    } = context;


                    const HoneyPotHostCount = (HoneyPotMetaData_uuid && HoneyPotMetaData_uuid.typeCount.get(this.state.host_uuid)) || 0;
                    const bruteforceTTPsHostCount = (
                        (bruteforceTTPsMetaData_uuid && bruteforceTTPsMetaData_uuid.typeCount.get(this.state.host_uuid)) || 0
                    );
                    const privilegeEscalationTTPsHostCount = (
                        (privilegeescalationTTPsMetaData_uuid && privilegeescalationTTPsMetaData_uuid.typeCount.get(this.state.host_uuid)) || 0
                    );
                    const defenseAvoidanceTTPsHostCount = (
                        (defenseavoidanceTTPsMetaData_uuid && defenseavoidanceTTPsMetaData_uuid.typeCount.get(this.state.host_uuid)) || 0
                    );
                    const TTPsHostCount = bruteforceTTPsHostCount + privilegeEscalationTTPsHostCount + defenseAvoidanceTTPsHostCount;
                    const VirusHostCount = (VirusMetaData_uuid && VirusMetaData_uuid.typeCount.get(this.state.host_uuid)) || 0;


                    return (
                        <div style={{
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold',
                        }}>
                            <BreadcrumbCustom />
                            <span>
                                {this.props.host_name}
                            </span>
                            <div>
                                <Row gutter={[12, 6]} style={{ marginTop: '10px', width: '100%', margin: '0 auto' }}>
                                    <Col md={24}>
                                        <Menu
                                            onClick={this.handleMenuClick}
                                            selectedKeys={[this.state.currentPanel]}
                                            mode="horizontal"
                                            style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                        >
                                            <Menu.Item key="hostoverview">主机概览</Menu.Item>
                                            <Menu.Item key="hostAlertInfo">安全告警（AlarmTotal）</Menu.Item>
                                            <Menu.Item key="virusscanning">病毒查杀（VirusTotal）</Menu.Item>
                                            <Menu.Item key="vulnerabilityDetailList">漏洞风险（VulnTotal）</Menu.Item>
                                            <Menu.Item
                                                key="baseLineDetectDetailList">基线风险（BaselineTotal）</Menu.Item>
                                            {/*<Menu.Item key="honeyPot">蜜罐防御（HoneyPot）</Menu.Item>*/}
                                            {/*<Menu.Item key="TTPs">威胁狩猎（TTPs）</Menu.Item>*/}
                                            {/*<Menu.Item key="microIsolation">文件隔离（MicroIsolate）</Menu.Item>*/}
                                            <Menu.Item key="performancemonitor">性能监控</Menu.Item>
                                            {/* <Menu.Item key="assetfingerprint">资产指纹</Menu.Item> */}
                                            {/* 可以根据需要添加更多的Menu.Item */}
                                            {/* 使用透明div作为flex占位符 */}
                                            <div style={{ flexGrow: 1 }}></div>

                                        </Menu>
                                        {/* 渲染当前激活的子面板,HoneyPotHostCount, TTPsHostCount, VirusHostCount */}
                                        <Card bordered={false}
                                              style={{ backgroundColor: '#F6F7FB', margin: '0 auto', width: '90%' }}>
                                            {this.renderCurrentPanel(agentOriginData, linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData, vulnOriginData,
                                                honeyPotOriginData,
                                                bruteforceTTPsOriginData, privilegeescalationTTPsOriginData, defenseavoidanceTTPsOriginData,
                                                virusOriginData,
                                                HoneyPotHostCount,
                                                TTPsHostCount,
                                                VirusHostCount)}
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    );

                }}
            </DataContext.Consumer>
        );
    }
}

export default withRouter(DetailsPage);
