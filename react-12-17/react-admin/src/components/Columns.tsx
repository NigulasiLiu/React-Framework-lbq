import React from 'react';
import { Tooltip, Button, Select, Tag, Badge, Input, Space, Card, Row } from 'antd';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import buttonStyles from '../style/button.module.css';
import '../Style.css';
import moment from 'moment';
import DataDisplayTable from './ElkeidTable/DataDisplayTable';


export const ServerPort = 'http://localhost:5000';

export interface FilterDropdownProps {
    setSelectedKeys: (keys: string[]) => void;
    selectedKeys: string[];
    confirm: () => void;
    clearFilters?: () => void;
}

export interface AgentInfoType {
    id: string;
    cpu_use: string;
    disk_total: string;
    host_name: string;
    ip_address: string;
    last_seen: string;
    mem_total: string;
    mem_use: string;
    os_version: string;
    processor_architecture: string;
    processor_name: string;
    py_version: string;
    status: string;
    // 可以根据需要添加更多字段
}

export interface DetailItem {
    host_ip: string;
    userName: string;
    alert_type: string;
    event_time: string;
    port_number: string;
    port_state: string;
    cpuPercent: string;
    memoryPercent: string;
    highRisk: string;
    exe: string;
    cmdline: string;
    pid: string;
    check_name: string;
    createTime: string;
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

export const simplifiedTablePanel = ['createnewtask', 'UserManagementlist'];

export interface checkedItemDataType {
    level: string;
    passRate: number;
    scanResult: string;
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

export const baseLineDetectScanResult1Columns = [
    { title: '影响主机', dataIndex: 'influencehost', key: 'influencehost' },
    {
        title: '标签', dataIndex: 'label',
        //sorter: (a: any, b: any) => Date.parse(b.foundtime) - Date.parse(a.foundtime), 
    },
    {
        title: '检查结果', dataIndex: 'status',
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: '操作', dataIndex: 'operation',
        render: (text: string, record: any) => (
            // 在 render 方法中返回包含按钮的元素
            <Link to="/app/create_agent_task" target="_blank">
                <Button type="link" style={{ color: '#4086f4' }}>加白名单</Button>
            </Link>
        ),
    },
];
export const baseLineDetectCheckedItemColumns = [
    {
        title: '检查项',
        dataIndex: 'checkName',
        key: 'host_name',
        onHeaderCell: () => ({
            style: {
                maxWidth: 200, // 最大宽度200px
            },
        }),
    },
    {
        title: '级别',
        dataIndex: 'level',

        onFilter: (value: string | number | boolean, record: checkedItemDataType) => record.level.includes(value as string),
    },
    {
        title: '通过率',
        dataIndex: 'passRate',
        sorter: (a: any, b: any) => Date.parse(b.passRate) - Date.parse(a.passRate),
    },

    {
        title: '操作',
        dataIndex: 'operation',
        render: (text: string, record: any) => (
            // 在 render 方法中返回包含按钮的元素
            <Link to="/app/create_agent_task" target="_blank">
                <Button type="link" style={{ color: '#4086f4' }}>重新检查</Button>
            </Link>
        ),
    },
];
export const baseLineDetectHostItemColumns = [
    {
        title: '影响主机',
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
        sorter: (a: any, b: any) => Date.parse(b.riskItem) - Date.parse(a.riskItem),
    },
    {
        title: '通过项',
        dataIndex: 'passItem',
        // 
        // onFilter: (value: string | number | boolean, record: checkedItemDataType) => record.level.includes(value as string),
    },

    {
        title: '操作',
        dataIndex: 'operation',
        render: (text: string, record: any) => (
            // 在 render 方法中返回包含按钮的元素
            <Link to="/app/create_agent_task" target="_blank">
                <Button type="link" style={{ color: '#4086f4' }}>重新检查</Button>
            </Link>
        ),
    },
];
export const baseLineDetectScanResult2Columns = [
    {
        title: '影响主机',
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
    },
    {
        title: '扫描结果',
        dataIndex: 'scanResult',

        //onFilter: (value: string | number | boolean, record: checkedItemDataType) => record.scanResult.includes(value as string),
    },

    {
        title: '操作',
        dataIndex: 'operation',
        render: (text: string, record: any) => (
            // 在 render 方法中返回包含按钮的元素
            <Link to="/app/create_agent_task" target="_blank">
                <Button type="link" style={{ color: '#4086f4' }}>加白名单</Button>
            </Link>
        ),
    },
];
export const virusscandetailscolumns = [
    {
        title: '主机名', dataIndex: 'host_name', key: 'host_name',
        render: (text: string, record: any) => (
            // 在 render 方法中返回包含按钮的元素
            <Link to="/app/detailspage" target="_blank">
                <Button type="link" style={{ color: '#4086f4' }}>{text}</Button>
            </Link>
        ),
    },
    {
        title: '状态', dataIndex: 'status',
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: '汇报时间', dataIndex: 'report_time',
        sorter: (a: any, b: any) => Date.parse(b.report_time) - Date.parse(a.report_time),
    },
];

export interface CreateTaskDataType {
    key: React.Key;
    uuid: string;
    host_name: string;
    label: string;
    group: string;
    os: string;
    status: string;
    updatetime: string;
}

export const createNewTaskColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        //width: '13%',
    },
    {
        title: 'UUID',
        dataIndex: 'uuid', key: 'uuid',
        // onFilter: (values: string, record: CreateTaskDataType) => record.uuid.includes(values),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

        render: (text: string) => (
            // 使用模板字符串构造带查询参数的路径,encodeURIComponent 函数确保 text 被正确编码
            <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
                <Button style={{
                    fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF',
                    padding: '0 0',
                }}>{text.slice(0, 5)}</Button>
            </Link>
        ),
    },
    // {
    //     title: "主机名",
    //     dataIndex: 'host_name',
    // },
    {
        title: '主机IP',
        dataIndex: 'ip_address',
    },
    {
        title: '操作系统',
        dataIndex: 'os_version',
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // onFilter: (values: string, record: hostinventoryColumnsType) => record.os_version.toString().toLowerCase().includes(values.toLowerCase()),
    },
    {
        title: '状态',
        dataIndex: 'status',
        onFilter: (value: string | number | boolean, record: hostinventoryColumnsType) => record.status.includes(value as string),
        filters: [
            {
                text: 'Online',
                value: 'Online',
            },
            {
                text: 'Offline',
                value: 'Offline',
            },
        ],
        // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: hostinventoryColumnsType) => (
            <Badge status={record.status === 'Online' ? 'success' : 'error'} text={record.status} />
        ),
    },
];


