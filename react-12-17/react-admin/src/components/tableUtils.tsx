import React from 'react';
import { Tooltip, Button, Select } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;
export interface DetailItem {
    hostIP: string;
    alert_type: string;
    event_time: string;
}
export interface BaseLineDataType {
    key: React.Key;
    ip: string;                // IP
    check_name: string;        // 基线名称
    details: string;           // 检查详情
    adjustment_requirement: string;   // 调整建议
    status: string;            // 状态
    last_checked: string;      // 最新扫描时间
    instruction: string;       // 指令
  }

export const simplifiedTablePanel=['createnewtask','UserManagementlist'];
export interface BaseLineDataType {
    key: React.Key;
    ip: string;                // IP
    check_name: string;        // 基线名称
    details: string;           // 检查详情
    adjustment_requirement: string;  // 调整建议
    status: string;            // 状态
    last_checked: string;      // 最新扫描时间
    instruction: string;       // 指令
  }
export interface checkedItemDataType {
 level:string;
 passRate:number;
 scanResult:string;
}

export interface GenericDataItem {
    [key: string]: any;
}
export interface Risk {
    key: React.Key;
    name: string;
    age: string;

    address: string;
    warning1: number;
    warning2: number;
    warning3: number;
    // Add other properties here if needed
}

export interface DataItem {
    key: string;
    id: string;
    value: number;
    color: string; // 添加 color 属性
};
export interface BaseItem {
    key: string;
    color: string; // 添加 color 属性
};
export interface StatusItem {
    color: string;
    label: string;
    value: number;
}

