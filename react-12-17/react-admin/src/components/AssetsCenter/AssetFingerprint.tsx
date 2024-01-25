import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, Menu, Layout } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, Route, Switch, useLocation, withRouter } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import FetchAPIDataTable from './FetchAPIDataTable';
import OverviewPanel from './OverviewPanel';
import ContainerCluster from './ContainerCluster';
import DataDisplayTable from './DataDisplayTable';
import { fimColumns,fimColumns_new,kernelModulesColumns,
    containerColumns,openPortsColumns,
    runningProcessesColumns,systemServicesColumns,
    systemSoftwareColumns,applicationsColumns,
    systemUsersColumns,scheduledTasksColumns } from '../../utils/tableUtils';
// Define an interface for the individual status item
interface StatusItem {
    color: string;
    label: string;
    value: number;
}

// Define an interface for the props expected by the StatusPanel component
interface StatusPanelProps {
    statusData: StatusItem[];
}

type AssetFingerprintProps = {};
interface GenericDataItem {
    [key: string]: any;
}
type AssetFingerprintState = {
    dataSource: any[];
    topData: {
        fim: GenericDataItem[];
        container: GenericDataItem[];
        openPorts: GenericDataItem[];
        runningProcesses: GenericDataItem[];
        systemUsers: GenericDataItem[];
        scheduledTasks: GenericDataItem[];
        systemServices: GenericDataItem[];
        systemSoftware: GenericDataItem[];
        applications: GenericDataItem[];
        kernelModules: GenericDataItem[];
    };

    count: number;
    deleteIndex: number | null;

    selectedRowKeys: React.Key[];
    activeIndex: any;
    areRowsSelected: boolean;

    animated: boolean;
    animatedOne: number;

    statusData: StatusItem[]; // 初始状态
    currentPanel: string;
    // 新增状态字段，记录每个面板的选中行键
    panelSelectedRowKeys: {
        [panelName: string]: React.Key[];
    };
};
interface Risk {
    key: React.Key;
    name: string;
    age: string;

    address: string;
    warning1: number;
    warning2: number;
    warning3: number;
    // Add other properties here if needed
}
interface DataType {
    key: React.Key;
    hostname: string;
    label: string;
    group: string;
    OStype: string;
    risks: {
        warning1: number;
        warning2: number;
        warning3: number;
    };
    status: string;
    clientUsage: string;
    updateTime: string;
}
const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
    return (
        //<div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <div style={{ fontFamily: 'YouYuan, sans-serif' }}>
            {statusData.map((status, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: status.color,
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '16px',
                        }}
                    ></span>
                    <span style={{ marginRight: 'auto', paddingRight: '8px' }}>{status.label}</span>
                    <span>{status.value}</span>
                </div>
            ))}
        </div> //</div>
    );
};

