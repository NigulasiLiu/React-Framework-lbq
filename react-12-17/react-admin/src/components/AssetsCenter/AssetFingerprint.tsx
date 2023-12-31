import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, Menu, Layout } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, Route, Switch, useLocation, withRouter } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import OverviewPanel from './OverviewPanel';
import ContainerCluster from './ContainerCluster';
import DataDisplayTable from './DataDisplayTable';

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

const fimColumns = [
    {
        title: '文件名',
        dataIndex: 'filename',
        key: 'filename',
        onHeaderCell: () => ({
            style: {
              minWidth: 100, // 最小宽度100px
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: 'MD5哈希值',
        dataIndex: 'content_md5',
        key: 'content_md5',
    },
    {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '修改时间',
        dataIndex: 'mtime',
        key: 'mtime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
        sorter: (a: any, b: any) => b.mtime - a.mtime,
        //sorter: (a: any, b: any) => new Date(a.mtime).getTime() - new Date(b.mtime).getTime(),
    },
    {
        title: '访问时间',
        dataIndex: 'atime',
        key: 'atime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',                
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
        onHeaderCell: () => ({
            style: {
              minWidth: 100, // 最小宽度100px
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: '文件名哈希值',
        dataIndex: 'filename_md5',
        key: 'filename_md5',
    },
];

const containerColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '容器ID',
        dataIndex: 'containerId',
        key: 'containerId',
    },
    {
        title: '容器名',
        dataIndex: 'containerName',
        key: 'containerName',
    },
    {
        title: '运行状态',
        dataIndex: 'runStatus',
        key: 'runStatus',
    },
    {
        title: '镜像ID',
        dataIndex: 'imageId',
        key: 'imageId',
    },
    {
        title: '镜像名',
        dataIndex: 'imageName',
        key: 'imageName',
    },
    {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

const openPortsColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '端口号',
        dataIndex: 'portNumber',
        key: 'portNumber',
    },
    {
        title: '标记',
        dataIndex: 'tag',
        key: 'tag',
    },
    {
        title: '监听IP',
        dataIndex: 'listenIP',
        key: 'listenIP',
    },
    {
        title: '端口类别',
        dataIndex: 'portCategory',
        key: 'portCategory',
    },
    // ... 其他字段定义
];

// 运行进程表的列定义
const runningProcessesColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '进程ID',
        dataIndex: 'processId',
        key: 'processId',
    },
    {
        title: '标记',
        dataIndex: 'tag',
        key: 'tag',
    },
    {
        title: '进程名',
        dataIndex: 'processName',
        key: 'processName',
    },
    {
        title: '进程状态',
        dataIndex: 'processStatus',
        key: 'processStatus',
    },
    {
        title: '进程命令行',
        dataIndex: 'commandLine',
        key: 'commandLine',
    },
    {
        title: '进程路径',
        dataIndex: 'processPath',
        key: 'processPath',
    },
    {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '父进程ID',
        dataIndex: 'parentProcessId',
        key: 'parentProcessId',
    },
    {
        title: '文件哈希',
        dataIndex: 'fileHash',
        key: 'fileHash',
    },
    {
        title: '启动时间',
        dataIndex: 'startTime',
        key: 'startTime',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

// 系统用户表的列定义
const systemUsersColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '用户组ID',
        dataIndex: 'groupId',
        key: 'groupId',
    },
    {
        title: '用户组名',
        dataIndex: 'groupName',
        key: 'groupName',
    },
    {
        title: '上次登录时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
    },
    {
        title: '上次登录来源',
        dataIndex: 'lastLoginSource',
        key: 'lastLoginSource',
    },
    {
        title: '家目录路径',
        dataIndex: 'homeDirectory',
        key: 'homeDirectory',
    },
    {
        title: '命令/Shell',
        dataIndex: 'shell',
        key: 'shell',
    },
    {
        title: 'Sudoers',
        dataIndex: 'sudoers',
        key: 'sudoers',
    },
    {
        title: '备注',
        dataIndex: 'notes',
        key: 'notes',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];
const scheduledTasksColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '任务命令',
        dataIndex: 'taskCommand',
        key: 'taskCommand',
    },
    {
        title: '文件路径',
        dataIndex: 'filePath',
        key: 'filePath',
    },
    {
        title: '文件哈希',
        dataIndex: 'fileHash',
        key: 'fileHash',
    },
    {
        title: '执行周期',
        dataIndex: 'executionCycle',
        key: 'executionCycle',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

const systemServicesColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '执行命令',
        dataIndex: 'executionCommand',
        key: 'executionCommand',
    },
    {
        title: '工作目录',
        dataIndex: 'workingDirectory',
        key: 'workingDirectory',
    },
    {
        title: '文件哈希',
        dataIndex: 'fileHash',
        key: 'fileHash',
    },
    {
        title: '是否自动重启',
        dataIndex: 'autoRestart',
        key: 'autoRestart',
        // 这里假设 autoRestart 是布尔值，可以根据需要进行调整
        //render: (text, record) => (record.autoRestart ? '是' : '否'),
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

const systemSoftwareColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '软件名称',
        dataIndex: 'softwareName',
        key: 'softwareName',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

// 内核模块表的列定义
const kernelModulesColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '模块名称',
        dataIndex: 'moduleName',
        key: 'moduleName',
    },
    {
        title: '大小',
        dataIndex: 'size',
        key: 'size',
    },
    {
        title: '引用计数',
        dataIndex: 'refCount',
        key: 'refCount',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '内存地址',
        dataIndex: 'memoryAddress',
        key: 'memoryAddress',
    },
    {
        title: '提供依赖',
        dataIndex: 'dependencies',
        key: 'dependencies',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

// 应用表的列定义
const applicationsColumns = [
    {
        title: '主机名称',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: '应用名称',
        dataIndex: 'applicationName',
        key: 'applicationName',
    },
    {
        title: '应用类型',
        dataIndex: 'applicationType',
        key: 'applicationType',
    },
    {
        title: '应用版本',
        dataIndex: 'applicationVersion',
        key: 'applicationVersion',
    },
    {
        title: '应用配置',
        dataIndex: 'applicationConfig',
        key: 'applicationConfig',
    },
    {
        title: '标记',
        dataIndex: 'tag',
        key: 'tag',
    },
    {
        title: '进程ID',
        dataIndex: 'processId',
        key: 'processId',
    },
    {
        title: '进程路径',
        dataIndex: 'processPath',
        key: 'processPath',
    },
    {
        title: '应用启动时间',
        dataIndex: 'applicationStartTime',
        key: 'applicationStartTime',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

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
                    <DataDisplayTable
                        apiEndpoint="http://localhost:5000/api/files/fim"
                        columns={fimColumns}
                        currentPanel={currentPanel}

                        onTopDataChange={this.onTopDataChange}
                        rankLabel="mtime"
                        timeColumnIndex={['ctime','mtime','atime']}

                        selectedRowKeys={this.state.panelSelectedRowKeys.fim}
                        onSelectChange={(keys: any) => this.onSelectChange(keys, 'fim')}
                    />
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
                    {/* 资产指纹面板的导航菜单 */}
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
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
                </Row>
                </div>
            </div>
        );
    }
}

export default AssetFingerprint;