export interface hostinventoryColumnsType {
    key: React.Key;
    uuid: string;
    os_version: string;
    ip_address: string;
    status: string;
    mem_use: string;
    cpu_use: string;
}

// 先定义一个辅助函数，用于从带百分比的字符串中提取数字
const extractNumberFromPercentString = (percentString: string): number => {
    return parseFloat(percentString.replace('%', ''));
};

export const hostinventoryColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
        // render:(text:string)=>(
        //     <Button className="custom-button">{text}</Button>
        // ),
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        onFilter: (values: string, record: hostinventoryColumnsType) => record.uuid.includes(values) || record.ip_address.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索主机名或IP..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        //filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text: string, record: hostinventoryColumnsType) => (
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
                    <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.ip_address}
                </div>
            </div>
        ),
    },
    // {
    //     title: "主机名",
    //     dataIndex: 'uuid', key: 'uuid',
    //     onFilter: (values:string, record:hostinventoryColumnsType) => record.uuid.includes(values),
    //     filterDropdown: ({
    //         setSelectedKeys,
    //         selectedKeys,
    //         confirm,
    //         clearFilters,
    //     }: FilterDropdownProps) => (
    //         <div style={{ padding: 8 }}>
    //             <Input
    //                 autoFocus
    //                 placeholder="搜索..."
    //                 value={selectedKeys[0]}
    //                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={() => confirm()}
    //                 style={{ width: 188, marginBottom: 8, display: 'block' }}
    //             />
    //             <Button
    //                 onClick={() => confirm()}
    //                 size="small"
    //                 style={{ width: 90, marginRight: 8,backgroundColor:'#1664FF',color:'white' }}
    //             >
    //                 搜索
    //             </Button>
    //             <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
    //                 重置
    //             </Button>
    //         </div>
    //     ),
    //     filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

    //     render: (text: string) => (
    //         // 使用模板字符串构造带查询参数的路径,encodeURIComponent 函数确保 text 被正确编码
    //         <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
    //           <Button style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',
    //                     padding:'0 0'}}>{text.slice(0,5)}</Button>
    //         </Link>
    //       ),
    // },
    // {
    //     title: "主机IP",
    //     dataIndex: 'ip_address',
    //     filterDropdown: ({
    //         setSelectedKeys,
    //         selectedKeys,
    //         confirm,
    //         clearFilters,
    //     }: FilterDropdownProps) => (
    //         <div style={{ padding: 8 }}>
    //             <Input
    //                 autoFocus
    //                 placeholder="搜索..."
    //                 value={selectedKeys[0]}
    //                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={() => confirm()}
    //                 style={{ width: 188, marginBottom: 8, display: 'block' }}
    //             />
    //             <Button
    //                 onClick={() => confirm()}
    //                 size="small"
    //                 style={{ width: 90, marginRight: 8,backgroundColor:'#1664FF',color:'white' }}
    //             >
    //                 搜索
    //             </Button>
    //             <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
    //                 重置
    //             </Button>
    //         </div>
    //     ),
    //     filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    //     onFilter: (values:string, record:hostinventoryColumnsType) => record.ip_address.toString().toLowerCase().includes(values.toLowerCase()),

    // }, 
    {
        title: '操作系统',
        dataIndex: 'os_version',
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        //onFilter: (values: string, record: hostinventoryColumnsType) => record.os_version.toString().toLowerCase().includes(values.toLowerCase()),
    },
    {
        title: '状态',
        dataIndex: 'status',
        onFilter: (value: string | number | boolean, record: hostinventoryColumnsType) => record.status.includes(value as string),
        filters: [
            {
                text: 'Online',
                value: 'Online',
            },
            {
                text: 'Offline',
                value: 'Offline',
            },
        ],
        // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: hostinventoryColumnsType) => (
            <Badge status={record.status === 'Online' ? 'success' : 'error'} text={record.status} />
        ),
    },
    //

    {
        title: '内存使用量',
        dataIndex: 'mem_use',
        sorter: (a: hostinventoryColumnsType, b: hostinventoryColumnsType) => extractNumberFromPercentString(a.mem_use) - extractNumberFromPercentString(b.mem_use),
    },
    {
        title: 'CPU使用率',
        dataIndex: 'cpu_use',
        sorter: (a: hostinventoryColumnsType, b: hostinventoryColumnsType) => extractNumberFromPercentString(a.cpu_use) - extractNumberFromPercentString(b.cpu_use),
    },
    // 操作 列，根据状态禁用按钮style={{ color: record.status === 'Online' ? '#4086f4' : '#d9d9d9' }}
    {
        title: '操作',
        dataIndex: 'operation',
        render: (text: string, record: any) => (
            <Link to="/app/create_agent_task" target="_blank">
                <Button
                    style={{
                        fontWeight: 'bold', padding: '0 0',
                        border: 'transparent',
                        backgroundColor: 'transparent',
                        // color: record.status === 'Online' ? '#4086FF' : 'rgba(64, 134, 255, 0.5)', // 动态改变颜色
                        // cursor: record.status === 'Online' ? 'pointer' : 'default' // 当按钮被禁用时，更改鼠标样式
                    }}
                    disabled={record.status !== 'Online'}
                >
                    下发任务
                </Button>
            </Link>
        ),
    },
];