class AssetFingerprint extends React.Component<AssetFingerprintProps, AssetFingerprintState> {
    constructor(props: any) {
        super(props);
        this.columns = [
            {
                title: () => <span style={{ fontWeight: 'bold' }}>主机名称</span>,
                dataIndex: 'hostname',
                //width: '13%',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>标签</span>,
                dataIndex: 'label',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>地域</span>,
                dataIndex: 'group',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作系统</span>,
                dataIndex: 'OStype',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>风险</span>,
                dataIndex: 'risks',
                render: (risks: Risk, record: any) => {
                    return (
                        <div>
                            <div>告警 {risks.warning1}</div>
                            <div>风险 {risks.warning2}</div>
                            <div>基线 {risks.warning3}</div>
                        </div>
                    );
                },
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
                dataIndex: 'status',
                filters: [
                    { text: '未安装', value: '未安装' },
                    { text: '运行中', value: '运行中' },
                    { text: '运行异常', value: '运行异常' },
                    { text: '离线', value: '离线' },
                ],
                onFilter: (value: string | number | boolean, record: DataType) =>
                    record.status.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>客户端资源使用</span>,
                dataIndex: 'clientUsage',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>更新时刻</span>,
                dataIndex: 'updateTime',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
                dataIndex: 'operation',
                render: (text: string, record: DataType) => (
                    <a
                        href={'/login'}
                        target="_blank"
                        rel="noopener noreferrer"
                        //style={{ color: 'blue' }} // 添加颜色样式
                    >
                        查看详情
                    </a>
                ),
            },

            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
                dataIndex: 'operation',
                render: (text: any, record: any, index: number) => {
                    return this.state.dataSource.length > 0 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.onDelete(record, index)}
                        >
                            <span>Delete</span>
                        </Popconfirm>
                    ) : null;
                },
            },
        ];
        this.state = {
            statusData: [], // 初始状态
            animated: false,
            animatedOne: -1,
            dataSource: [
                {
                    key: '0',
                    hostname: 'liubq34412',
                    label: '-',
                    group: 'default',
                    OStype: 'Windows',
                    risks: {
                        warning1: 0,
                        warning2: 1,
                        warning3: 2,
                    },
                    status: '离线',
                    clientUsage: '32',
                    updateTime: '18:00, 2023 12 16',
                },
                // {
                //     key: '1',
                //     hostname: 'liubq34413',
                //     label: '-',
                //     group: 'default',
                //     OStype: 'Windows',
                //     risks: {
                //         warning1: 0,
                //         warning2: 1,
                //         warning3: 0},
                //     status: '离线',
                //     clientUsage: '32',
                //     updateTime: '18:01, 2023 12 16',
                // },
                // {
                //     key: '2',
                //     hostname: 'liubq34414',
                //     label: '-',
                //     group: 'default',
                //     OStype: 'Windows',
                //     risks: {
                //         warning1: 2,
                //         warning2: 0,
                //         warning3: 0},
                //     status: '离线',
                //     clientUsage: '32',
                //     updateTime: '18:02, 2023 12 16',
                // },
            ],
            topData: {
                fim: [],
                container: [],
                openPorts: [],
                runningProcesses: [],
                systemUsers: [],
                scheduledTasks: [],
                systemServices: [],
                systemSoftware: [],
                kernelModules: [],
                applications: [],
                // 其他panel的初始化
            },
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图

            currentPanel: 'overview', // 默认选中的面板
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            panelSelectedRowKeys: {
                overview: [],
                fim: [],
                container: [],
                'open-ports': [],
                'running-processes': [],
                'system-users': [],
                'scheduled-tasks': [],
                'system-services': [],
                'system-software': [],
                applications: [],
                'kernel-modules': [],
                // 根据您的应用添加或删除面板
            },
        };
    }

    // 父组件中
    handleDataReceived = (data: any[]) => {
        // 处理从子组件接收到的数据
        console.log('Received data from child:', data);
    };
    changePanel = (panelName: string) => {
        this.setState({ currentPanel: panelName });
    };
    // animatedAll = (checked: boolean) => {
    // checked && this.setState({ animated: true });
    // !checked && this.setState({ animated: false });
    // };
    // animatedOne = (i: number) => {
    //     this.setState({ animatedOne: i });
    // };
    // animatedOneOver = () => {
    //     this.setState({ animatedOne: -1 });
    // };
    //为不同panel的勾选框设置状态
    onSelectChange = (selectedKeys: React.Key[], panel: string) => {
        // 根据panel来设置对应的选中行keys
        this.setState((prevState) => ({
            panelSelectedRowKeys: {
                ...prevState.panelSelectedRowKeys,
                [panel]: selectedKeys,
            },
        }));
    };
    //用于OverviewPanel筛选top5数据
    onTopDataChange = (panelName: string, data: GenericDataItem[]) => {
        this.setState((prevState) => ({
            topData: {
                ...prevState.topData,
                [panelName]: data,
            },
        }));
    };

    columns: any;
    // 点击Menu.Item时调用的函数
    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };

    setStatusData() {
        // 本地定义的StatusItem数据
        const localStatusData: StatusItem[] = [
            { label: 'Created', value: 7, color: '#22BC44' }, //GREEN
            { label: 'Running', value: 2, color: '#FBB12E' }, //ORANGE
            { label: 'Exited', value: 5, color: '#EA635F' }, //RED
            { label: 'Unknown', value: 1, color: '#E5E8EF' }, //GREY
        ];

        // 更新状态
        this.setState({ statusData: localStatusData });
    }

    // 渲染当前激活的子面板
    renderCurrentPanel() {
        const { currentPanel } = this.state;
        switch (currentPanel) {
            case 'overview':
                return (
                    <OverviewPanel
                        changePanel={this.changePanel}
                        topData={this.state.topData}
                        statusData={this.state.statusData}
                    />
                );
            // case 'fim':
            //     return <ContainerCluster />;
            case 'fim':
                return (
                    <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/server/FileIntegrityInfo"
                    timeColumnIndex={['event_time']}
                    columns={fimColumns_new}
                    currentPanel="fim_datadisplay"
                    />
                    // <DataDisplayTable
                    //     // apiEndpoint="http://localhost:5000/api/files/log"
                    //     // sqlTableName="fileinfo"
                    //     //rankLabel="mtime"
                    //     //timeColumnIndex={['mtime']}
                    //     //columns={fimColumns}
                    //     currentPanel={currentPanel}
                    //     onTopDataChange={this.onTopDataChange}
                    //     columns={fimColumns_new}
                    //     apiEndpoint="http://localhost:5000/server/FileIntegrityInfo"
                    //     rankLabel="event_time"
                    //     timeColumnIndex={['event_time']}
                    //     //sqlTableName="file_integrity_info"
                    //     selectedRowKeys={this.state.panelSelectedRowKeys.fim}
                    //     onSelectChange={(keys: any) => this.onSelectChange(keys, 'fim')}
                    // />
                );
            case 'container':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/container"
                        columns={containerColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         

                        selectedRowKeys={this.state.panelSelectedRowKeys.container}
                        onSelectChange={(keys: any) => this.onSelectChange(keys, 'container')}
                    />
                );
            case 'open-ports':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/open-ports"
                        columns={openPortsColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys['open-ports']}
                        onSelectChange={(keys: any) => this.onSelectChange(keys, 'open-ports')}
                    />
                );
            case 'running-processes':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/running-processes"
                        columns={runningProcessesColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys['running-processes']}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'running-processes')}
                    />
                );
            case 'system-users':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/system-users"
                        columns={systemUsersColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys['system-users']}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'system-users')}
                    />
                );
            case 'scheduled-tasks':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/scheduled-tasks"
                        columns={scheduledTasksColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys['scheduled-tasks']}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'scheduled-tasks')}
                    />
                );
            case 'system-services':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/system-services"
                        columns={systemServicesColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys['system-services']}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'system-services')}
                    />
                );
            case 'system-software':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/system-software"
                        columns={systemSoftwareColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys['system-software']}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'system-software')}
                    />
                );
            case 'applications':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/applications"
                        columns={applicationsColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                         
                        selectedRowKeys={this.state.panelSelectedRowKeys.applications}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'applications')}
                    />
                );
            case 'kernel-modules':
                return (
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/kernel-modules"
                        columns={kernelModulesColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel=""
                        selectedRowKeys={this.state.panelSelectedRowKeys['kernel-modules']}
                        onSelectChange={(keys) => this.onSelectChange(keys, 'kernel-modules')}
                    />
                );
            default:
                return (
                    <OverviewPanel
                        changePanel={this.changePanel}
                        topData={this.state.topData}
                        statusData={this.state.statusData}
                    />
                );
        }
    }

    // Define the rowSelection object inside the render method
    renderRowSelection = () => {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[]) => {
                this.setState({ selectedRowKeys });
            },
            // Add other rowSelection properties and methods as needed
        };
    };
    onDelete = (record: any, index: number) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ deleteIndex: record.key });
        setTimeout(() => {
            this.setState({ dataSource });
        }, 500);
    };
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [newData, ...dataSource],
            count: count + 1,
        });
    };
    handleMouseEnter = (_: any, index: number) => {
        // 使用 map 来更新数组中特定索引的值
        this.setState((prevState) => ({
            activeIndex: prevState.activeIndex.map((val: number, i: number) =>
                i === index ? index : val
            ),
        }));
    };
    handleMouseLeave = () => {
        // 重置所有索引为 -1
        this.setState({
            activeIndex: this.state.activeIndex.map(() => -1),
        });
    };
    handleExport = () => {
        const { dataSource, selectedRowKeys } = this.state;

        // 过滤出已选中的行数据
        const selectedData = dataSource.filter((row: DataType) =>
            selectedRowKeys.includes(row.key)
        );

        // 检查是否有选中的行
        if (selectedData.length === 0) {
            alert('没有选中的行');
            return;
        }

        // 转换数据为CSV格式
        const csvData = this.convertToCSV(selectedData);

        // 触发下载
        this.triggerDownload(csvData, 'export.csv');
    };
    convertToCSV = (data: DataType[]) => {
        // 假设您希望导出的CSV中包括所有字段
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((row: DataType) => {
            const riskValues = Object.values(row.risks).join(',');
            return `${row.key},${row.hostname},${row.label},${row.group},${row.OStype},${riskValues},${row.status},${row.clientUsage},${row.updateTime}`;
        });
        return [headers, ...rows].join('\n');
    };
    triggerDownload = (data: string, filename: string) => {
        const element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
        element.download = filename;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    render() {

        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <div>
                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                            <Col md={24}>
                                <div className="gutter-box">
                                <Card bordered={false}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 ,fontWeight: 'bold'}}>
                                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>资产指纹</h2>
                                    </div>
                                <Menu
                                    onClick={this.handleMenuClick}
                                    selectedKeys={[this.state.currentPanel]}
                                    mode="horizontal"
                                    style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                >
                                    <Menu.Item key="overview">总览</Menu.Item>
                                    <Menu.Item key="container">容器</Menu.Item>
                                    <Menu.Item key="open-ports">开放端口</Menu.Item>
                                    <Menu.Item key="running-processes">运行进程</Menu.Item>
                                    <Menu.Item key="system-users">系统用户</Menu.Item>
                                    <Menu.Item key="scheduled-tasks">定时任务</Menu.Item>
                                    <Menu.Item key="system-services">系统服务</Menu.Item>
                                    <Menu.Item key="system-software">系统软件</Menu.Item>
                                    <Menu.Item key="fim">文件完整性检测</Menu.Item>
                                    <Menu.Item key="applications">应用</Menu.Item>
                                    <Menu.Item key="kernel-modules">内核模块</Menu.Item>
                                    {/* 可以根据需要添加更多的Menu.Item */}
                                    {/* 使用透明div作为flex占位符 */}
                                    <div style={{ flexGrow: 1 }}></div>
                                    
                                </Menu>
                                {/* 渲染当前激活的子面板 */}
                                <Card>{this.renderCurrentPanel()}</Card>
                                </Card>
                                </div>
                            </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default AssetFingerprint;
