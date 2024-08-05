import React from 'react';
import { Row, Col, Card, message, Button, Tooltip, Badge, Dropdown, Menu } from 'antd';
import { constRenderTable, extractNumberFromPercentString, hostinventoryColumnsType, StatusItem } from '../Columns';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import { Agent_Data_API } from '../../service/config';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import moment from 'moment/moment';

//const { Search } = Input;

interface HostInventoryProps extends RouteComponentProps {
    host_number: number;
    host_in_alert: number;
    host_with_vul: number;
    host_with_baselineRisk: number;
    host_status_running: number;
    host_status_error: number;
    host_status_offline: number;
    host_status_uninstall: number;
};

interface HostInventoryState {
    runningStatusData: StatusItem[];
    riskData: StatusItem[];
    fullDataSource: any[], // 存储完整的数据源副本
    deleteIndex: number | null;
    activeIndex: any;
    hostinventoryColumns: any[];
    taskKey: string;
};


// Define an interface for the props expected by the StatusPanel component
interface StatusPanelProps {
    statusData: StatusItem[];
    orientation: 'vertical' | 'horizontal'; // 添加方向属性
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ statusData, orientation }) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        alignItems: 'flex-start',
        gap: orientation === 'horizontal' ? '7px' : '0', // 设置水平方向的间隔
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: orientation === 'vertical' ? 'space-between' : 'flex-start',
        alignItems: 'center',
        width: orientation === 'vertical' ? '100%' : undefined,
        margin: '3px',
    };

    const valueStyle: React.CSSProperties = {
        marginLeft: orientation === 'vertical' ? '40px' : '0', // 设置垂直方向的间隔
    };

    return (
        <div style={containerStyle}>
            {statusData.map((status, index) => (
                <div key={index} style={itemStyle}>
          <span style={{
              height: '10px',
              width: '10px',
              backgroundColor: status.color,
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px',
          }}></span>
                    <span style={{ flexGrow: 1 }}>{status.label}</span>
                    {orientation === 'vertical' && (
                        <span style={valueStyle}>{status.value}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

// const renderPieChart1 = (linuxOriginData: any, winOriginData: any, hostCount: number, vulnHostCount: number,
//                         title1: string, title2: string, wholeCount: number,
//                         blLinuxHostCount: number,
//                         blWindowsHostCount: number, HoneyPotHostCount: number, TTPsHostCount: number, VirusHostCount: number,
//                         width?: number, height?: number, inner?: number, delta?: number, outter?: number,
// ) => {
//     if (linuxOriginData !== undefined && winOriginData !== undefined) {
//         // 确保OriginData总是作为数组处理
//         const originDataArray1 = Array.isArray(linuxOriginData) ? linuxOriginData : [linuxOriginData];
//         const needAdjItems1 = originDataArray1.filter(item => item.adjustment_requirement === '建议调整');
//
//         const originDataArray2 = Array.isArray(winOriginData) ? winOriginData : [winOriginData];
//         const needAdjItems2 = originDataArray2.filter(item => item.adjustment_requirement === '建议调整');
//         // 确保needAdjItems不为空再访问它的属性
//         if (needAdjItems1.length > 0 || needAdjItems2.length > 0) {
//             // 使用reduce和findIndex方法统计唯一uuid个数
//             const uniqueUuidCount1 = needAdjItems1.reduce((acc, current) => {
//                 // 查找在累积数组中uuid是否已存在
//                 const index = acc.findIndex((item: { uuid: string; }) => item.uuid === current.uuid);
//                 // 如果不存在，则添加到累积数组中
//                 if (index === -1) {
//                     acc.push(current);
//                 }
//                 return acc;
//             }, []).length; // 最后返回累积数组的长度，即为唯一uuid的数量
//             const uniqueUuidCount2 = needAdjItems2.reduce((acc, current) => {
//                 // 查找在累积数组中uuid是否已存在
//                 const index = acc.findIndex((item: { uuid: string; }) => item.uuid === current.uuid);
//                 // 如果不存在，则添加到累积数组中
//                 if (index === -1) {
//                     acc.push(current);
//                 }
//                 return acc;
//             }, []).length; // 最后返回累积数组的长度，即为唯一uuid的数量
//
//             const noAlertHostCount = hostCount - HoneyPotHostCount - TTPsHostCount;
//             // 第二类告警的数据集，'#FEC746','#846CCE','#468DFF',
//             const alertHostPieChartData = [
//                 { label: '无告警主机', value: noAlertHostCount || 0, color: '#E5E8EF' },
//                 { label: '蜜罐告警', value: HoneyPotHostCount || 0, color: '#FFBB28' },
//                 { label: 'TTPs告警', value: TTPsHostCount || 0, color: '#FFBB28' },
//                 // { label: '病毒扫描告警', value: VirusHostCount || 0, color: '#846CCE' },
//             ];
//             const vulAlertData = [
//                 { label: '无漏洞风险主机', value: hostCount - vulnHostCount, color: '#E5E8EF' },//GREY
//                 { label: '存在漏洞主机', value: vulnHostCount, color: '#EA635F' },//RED
//             ];
//             const baselinePieChartData: StatusItem[] = [
//                 // 确保使用正确的方法来计数
//                 {
//                     label: '无基线风险主机',
//                     value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2),
//                     color: '#E5E8EF',
//                 },//GREY
//                 {
//                     label: '存在高危基线主机',
//                     value: uniqueUuidCount1 + uniqueUuidCount2,
//                     color: '#4086FF',
//                 },//BLUE
//             ];
//
//             const riskStatusPanelData: StatusItem[] = [
//                 { color: '#E5E8EF', label: '主机数量 ', value: hostCount },
//                 {
//                     color: '#FBB12E',
//                     label: '存在告警的主机 ',
//                     value: HoneyPotHostCount + TTPsHostCount,
//                 },
//                 { color: '#EA635F', label: '存在漏洞的主机 ', value: vulnHostCount },
//                 {
//                     color: '#4086FF',
//                     label: '存在高危基线的主机 ',
//                     value: uniqueUuidCount1 + uniqueUuidCount2,
//                 },
//             ];
//
//
//             return (
//                 <Row gutter={0}>
//                     <Col span={5}>
//                         <CustomPieChart
//                             data={alertHostPieChartData}
//                             innerRadius={54}
//                             deltaRadius={8}
//                             outerRadius={80}
//                             cardWidth={200}
//                             cardHeight={200}
//                             hasDynamicEffect={true}
//                             title={'告警'}
//                         />
//                     </Col>
//                     <Col span={5}>
//                         <CustomPieChart
//                             data={vulAlertData}
//                             innerRadius={54}
//                             deltaRadius={8}
//                             outerRadius={80}
//                             cardHeight={200}
//                             cardWidth={200}
//                             hasDynamicEffect={true}
//                             title={'存在漏洞'}
//                         />
//                     </Col>
//                     <Col span={5}>
//                         <CustomPieChart
//                             data={baselinePieChartData}
//                             innerRadius={54}
//                             deltaRadius={8}
//                             outerRadius={80}
//                             cardHeight={200}
//                             cardWidth={200}
//                             hasDynamicEffect={true}
//                             title={'基线风险'}
//                         />
//                         {/*{renderBLPieChart(linuxOriginData, winOriginData, '无基线风险主机', '存在高危基线主机', blLinuxHostCount + blWindowsHostCount)}*/}
//                     </Col>
//                     <Col span={2}> </Col>
//                     <Col span={6}>
//                         <div style={{ transform: 'translateY(40px)' }}>
//                             <StatusPanel statusData={riskStatusPanelData} orientation="vertical" />
//                         </div>
//                     </Col>
//                 </Row>
//             );
//         }
//     }
//
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <LoadingOutlined style={{ fontSize: '3em' }} />
//         </div>
//     );
// };
const renderPieChart = (
    linuxOriginData: any,
    winOriginData: any,
    hostCount: number,
    vulnHostCount: number,
    title1: string,
    title2: string,
    wholeCount: number,
    blLinuxHostCount: number,
    blWindowsHostCount: number,
    HoneyPotHostCount: number,
    TTPsHostCount: number,
    VirusHostCount: number,
    width?: number,
    height?: number,
    inner?: number,
    delta?: number,
    outter?: number,
) => {
    // Ensure originDataArray is always an array
    const originDataArray1 = linuxOriginData ? (Array.isArray(linuxOriginData) ? linuxOriginData : [linuxOriginData]) : [];
    const originDataArray2 = winOriginData ? (Array.isArray(winOriginData) ? winOriginData : [winOriginData]) : [];

    const needAdjItems1 = originDataArray1.filter(item => item.adjustment_requirement === '建议调整');
    const needAdjItems2 = originDataArray2.filter(item => item.adjustment_requirement === '建议调整');

    // Use reduce and findIndex to count unique UUIDs
    const uniqueUuidCount = (items: any[]) => items.reduce((acc, current) => {
        if (!acc.some((item: { uuid: any; }) => item.uuid === current.uuid)) {
            acc.push(current);
        }
        return acc;
    }, []).length;

    const uniqueUuidCount1 = uniqueUuidCount(needAdjItems1);
    const uniqueUuidCount2 = uniqueUuidCount(needAdjItems2);

    const noAlertHostCount = hostCount - HoneyPotHostCount - TTPsHostCount;

    // Define pie chart data arrays
    const alertHostPieChartData = [
        { label: '无告警主机', value: noAlertHostCount || 0, color: '#E5E8EF' },
        { label: '蜜罐告警', value: HoneyPotHostCount || 0, color: '#FFBB28' },
        { label: 'TTPs告警', value: TTPsHostCount || 0, color: '#FFBB28' },
    ];

    const vulAlertData = [
        { label: '无漏洞风险主机', value: hostCount - vulnHostCount, color: '#E5E8EF' },
        { label: '存在漏洞主机', value: vulnHostCount, color: '#EA635F' },
    ];

    const baselinePieChartData = [
        {
            label: '无基线风险主机',
            value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2),
            color: '#E5E8EF',
        },
        {
            label: '存在高危基线主机',
            value: uniqueUuidCount1 + uniqueUuidCount2,
            color: '#4086FF',
        },
    ];

    const riskStatusPanelData = [
        { color: '#E5E8EF', label: '主机数量 ', value: hostCount },
        { color: '#FBB12E', label: '存在告警的主机 ', value: HoneyPotHostCount + TTPsHostCount },
        { color: '#EA635F', label: '存在漏洞的主机 ', value: vulnHostCount },
        { color: '#4086FF', label: '存在高危基线的主机 ', value: uniqueUuidCount1 + uniqueUuidCount2 },
    ];

    if (needAdjItems1.length > 0 || needAdjItems2.length > 0) {
        return (
            <Row gutter={0}>
                <Col span={5}>
                    <CustomPieChart
                        data={alertHostPieChartData}
                        innerRadius={54}
                        deltaRadius={8}
                        outerRadius={80}
                        cardWidth={200}
                        cardHeight={200}
                        hasDynamicEffect={true}
                        title={'告警'}
                    />
                </Col>
                <Col span={5}>
                    <CustomPieChart
                        data={vulAlertData}
                        innerRadius={54}
                        deltaRadius={8}
                        outerRadius={80}
                        cardHeight={200}
                        cardWidth={200}
                        hasDynamicEffect={true}
                        title={'存在漏洞'}
                    />
                </Col>
                <Col span={5}>
                    <CustomPieChart
                        data={baselinePieChartData}
                        innerRadius={54}
                        deltaRadius={8}
                        outerRadius={80}
                        cardHeight={200}
                        cardWidth={200}
                        hasDynamicEffect={true}
                        title={'基线风险'}
                    />
                </Col>
                <Col span={2}> </Col>
                <Col span={6}>
                    <div style={{ transform: 'translateY(40px)' }}>
                        <StatusPanel statusData={riskStatusPanelData} orientation="vertical" />
                    </div>
                </Col>
            </Row>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingOutlined style={{ fontSize: '3em' }} />
        </div>
    );
};

class HostInventory extends React.Component<HostInventoryProps, HostInventoryState> {
    constructor(props: any) {
        super(props);
        this.state = {
            taskKey: '',
            runningStatusData: [],
            riskData: [],
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            fullDataSource: [], // 存储完整的数据源副本
            hostinventoryColumns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    width: '15px', // 修正 Maxwidth 为 width
                    // render:(text:string)=>(
                    //     <Button className="custom-button">{text}</Button>
                    // ),
                },
                {
                    title: '主机名',
                    dataIndex: 'uuid',
                    key: 'uuid',
                    render: (text: string, record: hostinventoryColumnsType) => (
                        <div>
                            <div>
                                <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid || 'defaultUUID')}`}
                                      target="_blank">
                                    <Button style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#4086FF',
                                        padding: '0 0',
                                    }}>
                                        <Tooltip title={record.uuid || 'Unknown UUID'}>
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
                {
                    title: '操作系统',
                    dataIndex: 'os_version',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    onFilter: (value: string | number | boolean, record: hostinventoryColumnsType) => record.status == value,
                    filters: [
                        {
                            text: 'Online',
                            value: '1',
                        },
                        {
                            text: 'Offline',
                            value: '0',
                        },
                    ],
                    render: (text: string, record: hostinventoryColumnsType) => (
                        <Badge status={record.status === '1' ? 'success' : 'error'}
                               text={record.status === '1' ? 'Online' : 'Offline'} />
                    ),
                },
                {
                    title: 'CPU使用率',
                    dataIndex: 'cpu_use',
                    render: (text: string, record: any) => (
                        <div style={{
                            fontSize: 'small', // 字体更小
                        }}>
                <span style={{
                    border: '2px solid #f0f0f0',
                    fontWeight: 'bold',
                    padding: '2px 4px', // 轻微内边距
                    borderRadius: '2px', // 圆角边框
                }}>CPU</span> {record.cpu_use + '%'}
                        </div>
                    ),
                    sorter: (a: any, b: any) => parseFloat(b.cpu_use) - parseFloat(a.cpu_use),
                    //sorter: (a: hostinventoryColumnsType, b: hostinventoryColumnsType) => extractNumberFromPercentString(a.cpu_use) - extractNumberFromPercentString(b.cpu_use),
                },
                {
                    title: '内存使用量',
                    dataIndex: 'mem_use',
                    render: (text: string, record: any) => (
                        <div style={{
                            fontSize: 'small', // 字体更小
                        }}>
                <span style={{
                    border: '2px solid #f0f0f0',
                    fontWeight: 'bold',
                    padding: '2px 4px', // 轻微内边距
                    borderRadius: '2px', // 圆角边框
                }}>内存</span> {record.mem_use + '%'}
                        </div>
                    ),
                    sorter: (a: any, b: any) => parseFloat(b.mem_use) - parseFloat(a.mem_use),
                },
                {
                    title: '扫描时间',
                    dataIndex: 'last_seen',
                    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
                    sorter: (a: any, b: any) => parseFloat(b.last_seen) - parseFloat(a.last_seen),
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (text: string, record: any) => (
                        <Dropdown overlay={this.renderTaskMenu()} trigger={['click']}>
                            <Button
                                style={{
                                    fontWeight: 'bold',
                                    padding: '0 0',
                                    border: 'transparent',
                                    backgroundColor: 'transparent',
                                }}
                                disabled={record.status !== 'Online'}
                            >
                                下发任务
                            </Button>
                        </Dropdown>
                    ),
                },
            ],
        };
    }

    // 处理任务菜单点击事件
    handleMenuClick = (e: any) => {
        this.setState({ taskKey: e.key });
    };

    renderTaskMenu() {
        return (
            <Menu onClick={this.handleMenuClick}
                  selectedKeys={[this.state.taskKey]}>
                <Menu.Item key="scheduled">
                    <Link to="/app/create_agent_task" target="_blank">
                        <Button
                            style={{
                                fontWeight: 'bold',
                                padding: '0 0',
                                border: 'transparent',
                                backgroundColor: 'transparent',
                            }}
                        >
                            定时任务
                        </Button>
                    </Link>
                </Menu.Item>
                <Menu.Item key="instant">
                    <Button
                        style={{
                            fontWeight: 'bold',
                            padding: '0 0',
                            border: 'transparent',
                            backgroundColor: 'transparent',
                        }}
                        onClick={() => this.props.history.push('/app/Management/InstantTask')}
                    >
                        即时任务
                    </Button>
                </Menu.Item>
            </Menu>
        );
    }

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
                        agentOriginData,
                        linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                        blLinuxHostCount,
                        blWindowsHostCount,
                        vulnHostCount, hostCount,
                        HoneyPotHostCount, TTPsHostCount,
                    } = context;
                    const uniqueUUIDs_1 = new Set();
                    const uniqueUUIDs_2 = new Set();
                    agentOriginData.forEach(item => {
                        if (item.status === '1') {
                            uniqueUUIDs_1.add(item.uuid);
                        } else {
                            uniqueUUIDs_2.add(item.uuid);
                        }
                    });
                    const hostOnlineCount = uniqueUUIDs_1.size;
                    const hostOfflineCount = uniqueUUIDs_2.size;
                    // const hostOnlineCount = agentMetaData_status.typeCount.get('1') || 0;
                    // const hostOfflineCount = agentMetaData_uuid.tupleCount-hostOnlineCount;
                    //StatusLabel数据
                    const runningStatusData: StatusItem[] = [
                        { color: '#22BC44', label: '运行中 ', value: Number(hostOnlineCount) },
                        { color: '#EA635F', label: '离线 ', value: Number(hostOfflineCount) },
                        // { color: '#FBB12E', label: '运行异常 ', value: 2 },
                        // { color: '#E5E8EF', label: '未安装 ', value: 1 },
                    ];

                    return (
                        <div style={{ fontFamily: '宋体, sans-serif', fontWeight: 'bold' }}>
                            <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '10px' }}>
                                <Col span={8}>
                                    <Card bordered={false} style={{ fontWeight: 'bolder', width: '100%', height: 300 }}>
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
                                            }}>主机状态分布</h2>
                                        </div>
                                        <Row gutter={0}>
                                            <Col span={12}>
                                                <CustomPieChart
                                                    data={runningStatusData}
                                                    innerRadius={54}
                                                    deltaRadius={8}
                                                    outerRadius={80}
                                                    cardWidth={200}
                                                    cardHeight={200}
                                                    hasDynamicEffect={true}
                                                />
                                            </Col>
                                            <Col span={2}>
                                            </Col>
                                            <div style={{ transform: 'translateX(40px) translateY(60px)' }}>
                                                <StatusPanel statusData={runningStatusData} orientation="vertical" />
                                            </div>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={16} style={{ margin: '2 2' }}>
                                    <Card bordered={false} style={{ fontWeight: 'bolder', width: '100%', height: 300 }}>
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
                                            }}>主机风险分布</h2>
                                        </div>
                                        {renderPieChart(linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                                            hostCount, vulnHostCount,
                                            '无风险主机', '存在高危基线主机', blLinuxHostCount + blWindowsHostCount,
                                            blLinuxHostCount, blWindowsHostCount, HoneyPotHostCount, TTPsHostCount, 0)}
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '0px' }}>
                                <Col md={24}>
                                    {constRenderTable(agentOriginData, '主机内容', [],
                                        this.state.hostinventoryColumns, 'hostinventory', Agent_Data_API,
                                        ['uuid', 'os_version'])}
                                </Col>
                            </Row>
                            {/* <MetaDataDisplay
                              metadata={agentMetaData_status}
                              /> */}
                        </div>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}

export default withRouter(HostInventory);