export interface FimDataType {
    key: React.Key;
    filename: string;
    event_time: string;
    hostname: string;
    hostIP: string;
    uuid: string;
    alert_type: string;
}

export const fimColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        //onFilter: (values: string, record: FimDataType) => record.uuid.includes(values) || record.hostIP.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索主机名或IP..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text: string, record: FimDataType) => (
            <div>
                <div>
                    {/*{record.uuid.slice(0, 5)}*/}
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
                    <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.hostIP}
                </div>
            </div>
        ),
    },
    {
        title: '文件名',
        dataIndex: 'filename',
        //onFilter: (values: string, record: FimDataType) => record.filename.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

        onHeaderCell: () => ({
            style: {
                maxWidth: 200, // 最大宽度200px
            },
        }),
    },
    {
        title: '告警时间',
        dataIndex: 'event_time',
        render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a: any, b: any) => parseFloat(b.event_time) - parseFloat(a.event_time),
    },
    {
        title: '告警类型',
        dataIndex: 'alert_type',
        onFilter: (value: string | number | boolean, record: FimDataType) => record.alert_type.includes(value as string),
        filters: [
            {
                text: 'created',
                value: 'created',
            },
            {
                text: 'deleted',
                value: 'deleted',
            },
            {
                text: 'modified',
                value: 'modified',
            },
        ],
        // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: FimDataType) => (
            <Badge
                status={record.alert_type === 'deleted' ? 'error' : (record.alert_type === 'modified' ? 'warning' : 'processing')}
                text={record.alert_type} />
        ),


        onHeaderCell: () => ({
            style: {
                minWidth: 80, // 最小宽度100px
                //maxWidth: 170, // 最大宽度200px
            },
        }),
    },
];