export interface FimDataType {
    key: React.Key;
    filename: string;   
    event_time: string;   
    hostname: string;     
    hostIP: string;          
    alert_type: string;        
} 
export interface CreateTaskDataType {
    key: React.Key;
    hostname: string;   
    label: string;   
    group: string;     
    os: string; 
    status: string;      
    updatetime: string;        
} 
export const baseLineDetectScanResult1Columns = [
    { title: '影响主机', dataIndex: 'influencehost', key: 'influencehost' },
    { title: '标签', dataIndex: 'label', key: 'label',
    //sorter: (a: any, b: any) => Date.parse(b.foundtime) - Date.parse(a.foundtime), 
    },
    { title: '检查结果', dataIndex: 'status', key: 'status',
    filters: [
    ],
    onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string), },
    { title: '操作', dataIndex: 'operation', key: 'operation',
    render: (text: string, record: any) => (
    // 在 render 方法中返回包含按钮的元素
    <Link to="/app/create_agent_task" target="_blank">
        <Button type="link" style={{color:'#4086f4'}}>加白名单</Button>
    </Link>
    ) }
];
export const baseLineDetectCheckedItemColumns = [
    {
        title: "检查项",
        dataIndex: 'checkName',
        key: 'hostname',
        onHeaderCell: () => ({
            style: {
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: "级别",
        dataIndex: 'level',
        key: 'level',
        filters: [],
        onFilter: (value: string | number | boolean, record: checkedItemDataType) => record.level.includes(value as string),
    },
    {
        title: '通过率',
        dataIndex: 'passRate',
        key: 'passRate',
        sorter: (a: any, b: any) => Date.parse(b.passRate) - Date.parse(a.passRate),
    },

    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/create_agent_task" target="_blank">
            <Button type="link" style={{color:'#4086f4'}}>重新检查</Button>
        </Link>
        )
    },
];
export const baseLineDetectHostItemColumns = [
    {
        title: "影响主机",
        dataIndex: 'influencedHost',
        key: 'influencedHost',
        onHeaderCell: () => ({
            style: {
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: '风险项',
        dataIndex: 'riskItem',
        key: 'riskItem',
        sorter: (a: any, b: any) => Date.parse(b.riskItem) - Date.parse(a.riskItem),
    },
    {
        title: "通过项",
        dataIndex: 'passItem',
        key: 'passItem',
        // filters: [],
        // onFilter: (value: string | number | boolean, record: checkedItemDataType) => record.level.includes(value as string),
    },

    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/create_agent_task" target="_blank">
            <Button type="link" style={{color:'#4086f4'}}>重新检查</Button>
        </Link>
        )
    },
];
export const baseLineDetectScanResult2Columns = [
    {
        title: "影响主机",
        dataIndex: 'influencedHost',
        key: 'influencedHost',
        onHeaderCell: () => ({
            style: {
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: '标签',
        dataIndex: 'label',
        key: 'label',
    },
    {
        title: "扫描结果",
        dataIndex: 'scanResult',
        key: 'scanResult',
        filters: [],
        onFilter: (value: string | number | boolean, record: checkedItemDataType) => record.scanResult.includes(value as string),
    },

    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/create_agent_task" target="_blank">
            <Button type="link" style={{color:'#4086f4'}}>加白名单</Button>
        </Link>
        )
    },
];
export const virusscandetailscolumns=[
    { title: '主机名称', dataIndex: 'hostname', key: 'hostname' ,
    render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/detailspage" target="_blank">
            <Button type="link" style={{color:'#4086f4'}}>{text}</Button>
        </Link>
        )
    },
    { title: '状态', dataIndex: 'status', key: 'status',
    filters: [
    ],
    onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string), },
    { title: '汇报时间', dataIndex: 'report_time', key: 'report_time', 
    sorter: (a: any, b: any) => Date.parse(b.report_time) - Date.parse(a.report_time),
}
]

export const createNewTaskColumns = [
    {
        title: "主机名称",
        dataIndex: 'hostname',
        key: 'hostname',
        onHeaderCell: () => ({
            style: {
              maxWidth: 200, // 最大宽度200px
            },
          }),
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/detailspage" target="_blank">
            <Button type="link" className='custom-link-button'>{text}</Button>
        </Link>
        ),
    },
    {
        title: "标签",
        dataIndex: 'label',
        key: 'label',
        //sorter: (a: any, b: any) => Date.parse(b.event_time) - Date.parse(a.event_time),
    },
    {
        title: '地域',
        dataIndex: 'group',
        key: 'group',
        filters: [],
        onFilter: (value: string | number | boolean, record: CreateTaskDataType) => record.group.includes(value as string),
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
        //sorter: (a: any, b: any) => new Date(a.mtime).getTime() - new Date(b.mtime).getTime(),
    },
    {
        title: '操作系统',
        dataIndex: 'os',
        key: 'hostnaosme',
        filters: [],
        onFilter: (value: string | number | boolean, record: CreateTaskDataType) => record.os.includes(value as string),
        
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              //maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',                
        filters: [],
        onFilter: (value: string | number | boolean, record: CreateTaskDataType) => record.status.includes(value as string),
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              //maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '更新时间',
        dataIndex: 'updatetime',
        key: 'updatetime',
        sorter: (a: any, b: any) => new Date(a.updatetime).getTime() - new Date(b.updatetime).getTime(),
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              //maxWidth: 170, // 最大宽度200px
            },
          }),
    },
];

export const hostinventoryColumns = [
    {
        title: "ID",
        dataIndex: 'id',
        key: 'id',
        
        //render: () => null,
        //width: '13%',
    },
    {
        title: "主机IP",
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: "协议",
        dataIndex: 'protocol',
        key: 'protocol',
    },
    {
        title: "开放端口",
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: "服务",
        dataIndex: 'service',
        key: 'service',
    },
    {
        title: "服务版本",
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: "操作系统",
        dataIndex: 'ostype',
        key: 'ostype',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: DataType) => record.ostype.includes(value as string),
    },
    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/create_agent_task" target="_blank" >
            <Button type="link" className="link-button" style={{color:'#4086f4'}}>下发任务</Button>
        </Link>
        )
    },
];

export const hostinventoryColumns_new = [
    {
        title: "ID",
        dataIndex: 'id',
        key: 'id',
        //width: '13%',
    },
    {
        title: "主机名称",
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: "主机IP",
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: "操作系统",
        dataIndex: 'os_version',
        key: 'os_version',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: DataType) => record.os_version.includes(value as string),
    },
    {
        title: "状态",
        dataIndex: 'status',
        key: 'status',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: "内存使用量",
        dataIndex: 'mem_use',
        key: 'mem_use',
    },
    {
        title: "CPU使用率",
        dataIndex: 'cpu_use',
        key: 'cpu_use',
    },
    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/create_agent_task" target="_blank">
            <Button type="link" style={{color:'#4086f4'}}>下发任务</Button>
        </Link>
        )
    },
];

