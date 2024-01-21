import React from 'react';
import { Tooltip } from 'antd';

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
interface AlertDataType {
    key: React.Key;
    alarmName: string;        // 告警名称
    affectedAsset: string;    // 影响资产
    alarmType: string;        // 告警类型
    level: string;            // 级别
    status: string;           // 状态
    tz: string;
    occurrenceTime: string;   // 发生时间
  }
  interface WhiteListColumDataType {
    key: React.Key;
    whitelistName: string;    // 加白名称
    whitelistDescription: string; // 加白描述
    whitelistScope: string;    // 加白范围
    matchAlarmName: string;    // 匹配告警名
    matchMethod: string;       // 匹配方式
    occurrenceTime: string;   // 发生时间
}

interface BaseLineDataType {
    key: React.Key;
    ip: string;                // IP
    check_name: string;        // 基线名称
    details: string;           // 检查详情
    adjustment_requirement: string;  // 调整建议
    status: string;            // 状态
    last_checked: string;      // 最新扫描时间
    instruction: string;       // 指令
  }
interface GenericDataItem {
    [key: string]: any;
}
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

interface AlertColumDataType {
    key: React.Key;
    alarmName: string;        // 告警名称
    affectedAsset: string;    // 影响资产
    alarmType: string;        // 告警类型
    level: string;            // 级别
    status: string;           // 状态
    occurrenceTime: string;   // 发生时间
}

interface StatusItem {
    color: string;
    label: string;
    value: number;
}
export const whiteColumns = [
    {
        title: () => <span style={{ fontWeight: 'bold' }}>加白名称</span>,
        dataIndex: 'whitelistName',
        //width: '13%',
    },
    {
        title: () => <span style={{ fontWeight: 'bold' }}>加白描述</span>,
        dataIndex: 'whitelistDescription',
    },
    {
        title: () => <span style={{ fontWeight: 'bold' }}>加白范围</span>,
        dataIndex: 'whitelistScope',
        filters: [
            { text: '全局', value: '全局' },
            { text: '非全局', value: '非全局' },
        ],
        onFilter: (value: string | number | boolean, record: WhiteListColumDataType) => record.whitelistScope.includes(value as string),
    },
    {
        title: () => <span style={{ fontWeight: 'bold' }}>匹配告警名</span>,
        dataIndex: 'matchAlarmName',
    },
    {
        title: () => <span style={{ fontWeight: 'bold' }}>匹配方式</span>,
        dataIndex: 'matchMethod',
    },
    {
        title: () => <span style={{ fontWeight: 'bold' }}>操作时间</span>,
        dataIndex: 'occurrenceTime',
    },
    {
        title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
        dataIndex: 'operation',
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
export const fimColumns = [
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
export const hostalertColumns = [
    {
        title: '告警名称',
        dataIndex: 'alertName',
        key: 'alertName',
        render: (text: string, record: AlertColumDataType) => (
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
        dataIndex: 'alertClass',
        key: 'alertClass',
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
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
export const vulnerabilityColumns = [
    {
      title: () => <span style={{ fontWeight: 'bold' }}>漏洞名称</span>,
      dataIndex: 'alarmName',
      //width: '13%',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>影响资产数</span>,
      dataIndex: 'affectedAsset',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>漏洞特征</span>,
      dataIndex: 'tz',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>级别</span>,
      dataIndex: 'level',
      filters: [
        { text: '紧急', value: '紧急' },
        { text: '高危', value: '高危' },
        { text: '低危', value: '低危' },
        { text: '中危', value: '中危' },
      ],
      onFilter: (value: string | number | boolean, record: AlertDataType) => record.level.includes(value as string),
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
      title: () => <span style={{ fontWeight: 'bold' }}>最新扫描时间</span>,
      dataIndex: 'occurrenceTime',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
      dataIndex: 'operation',
    },
  ];

export const baselineDetectColumns = [
    {
      title: () => <span style={{ fontWeight: 'bold' }}>IP</span>,
      dataIndex: 'ip',
      //width: '13%',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>基线名称</span>,
      dataIndex: 'check_name',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>检查详情</span>,
      dataIndex: 'details',
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>调整建议</span>,
      dataIndex: 'adjustment_requirement',
      render: (text: string, record: BaseLineDataType) => (
        <Tooltip title={record.instruction}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
      dataIndex: 'status',
      filters: [
      ],
      onFilter: (value: string | number | boolean, record: BaseLineDataType) => record.status.includes(value as string),
    },
    {
      title: () => <span style={{ fontWeight: 'bold' }}>最新扫描时间</span>,
      dataIndex: 'last_checked',
      sorter: (a: { occurrenceTime: string | number | Date; }, b: { occurrenceTime: string | number | Date; }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    // {
    //   title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
    //   dataIndex: 'operation',
    // },
  ];
// 定义类型，如果你的项目中有相应的类型定义
interface PanelSelectedRowKeys {
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