export const monitoredColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        render: (text: string, record: any) => (
            <div>
                <div>
                    {/*{record.uuid.slice(0, 5)}*/}
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
                    <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.agentIP}
                </div>
            </div>
        ),
    },
    {
        title: '文件名',
        dataIndex: 'file_path',
        onHeaderCell: () => ({
            style: {
                maxWidth: 200, // 最大宽度200px
            },
        }),
    },
    {
        title: '告警类型',
        dataIndex: 'change_type',
        onFilter: (value: string | number | boolean, record: any) => record.change_type.includes(value as string),
        filters: [
            {
                text: 'created',
                value: 'created',
            },
            {
                text: 'deleted',
                value: 'deleted',
            },
            {
                text: 'modified',
                value: 'modified',
            },
        ],
        // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: any) => (
            <Badge
                status={record.change_type === 'deleted' ? 'error' : (record.change_type === 'modified' ? 'warning' : 'processing')}
                text={record.change_type} />
        ),


        onHeaderCell: () => ({
            style: {
                minWidth: 80, // 最小宽度100px
                //maxWidth: 170, // 最大宽度200px
            },
        }),
    },
    {
        title: '文件类型',
        dataIndex: 'file_type',
    },
    {
        title: '告警时间',
        dataIndex: 'timestamp',
        render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a: any, b: any) => parseFloat(b.timestamp) - parseFloat(a.timestamp),
    },
];

export interface openPortsColumnsType {
    key: React.Key;
    host_ip: string;
    port_number: string;
    port_name: string;
    port_state: string;
    uuid: string;
}

export const openPortsColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },

    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        //onFilter: (values: string, record: openPortsColumnsType) => record.uuid.includes(values) || record.host_ip.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索主机名或IP..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text: string, record: openPortsColumnsType) => (
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
                    <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.host_ip}
                </div>
            </div>
        ),
    },
    {
        title: '端口号',
        dataIndex: 'port_number',

        onHeaderCell: () => ({
            style: {
                //minWidth: 80, // 最小宽度100px
                maxWidth: 170, // 最大宽度200px
            },
        }),
    },
    {
        title: '端口状态',
        dataIndex: 'port_state',
        filters: [
            {
                text: 'open',
                value: 'open',
            },
            {
                text: 'closed',
                value: 'closed',
            },
        ],
        // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: openPortsColumnsType) => (
            <Badge status={record.port_state === 'open' ? 'success' : 'default'} text={record.port_state} />
        ),
        onFilter: (value: string | number | boolean, record: openPortsColumnsType) => record.port_state.includes(value as string),
        onHeaderCell: () => ({
            style: {
                //minWidth: 80, // 最小宽度100px
                maxWidth: 170, // 最大宽度200px
            },
        }),
    },
    {
        title: '端口名称',
        dataIndex: 'port_name',

    },
    {
        title: '应用',
        dataIndex: 'product',
    },
    {
        title: '额外信息',
        dataIndex: 'extrainfo',
    },

    // {
    //     title: '进程ID',
    //     dataIndex: 'processId',
    //     key: 'processId',
    // },
    // {
    //     title: '进程名',
    //     dataIndex: 'processName',
    //     key: 'processName',
    // },
    // {
    //     title: '进程命令行',
    //     dataIndex: 'processCmd',
    //     key: 'processCmd',
    // },
    // {
    //     title: '用户ID',
    //     dataIndex: 'userId',
    //     key: 'userId',
    // },
    // {
    //     title: '用户名',
    //     dataIndex: 'userName',
    //     key: 'userName',
    // },
    // {
    //     title: '最新扫描时间',
    //     dataIndex: 'latestScanningTime',
    //     key: 'latestScanningTime',
    // },
    // ... 其他字段定义
];