export const fimColumns = [
    {
        title: "文件名",
        dataIndex: 'filename',
        key: 'filename',
        onHeaderCell: () => ({
            style: {
              maxWidth: 200, // 最大宽度200px
            },
          }),
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/detailspage" target="_blank">
            <Button type="link" className="custom-link-button">{text}</Button>
        </Link>
        ),
    },
    {
        title: "告警时间",
        dataIndex: 'event_time',
        key: 'event_time',
        sorter: (a: any, b: any) => Date.parse(b.event_time) - Date.parse(a.event_time),
    },
    {
        title: '主机名',
        dataIndex: 'hostname',
        key: 'hostname',
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              //maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '主机IP',
        dataIndex: 'hostIP',
        key: 'hostIP',
        filters: [],
        onFilter: (value: string | number | boolean, record: FimDataType) => record.hostIP.includes(value as string),
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
        //sorter: (a: any, b: any) => new Date(a.mtime).getTime() - new Date(b.mtime).getTime(),
    },
    {
        title: '告警类型',
        dataIndex: 'alert_type',
        key: 'alert_type',                
        filters: [],
        onFilter: (value: string | number | boolean, record: FimDataType) => record.alert_type.includes(value as string),
        
        onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              //maxWidth: 170, // 最大宽度200px
            },
          }),
    },
];
export const containerColumns = [
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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

export const openPortsColumns = [
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: '进程ID',
        dataIndex: 'processId',
        key: 'processId',
    },
    {
        title: '进程名',
        dataIndex: 'processName',
        key: 'processName',
    },
    {
        title: '进程命令行',
        dataIndex: 'processCmd',
        key: 'processCmd',
    },
    {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
    },
    {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
    },
    {
        title: '最新扫描时间',
        dataIndex: 'latestScanningTime',
        key: 'latestScanningTime',
    },
    // ... 其他字段定义
];