export interface runningProcessesColumnsType {
    scanTime: string;
    key: React.Key;
    uuid: string;
    agentIP: string;
    pid: string;
    exe: string;
    userName: string;
    cmdline: string;
    cpuPercent: string;
    memoryPercent: string;
    createTime: string;
    highRisk: string;
}

// 运行进程表的列定义
export const runningProcessesColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        //onFilter: (values: string, record: runningProcessesColumnsType) => record.uuid.includes(values) || record.agentIP.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索主机名或IP..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text: string, record: runningProcessesColumnsType) => (
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
                    <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.agentIP}
                </div>
            </div>
        ),
    },
    {
        title: 'PID',
        dataIndex: 'pid',

        sorter: (a: runningProcessesColumnsType, b: runningProcessesColumnsType) => parseFloat(a.pid) - parseFloat(b.pid),

    },
    {
        title: '进程名',
        dataIndex: 'name',

        render: (text: string, record: runningProcessesColumnsType) => (
            <Tooltip title={'路径:' + record.exe}>
                {text}
            </Tooltip>
        ),
        //
        //onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: '用户',
        dataIndex: 'userName',

        //onFilter: (value: string | number | boolean, record: runningProcessesColumnsType) => (record.userName&&record.userName.includes(value as string)),
    },
    // {
    //     title: '进程路径',
    //     dataIndex: 'exe',
    //     key: 'exe',
    //     onHeaderCell: () => ({
    //         style: {
    //           //minWidth: 80, // 最小宽度100px
    //           maxWidth: 80, // 最大宽度200px
    //         },
    //       }),
    // },
    // {
    //     title: "调整建议",
    //     dataIndex: 'adjustment_requirement',
    //     key: 'adjustment_requirement',
    //     render: (text: string, record: BaseLineDataType) => (
    //         <Tooltip title={record.instruction}>
    //             {text}
    //         </Tooltip>
    //     ),
    // },
    {
        title: '命令行',
        dataIndex: 'cmdline',
        render: (text: string, record: runningProcessesColumnsType) => (
            <Tooltip title={record.cmdline}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                    {record.cmdline}
                </div>
            </Tooltip>
        ),
    },
    {
        title: 'CPU',
        dataIndex: 'cpuPercent',
        render: (text: string, record: any) => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '30px' }}>
                {record.cpuPercent}
            </div>
        ),
        sorter: (a: runningProcessesColumnsType, b: runningProcessesColumnsType) => parseFloat(a.cpuPercent) - parseFloat(b.cpuPercent),
    },
    {
        title: '内存',
        dataIndex: 'memoryPercent',
        render: (text: string, record: any) => (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '50px' }}>
                {record.memoryPercent}
            </div>
        ),
        sorter: (a: runningProcessesColumnsType, b: runningProcessesColumnsType) => parseFloat(a.memoryPercent) - parseFloat(b.memoryPercent),
    },
    {
        title: '扫描时间',
        dataIndex: 'scanTime',
        render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a: runningProcessesColumnsType, b: runningProcessesColumnsType) => parseFloat(a.scanTime) - parseFloat(b.scanTime),
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a: runningProcessesColumnsType, b: runningProcessesColumnsType) => parseFloat(a.createTime) - parseFloat(b.createTime),
    },
    {
        title: '是否高危',
        dataIndex: 'highRisk',
        filters: [
            {
                text: 'No',
                value: 'No',
            },
            {
                text: 'Yes',
                value: 'Yes',
            },
        ],
        // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: runningProcessesColumnsType) => (
            <Badge status={record.highRisk === 'Yes' ? 'error' : 'processing'} text={record.highRisk} />
        ),
        onFilter: (value: string | number | boolean, record: runningProcessesColumnsType) => record.highRisk.includes(value as string),
    },
];


export interface systemServicesColumnsType {
    key: React.Key;
    service: string;
    ip: string;
    uuid: string;
    product: string;
    os_type: string;
}

export const systemServicesColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        //onFilter: (values: string, record: systemServicesColumnsType) => record.uuid.includes(values) || record.ip.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索主机名或IP..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text: string, record: systemServicesColumnsType) => (
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
        title: '服务',
        dataIndex: 'service',
        //: (values: string, record: systemServicesColumnsType) => record.service.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

    },
    {
        title: '端口',
        dataIndex: 'port',
    },
    {
        title: '协议',
        dataIndex: 'protocol',
    },
    {
        title: '应用',
        dataIndex: 'product',
        //onFilter: (values: string, record: systemServicesColumnsType) => record.product.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

    },
    {
        title: '应用版本',
        dataIndex: 'version',
    },
    {
        title: '操作系统',
        dataIndex: 'ostype',
        //onFilter: (values: string, record: systemServicesColumnsType) => record.os_type.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,

    },
    // {
    //     title: '类型',
    //     dataIndex: 'type',
    //     key: 'type',
    //     
    //     onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    // },
    // {
    //     title: '执行命令',
    //     dataIndex: 'executionCommand',
    //     key: 'executionCommand',
    // },
    // {
    //     title: '工作目录',
    //     dataIndex: 'workingDirectory',
    //     key: 'workingDirectory',
    // },
    // {
    //     title: '文件哈希',
    //     dataIndex: 'fileHash',
    //     key: 'fileHash',
    // },
    // {
    //     title: '是否自动重启',
    //     dataIndex: 'autoRestart',
    //     key: 'autoRestart',
    //     
    //     onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    //     // 这里假设 autoRestart 是布尔值，可以根据需要进行调整
    //     //render: (text, record) => (record.autoRestart ? '是' : '否'),
    // },
    // {
    //     title: '最新扫描时间',
    //     dataIndex: 'lastScanTime',
    //     key: 'lastScanTime',
    // },
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
        // render: (text: string, record: AlertDataType) => (
        //     <a
        //         href={'/login'}
        //         target="_blank"
        //         rel="noopener noreferrer"
        //         style={{ color: '#1964F5' }}// 添加颜色样式
        //     >
        //         {text}
        //     </a>
        // ),
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
    host_name: string;
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

    os_version: string;

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
        title: '加白名称',
        dataIndex: 'whitelistName',
        key: 'whitelistName',
        //width: '13%',
    },
    {
        title: '加白描述',
        dataIndex: 'whitelistDescription',
        key: 'whitelistDescription',
    },
    {
        title: '加白范围',
        dataIndex: 'whitelistScope',
        key: 'whitelistScope',
        filters: [
            { text: '全局', value: '全局' },
            { text: '非全局', value: '非全局' },
        ],
        onFilter: (value: string | number | boolean, record: WhiteListColumDataType) => record.whitelistScope.includes(value as string),
    },
    {
        title: '匹配告警名',
        dataIndex: 'matchAlertName',
        key: 'matchAlertName',
    },
    {
        title: '匹配方式',
        dataIndex: 'matchMethod',
        key: 'matchMethod',
    },
    {
        title: '操作时间',
        dataIndex: 'occurrenceTime',
        key: 'occurrenceTime',
    },
    {
        title: '操作',
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

export interface baselineDetectColumnsType {
    key: React.Key;
    ip: string;
    uuid: string;
    check_name: string;
    createTime: string;
    instruction: string;       // 指令
    status: string;
}

export const baselineDetectColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
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
        title: '基线名称',
        dataIndex: 'check_name',
        render: (text: string, record: baselineDetectColumnsType) => (
            <Tooltip title={record.check_name}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                    {record.check_name}
                </div>
            </Tooltip>
        ),
    },
    {
        title: '检查详情',
        dataIndex: 'details',
        render: (text: string, record: any) => (
            <Tooltip title={record.details}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                    {record.details}
                </div>
            </Tooltip>
        ),
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

        // render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        // sorter: (a: any, b: any) => Date.parse(b.occurrenceTime) - Date.parse(a.occurrenceTime),
        // sorter: (a: { occurrenceTime: string | number | Date; }, b: { occurrenceTime: string | number | Date; }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
        // sortDirections: ['ascend', 'descend'],
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: (text: string, record: baselineDetectColumnsType) => (

            <div>
                <Link to={`/app/baseline_detail?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                    <Button style={{
                        fontWeight: 'bold',
                        border: 'transparent',
                        backgroundColor: 'transparent',
                        color: '#4086FF',
                        marginRight: '20px',
                        padding: '0 0',
                    }} className="custom-link-button">详情</Button>
                </Link>
                {/* <Button className="custom-link-button" 
            style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',
            padding:'0 0' }}>加白名单</Button> */}
            </div>
        ),

    },
];

export const threatHuntingColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        render: (text: string, record: any) => (
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
                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
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
                    <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.agent_ip}
                </div>
            </div>
        ),
    },
    {
        title: '攻击者IP',
        dataIndex: 'atk_ip',
        key: 'tactic',
    },
    {
        title: '扫描时刻',
        dataIndex: 'scan_time',
        key: 'scan_time',
        render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a: any, b: any) => parseFloat(b.scan_time) - parseFloat(a.scan_time),
    },
    {
        title: '告警类型',
        dataIndex: 'atk_type',
        key: 'atk_type',
    },
    // 其他需要的列
];

// 假设这是FilterDropdownProps类型的定义，为了方便演示，我将其简化了
// interface FilterDropdownProps {
//     setSelectedKeys: (keys: string[]) => void;
//     selectedKeys: string[];
//     confirm: () => void;
//     clearFilters?: () => void;
//   }
export const generate_new_columns = (columns: any[], search_index: string[]): any[] => {
    // 遍历this.props.columns中的每一列
    return columns.map((column: any) => {
        // 如果列名在search_index中
        if (search_index.includes(column.dataIndex)) {
            // 为这列添加搜索功能
            return {
                ...column,
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
                            onClick={() => filterDropdownProps.confirm()}
                            size="small"
                            style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
                        >
                            搜索
                        </Button>
                        <Button
                            disabled={filterDropdownProps.clearFilters === undefined}
                            onClick={() => filterDropdownProps.clearFilters?.()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            重置
                        </Button>
                    </div>
                ),
            };
        } else {
            // 如果不在search_index中，直接返回原列
            return column;
        }
    });
};


export const virusscannigAllTasksColumns = [
    { title: '任务名称', dataIndex: 'task_name', key: 'task_name' },
    { title: '任务类型', dataIndex: 'task_type', key: 'task_type' },
    { title: '文件路径', dataIndex: 'file_path', key: 'file_path' },
    { title: '创建人', dataIndex: 'creator', key: 'creator' },
    { title: '关联资产', dataIndex: 'task_status', key: 'task_status' },
    { title: '文件路径', dataIndex: 'file_path', key: 'file_path' },
    {
        title: '任务状态', dataIndex: 'status', key: 'status',
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },

    {
        title: '任务开始时间', dataIndex: 'task_start_time', key: 'task_start_time',
        sorter: (a: any, b: any) => Date.parse(b.task_start_time) - Date.parse(a.task_start_time),
    },

    { title: '操作', dataIndex: 'opertion', key: 'opertion' },
];


// 系统用户表的列定义
export const systemUsersColumns = [
    {
        title: '主机名',
        dataIndex: 'host_name',
        key: 'host_name',
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


export const systemSoftwareColumns = [
    {
        title: '主机名',
        dataIndex: 'host_name',
        key: 'host_name',
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


//     {
//         title: "漏洞名称",
//         dataIndex: 'alarmName',
//         key: 'alarmName',
//         //width: '13%',
//     },
//     {
//         title: "影响资产数",
//         dataIndex: 'affectedAsset',
//         key: 'affectedAsset',
//     },
//     {
//         title: "漏洞特征",
//         dataIndex: 'tz',
//         key: 'tz',
//     },
//     {
//         title: "级别",
//         dataIndex: 'level',
//         key: 'level',
//         filters: [
//             { text: '紧急', value: '紧急' },
//             { text: '高危', value: '高危' },
//             { text: '低危', value: '低危' },
//             { text: '中危', value: '中危' },
//         ],
//         onFilter: (value: string | number | boolean, record: AlertDataType) => record.level.includes(value as string),
//     },
//     {
//         title: "状态",
//         dataIndex: 'status',
//         key: 'status',
//         filters: [
//             { text: '已处理', value: '已处理' },
//             { text: '未处理', value: '未处理' },
//         ],
//         onFilter: (value: string | number | boolean, record: AlertDataType) => record.status.includes(value as string),
//     },
//     {
//         title: "最新扫描时间",
//         dataIndex: 'occurrenceTime',
//         key: 'occurrenceTime',
//     },
//     {
//         title: "操作",
//         dataIndex: 'operation',
//         key: 'operation',
//     },
// ];

// export const vulnerabilityColumns_new = [//discard
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: '主机IP',
//       dataIndex: 'ip',
//     },
//     {
//       title: '端口',
//       dataIndex: 'port',
//     },
//     {
//       title: '扫描时刻',
//       dataIndex: 'scanTime',
//       sorter: (a: any, b: any) => Date.parse(b.scanTime) - Date.parse(a.scanTime), 
//     },
//     {
//       title: '扫描类型',
//       dataIndex: 'scanType',
//     },

//     {
//         title: "操作",
//         dataIndex: 'operation',

//         render: (text: string) => (
//             <div>
//             <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
//               <Button className="custom-link-button">忽略</Button>
//             </Link>
//             <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
//               <Button className="custom-link-button">详情</Button>
//             </Link>
//             </div>
//           ),
//     },
//     // {
//     //     title: '漏洞挖掘结果',
//     //     dataIndex: 'vul_detection_exp_result',
//     //     // render: (text: any, record: any) => (
//     //     //   <Tooltip title={`ID: ${record.id}, IP: ${record.ip}, Scan Time: ${record.scanTime}, Scan Type: ${record.scanType}`}>
//     //     //     <span>{text.map((item: any) => item.bug_exp).join(', ')}</span>
//     //     //   </Tooltip>
//     //     // ),
//     // },
//     // {
//     // title: '漏洞指纹',
//     // dataIndex: 'vul_detection_finger_result',
//     // // render: (text: any) => (
//     // //     <Tooltip title={`ID: ${text[0].id}, IP: ${text[0].ip}, Port: ${text[0].port}, Scan Time: ${text[0].scanTime}, Scan Type: ${text[0].scanType}, URL: ${text[0].url}`}>
//     // //     <span>{text.map((item: any) => item.finger).join(', ')}</span>
//     // //     </Tooltip>
//     // // ),
//     // },
//     // {
//     // title: 'Vulnerability PoC',
//     // dataIndex: 'vul_detection_poc_result',
//     // // render: (text: any) => (
//     // //     <Tooltip title={`ID: ${text[0].id}, IP: ${text[0].ip}, Port: ${text[0].port}, Scan Time: ${text[0].scanTime}, Scan Type: ${text[0].scanType}, URL: ${text[0].url}`}>
//     // //     <span>{text.map((item: any) => item.bug_poc).join(', ')}</span>
//     // //     </Tooltip>
//     // // ),
//     // },
// ];
export interface vulColumnsType {
    key: React.Key;
    ip: string;
    uuid: string;
    port: string;
}

export const hostperformanceColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
    },
    {
        title: '主机名',
        dataIndex: 'uuid',
        key: 'uuid',
        //width: '13%',
    },
    {
        title: '服務',
        dataIndex: 'service',
        key: 'service',
    },
    {
        title: '协议',
        dataIndex: 'protocol',
        key: 'protocol',
    },
    {
        title: '开放端口',
        dataIndex: 'port',
        key: 'port',
    },
    {
        title: '服务',
        dataIndex: 'service',
        key: 'service',
    },
    {
        title: '服务版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '操作系统',
        dataIndex: 'ostype',
        key: 'ostype',
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8,backgroundColor:'#1664FF',color:'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        // filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        // onFilter: (values:string, record:hostinventoryColumnsType) => record.os_version.toString().toLowerCase().includes(values.toLowerCase()),
    },
];

export const constRenderTable = (OriginData: any[], title: string,
                                 timeColumnIndex: string[], column: any[], currentPanel: string, api: string,
                                 searchIndex?: string[], additionalButton?: () => void, additionalButtonTitile?: string) => {
    if (OriginData !== undefined) {
        // 确保OriginData总是作为数组处理
        const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
        return (
            <div style={{ fontWeight: 'bolder', width: '100%' }}>
                <Card bordered={true}
                      style={{ backgroundColor: '#ffffff' }}>
                    <Row>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                            fontWeight: 'bold',
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
                        </div>
                    </Row>
                    <DataDisplayTable
                        externalDataSource={originDataArray}
                        apiEndpoint={api}
                        timeColumnIndex={timeColumnIndex}
                        columns={column}
                        currentPanel={currentPanel}
                        searchColumns={searchIndex}
                        additionalButton={additionalButton}
                        additionalButtonTitile={additionalButtonTitile}
                    />
                </Card>
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Card bordered={true}
                  style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      width: '100%',
                  }}>
                <LoadingOutlined style={{ fontSize: '3em' }} />
            </Card>
        </div>
    );
};