// 运行进程表的列定义
export const runningProcessesColumns = [
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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
export const systemUsersColumns = [
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
export const scheduledTasksColumns = [
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

export const systemServicesColumns = [
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
        // 这里假设 autoRestart 是布尔值，可以根据需要进行调整
        //render: (text, record) => (record.autoRestart ? '是' : '否'),
    },
    {
        title: '最新扫描时间',
        dataIndex: 'lastScanTime',
        key: 'lastScanTime',
    },
];

export const systemSoftwareColumns = [
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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
export const kernelModulesColumns = [
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
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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
export const applicationsColumns = [
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


export interface AlertDataType {
    key: React.Key;
    alarmName: string;        // 告警名称
    affectedAssets: string;    // 影响资产
    alert_type: string;        // 告警类型
    level: string;            // 级别
    status: string;           // 状态
    occurTimestamp: string;
  }
export const hostalertColumns = [
    {
        title: '告警名称',
        dataIndex: 'alertName',
        key: 'alertName',
        render: (text: string, record: AlertDataType) => (
            <a
                href={'/login'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1964F5' }}// 添加颜色样式
            >
                {text}
            </a>
        ),
    },
    {
        title: '影响资产',
        dataIndex: 'affectedAssets',
        key: 'affectedAssets',
    },
    {
        title: '告警类型',
        dataIndex: 'alert_type',
        key: 'alert_type',
        filters: [],
        onFilter: (value: string | number | boolean, record: AlertDataType) => record.alert_type.includes(value as string),
    },
    {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [],
        onFilter: (value: string | number | boolean, record: AlertDataType) => record.status.includes(value as string),
    },
    {
        title: '发生时间',
        dataIndex: 'occurTimestamp',
        key: 'occurTimestamp',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    },
];
export interface DataType {
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
    ostype: string;
    clientUsage: string;
    updateTime: string;

    os_version:string;

}
export const virusscanningColumns = [
    {
      title: () => <span style={{ fontWeight: 'bold' }}>告警名称</span>,
      dataIndex: 'alarmName',
      //width: '13%',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>影响资产</span>,
      dataIndex: 'affectedAsset',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>级别</span>,
      dataIndex: 'tz',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>MD5</span>,
      dataIndex: 'level',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
      dataIndex: 'status',
      filters: [
          { text: '已处理', value: '已处理' },
          { text: '未处理', value: '未处理' },
      ],
      onFilter: (value: string | number | boolean, record: AlertDataType) => record.status.includes(value as string),
  },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>发生时间</span>,
      dataIndex: 'occurrenceTime',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
      dataIndex: 'operation',
    },
  ];
export interface WhiteListColumDataType {
    key: React.Key;
    whitelistName: string;    // 加白名称
    whitelistDescription: string; // 加白描述
    whitelistScope: string;    // 加白范围
    matchAlertName: string;    // 匹配告警名
    matchMethod: string;       // 匹配方式
    occurrenceTime: string;   // 发生时间
}

export const whitelistColumns = [
    {
        title: "加白名称",
        dataIndex: 'whitelistName',
        key: 'whitelistName',
        //width: '13%',
    },
    {
        title: "加白描述",
        dataIndex: 'whitelistDescription',
        key: 'whitelistDescription',
    },
    {
        title: "加白范围",
        dataIndex: 'whitelistScope',
        key: 'whitelistScope',
        filters: [
            { text: '全局', value: '全局' },
            { text: '非全局', value: '非全局' },
        ],
        onFilter: (value: string | number | boolean, record: WhiteListColumDataType) => record.whitelistScope.includes(value as string),
    },
    {
        title: "匹配告警名",
        dataIndex: 'matchAlertName',
        key: 'matchAlertName',
    },
    {
        title: "匹配方式",
        dataIndex: 'matchMethod',
        key: 'matchMethod',
    },
    {
        title: "操作时间",
        dataIndex: 'occurrenceTime',
        key: 'occurrenceTime',
    },
    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: WhiteListColumDataType) => (
            <a
                href={'/login'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1964F5' }}// 添加颜色样式
            >
                查看详情
            </a>
        ),
    },
];

export const vulnerabilityColumns = [
    {
        title: "漏洞名称",
        dataIndex: 'alarmName',
        key: 'alarmName',
        //width: '13%',
    },
    {
        title: "影响资产数",
        dataIndex: 'affectedAsset',
        key: 'affectedAsset',
    },
    {
        title: "漏洞特征",
        dataIndex: 'tz',
        key: 'tz',
    },
    {
        title: "级别",
        dataIndex: 'level',
        key: 'level',
        filters: [
            { text: '紧急', value: '紧急' },
            { text: '高危', value: '高危' },
            { text: '低危', value: '低危' },
            { text: '中危', value: '中危' },
        ],
        onFilter: (value: string | number | boolean, record: AlertDataType) => record.level.includes(value as string),
    },
    {
        title: "状态",
        dataIndex: 'status',
        key: 'status',
        filters: [
            { text: '已处理', value: '已处理' },
            { text: '未处理', value: '未处理' },
        ],
        onFilter: (value: string | number | boolean, record: AlertDataType) => record.status.includes(value as string),
    },
    {
        title: "最新扫描时间",
        dataIndex: 'occurrenceTime',
        key: 'occurrenceTime',
    },
    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
    },
];

export const baselineDetectColumns = [
    // {
    //     title: "ID",
    //     dataIndex: 'id',
    //     key: 'id',
    //     //width: '13%',
    // },
    {
        title: "IP",
        dataIndex: 'ip',
        key: 'ip',
        //width: '13%',
    },
    {
        title: "基线名称",
        dataIndex: 'check_name',
        key: 'check_name',
    },
    {
        title: "检查详情",
        dataIndex: 'details',
        key: 'details',
    },
    {
        title: "调整建议",
        dataIndex: 'adjustment_requirement',
        key: 'adjustment_requirement',
        render: (text: string, record: BaseLineDataType) => (
            <Tooltip title={record.instruction}>
                {text}
            </Tooltip>
        ),
    },
    {
        title: "状态",
        dataIndex: 'status',
        key: 'status',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: BaseLineDataType) => record.status.includes(value as string),
    },
    {
        title: "最新扫描时间",
        dataIndex: 'last_checked',
        key: 'last_checked',
        sorter: (a: { occurrenceTime: string | number | Date; }, b: { occurrenceTime: string | number | Date; }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: "操作",
        dataIndex: 'operation',
    },
];

export const RASPProcessColums = [
    {
        title: "主机名称",
        dataIndex: 'ip',
        key: 'ip',
        width: '13%',
    },
    {
        title: "进程命令行",
        dataIndex: 'processcmd',
        key: 'processcmd',
    },
    {
        title: "进程ID",
        dataIndex: 'processId',
        key: 'processId',
    },
    {
        title: "运行时类型",
        dataIndex: 'running_type',
        key: 'running_type',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: BaseLineDataType) => record.status.includes(value as string),
        render: (text: string, record: BaseLineDataType) => (
            <Tooltip title={record.instruction}>
                {text}
            </Tooltip>
        ),
    },
    {
        title: "最后出现时间",
        dataIndex: 'last_occur_time',
        key: 'last_occur_time',
    },
    {
        title: "保护出现时间",
        dataIndex: 'protection_active_time',
        key: 'protection_active_time',
    },
    {
        title: "状态",
        dataIndex: 'status',
        key: 'status',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: BaseLineDataType) => record.status.includes(value as string),
    },
    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
    },
];

export const ConfigurationColums = [
    {
        title: "主机标签",
        dataIndex: 'hostLabel',
        key: 'hostLabel',
        width: '13%',
    },
    {
        title: "进程命令行",
        dataIndex: 'processcmd',
        key: 'processcmd',
    },
    {
        title: "IP",
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: "运行时类型",
        dataIndex: 'running_type',
        key: 'running_type',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: BaseLineDataType) => record.status.includes(value as string),
        render: (text: string, record: BaseLineDataType) => (
            <Tooltip title={record.instruction}>
                {text}
            </Tooltip>
        ),
    },
    {
        title: "环境变量",
        dataIndex: 'env_var',
        key: 'env_var',
    },
    {
        title: "存活时间",
        dataIndex: 'exist_time',
        key: 'exist_time',
    },
    {
        title: "是否开启保护",
        dataIndex: 'protection_actived',
        key: 'protection_actived',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: BaseLineDataType) => record.status.includes(value as string),
    },
    {
        title: "操作",
        dataIndex: 'operation',
        key: 'operation',
    },
];
export const hostperformanceColumns = [
    {
        title: "主机名稱",
        dataIndex: 'hostname',
        key: 'hostname',
        //width: '13%',
    },
    {
        title: "服務",
        dataIndex: 'service',
        key: 'service',
    },
    {
        title: "协议",
        dataIndex: 'protocol',
        key: 'protocol',
    },
    {
        title: "开放端口",
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: "服务",
        dataIndex: 'service',
        key: 'service',
    },
    {
        title: "服务版本",
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: "操作系统",
        dataIndex: 'ostype',
        key: 'ostype',
        filters: [
        ],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
];

export const fimcolumns_2 = [
    { title: 'Path', dataIndex: 'path', key: 'path' },
    { title: 'Host IP', dataIndex: 'hostIP', key: 'hostIP' },
    { title: 'Alert Type', dataIndex: 'alert_type', key: 'alert_type' },
    { title: 'Event Time', dataIndex: 'event_time', key: 'event_time' }
];
export const vulnerDetailColumns = [
    { title: '影响资产', dataIndex: 'influenceasset', key: 'influenceasset' },
    { title: '发现时间', dataIndex: 'foundtime', key: 'foundtime',
    sorter: (a: any, b: any) => Date.parse(b.foundtime) - Date.parse(a.foundtime), },
    { title: '状态', dataIndex: 'status', key: 'status',
    filters: [
    ],
    onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string), },
    { title: '操作', dataIndex: 'operation', key: 'operation' }
];
export const virusscannigAllTasksColumns = [
    { title: '任务名称', dataIndex: 'task_name', key: 'task_name' },
    { title: '任务类型', dataIndex: 'task_type', key: 'task_type',},
    { title: '文件路径', dataIndex: 'file_path', key: 'file_path',},
    { title: '创建人', dataIndex: 'creator', key: 'creator',},
    { title: '关联资产', dataIndex: 'task_status', key: 'task_status',},
    { title: '文件路径', dataIndex: 'file_path', key: 'file_path',},
    { title: '任务状态', dataIndex: 'status', key: 'status',
    filters: [
    ],
    onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string), },
    
    { title: '任务开始时间', dataIndex: 'task_start_time', key: 'task_start_time',
    sorter: (a: any, b: any) => Date.parse(b.task_start_time) - Date.parse(a.task_start_time), },
    
    { title: '操作', dataIndex: 'opertion', key: 'opertion',}
];


// 发送 POST 请求的函数
const sendPostRequest = async (data: any) => {
    try {
      const response = await axios.post('/api/operations', data); // 假设后端 API 地址是 '/api/operations'
      return response.data; // 假设返回的是操作相关的数据
    } catch (error) {
      console.error('Error sending POST request:', error);
      return null;
    }
  };
  
  // 发送 DELETE 请求的函数
  const sendDeleteRequest = async (recordId: string) => {
    try {
      const response = await axios.delete(`/api/operations/${recordId}`); // 假设后端 API 地址是 '/api/operations/:recordId'
      return response.data; // 假设返回的是操作相关的数据
    } catch (error) {
      console.error('Error sending DELETE request:', error);
      return null;
    }
  };
  
  // 点击操作按钮发送 POST 请求的函数
  export const handleOperationClickPost = async () => {
    const postData = { /* 要发送的数据 */ };
    const operationData = await sendPostRequest(postData);
    // 在这里处理操作数据，比如弹出一个对话框显示操作信息
    console.log('Operation data (POST):', operationData);
  };
  
  // 点击操作按钮发送 DELETE 请求的函数
  export const handleOperationClickDelete = async (recordId: string) => {
    const operationData = await sendDeleteRequest(recordId);
    // 在这里处理操作数据，比如弹出一个对话框显示操作信息
    console.log('Operation data (DELETE):', operationData);
  };



export interface PanelSelectedRowKeys {
    [key: string]: React.Key[];
}


// 定义 onSelectChange 函数
export const onSelectChange = (selectedKeys: React.Key[], panel: string, panelSelectedRowKeys: PanelSelectedRowKeys, setPanelSelectedRowKeys: (panelSelectedRowKeys: PanelSelectedRowKeys) => void) => {
    // 更新状态的逻辑
    setPanelSelectedRowKeys({
        ...panelSelectedRowKeys,
        [panel]: selectedKeys,
    });
};


// export const handleExport = (dataSource:GenericDataItem[], selectedRowKeys:React.Key[]) => {

//     // 过滤出已选中的行数据
//     const selectedData = dataSource.filter((row: AlertColumDataType) => selectedRowKeys.includes(row.key));

//     // 检查是否有选中的行
//     if (selectedData.length === 0) {
//         alert('没有选中的行');
//         return;
//     }

//     // 转换数据为CSV格式
//     const csvData = convertToCSV(selectedData);

//     // 触发下载
//     triggerDownload(csvData, 'export.csv');
// };

// export const convertToCSV = (data: AlertColumDataType[]) => {
//     // 假设您希望导出的CSV中包括所有字段
//     const headers = Object.keys(data[0]).join(',');
//     const rows = data.map((row: AlertColumDataType) => {
//         return `${row.key},${row.alarmName},${row.affectedAsset},${row.alarmType},${row.level},${row.status},${row.occurrenceTime}`;
//     });
//     return [headers, ...rows].join('\n');
// };

// export const triggerDownload = (data: string, filename: string) => {
//     const element = document.createElement('a');
//     element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
//     element.download = filename;
//     element.style.display = 'none';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
// };

