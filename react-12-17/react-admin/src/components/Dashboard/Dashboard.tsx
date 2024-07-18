import React from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import { StatusItem } from '../Columns';
import { GithubOutlined, GlobalOutlined, LoadingOutlined, MailOutlined, RightOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import {
    AreaChart, Area, XAxis,
    Legend, Tooltip, ResponsiveContainer,
} from 'recharts';
import DataCard from '../CustomAntd/DataCard';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import DisplaySettingsGuide from './DisplaySettingsGuide';
import { cveData } from '../ContextAPI/DataService';


interface ProgressPanelProps {
    labels: string[];
    values: number[];
    colors: string[];
    max?: number;
}

interface DashboardProps extends RouteComponentProps {
    host_number: number;
    host_in_alert: number;
    host_with_vul: number;
    host_with_baselineRisk: number;

    agent_number: number;
    agent_online_number: number;

    open_port_number: number;
    service_number: number;
    RASP_number: number;
    alert_undone: number[];//长度为1+x，总的待处理的告警数量+各个等级的待处理告警数量
    vulnerability_number: number[];
    baseliineDetect_number: number[];
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({ labels, values, colors, max }) => {
    const maxValue = max || Math.max(...values);

    return (
        <div>
            {labels.map((label, index) => {
                const value = values[index];
                const percentage = (value / maxValue) * 100;
                const color = colors[index] || 'red'; // 默认颜色为红色，如果没有指定颜色

                return (
                    <div key={index} style={{ marginBottom: '40px' }}> {/* 增加行与行之间的距离 */}
                        {/* Label with sequence number and YouYuan font */}
                        <div style={{
                            // fontFamily: 'YouYuan',
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            marginBottom: '10px' }}>
                            {`${label}`} {/* 添加序号 {`${index + 1}. ${label}`}*/}
                        </div>
                        {/* Progress bar in a separate row */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <div style={{
                                flexGrow: 1,
                                marginRight: '10px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                overflow: 'hidden',
                            }}>
                                <div style={{ height: '10px', width: `${percentage}%`, backgroundColor: color }}></div>
                            </div>
                            <span>{value}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// const renderBLPieChart = (linuxOriginData: any, winOriginData: any,
//                           title1: string, title2: string, wholeCount: number,
//                           width?: number, height?: number, inner?: number, delta?: number, outter?: number) => {
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
//             const baselineAlertData: StatusItem[] = [
//                 // 确保使用正确的方法来计数
//                 { label: title1, value: uniqueUuidCount1 + uniqueUuidCount2, color: '#E5E8EF' },//GREY
//                 { label: title2, value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2), color: '#4086FF' },//BLUE
//             ];
//             return (
//                 <CustomPieChart
//                     data={baselineAlertData}
//                     title={'基线'}
//                     innerRadius={34}
//                     deltaRadius={5}
//                     outerRadius={50}
//                     cardHeight={150}
//                     hasDynamicEffect={true}
//                 />
//             );
//         }
//     }
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <LoadingOutlined style={{ fontSize: '3em' }} />
//         </div>
//     );
// };
const renderBLPieChart = (linuxOriginData: any, winOriginData: any,
                          title1: string, title2: string, wholeCount: number,
                          width: number = 200, height: number = 200, inner: number = 34, delta: number = 5, outer: number = 50) => {
    const defaultAlertData: StatusItem[] = [
        { label: title1, value: 0, color: '#E5E8EF' },
        { label: title2, value: wholeCount, color: '#4086FF' },
    ];

    if (linuxOriginData !== undefined && winOriginData !== undefined) {
        // 确保OriginData总是作为数组处理
        const originDataArray1 = Array.isArray(linuxOriginData) ? linuxOriginData : [linuxOriginData];
        const needAdjItems1 = originDataArray1.filter(item => item.adjustment_requirement === '建议调整');

        const originDataArray2 = Array.isArray(winOriginData) ? winOriginData : [winOriginData];
        const needAdjItems2 = originDataArray2.filter(item => item.adjustment_requirement === '建议调整');

        // 确保needAdjItems不为空再访问它的属性
        if (needAdjItems1.length > 0 || needAdjItems2.length > 0) {
            // 使用reduce和findIndex方法统计唯一uuid个数
            const uniqueUuidCount1 = needAdjItems1.reduce((acc, current) => {
                // 查找在累积数组中uuid是否已存在
                const index = acc.findIndex((item: { uuid: string; }) => item.uuid === current.uuid);
                // 如果不存在，则添加到累积数组中
                if (index === -1) {
                    acc.push(current);
                }
                return acc;
            }, []).length; // 最后返回累积数组的长度，即为唯一uuid的数量

            const uniqueUuidCount2 = needAdjItems2.reduce((acc, current) => {
                // 查找在累积数组中uuid是否已存在
                const index = acc.findIndex((item: { uuid: string; }) => item.uuid === current.uuid);
                // 如果不存在，则添加到累积数组中
                if (index === -1) {
                    acc.push(current);
                }
                return acc;
            }, []).length; // 最后返回累积数组的长度，即为唯一uuid的数量

            const baselineAlertData: StatusItem[] = [
                { label: title1, value: uniqueUuidCount1 + uniqueUuidCount2, color: '#E5E8EF' }, // GREY
                { label: title2, value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2), color: '#4086FF' }, // BLUE
            ];

            return (
                <CustomPieChart
                    data={baselineAlertData}
                    title={'基线'}
                    innerRadius={inner}
                    deltaRadius={delta}
                    outerRadius={outer}
                    cardHeight={height}
                    cardWidth={width}
                    hasDynamicEffect={true}
                />
            );
        }
    }

    return (
        <CustomPieChart
            data={defaultAlertData}
            title={'基线'}
            innerRadius={inner}
            deltaRadius={delta}
            outerRadius={outer}
            cardHeight={height}
            cardWidth={width}
            hasDynamicEffect={true}
        />
    );
};

class Dashboard extends React.Component<DashboardProps> {


    renderVulDataCard = (OriginData: any[],last7totalVulsum:number) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            let highRiskCount = 0;
            let mediumRiskCount = 0;
            let lowRiskCount = 0;
            let totalExpResultCount = 0;
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            originDataArray.forEach(item => {
                totalExpResultCount += item.vul_detection_exp_result.length;
            });
            const getRiskLevel = (bugExp: any) => {
                if (cveData[bugExp]) {
                    return cveData[bugExp].risk_level;
                }
                return 'low'; // 默认风险等级为低
            };
            // 从 localStorage 中读取被忽略的项
            const ignoredBugExps_array = JSON.parse(localStorage.getItem('ignoredBugExps_array') || '{}');
            // OriginData.forEach(record => {
            //     record.vul_detection_exp_result.forEach((exp: { bug_exp: any; }) => {
            //         // 检查是否该项被忽略
            //         const ignoredBugExps = ignoredBugExps_array[record.uuid] || [];
            //         if (ignoredBugExps.includes(exp.bug_exp)) {
            //             return; // 如果被忽略，跳过计数
            //         }
            //
            //         const riskLevel = getRiskLevel(exp.bug_exp);
            //         if (riskLevel === 'high') {
            //             highRiskCount++;
            //         } else if (riskLevel === 'medium') {
            //             mediumRiskCount++;
            //         } else if (riskLevel === 'low') {
            //             lowRiskCount++;
            //         }
            //     });
            // });
            const currentTime = new Date().getTime(); // 当前时间的时间戳
            const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 七天的时间戳毫秒数

            OriginData.forEach(record => {
                record.vul_detection_exp_result.forEach((exp: { bug_exp: any, scanTime: any }) => {
                    // 检查是否该项被忽略
                    const ignoredBugExps = ignoredBugExps_array[record.uuid] || [];
                    if (ignoredBugExps.includes(exp.bug_exp)) {
                        return; // 如果被忽略，跳过计数
                    }

                    // 计算数据的时间戳
                    const expScanTime = new Date(exp.scanTime * 1000).getTime();
                    if ((currentTime - expScanTime) > sevenDaysInMillis) {
                        return; // 如果数据不在七天以内，跳过计数
                    }

                    const riskLevel = getRiskLevel(exp.bug_exp);
                    if (riskLevel === 'high') {
                        highRiskCount++;
                    } else if (riskLevel === 'medium') {
                        mediumRiskCount++;
                    } else if (riskLevel === 'low') {
                        lowRiskCount++;
                    }
                });
            });
            return (
                <div>
                    <DataCard
                        title="待处理漏洞"
                        value={last7totalVulsum}
                        valueItem={[
                            { value: highRiskCount, backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                            { value: mediumRiskCount, backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                            { value: lowRiskCount, backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                            // { value: '0', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                        ]}
                        panelId="/app/RiskManagement/VulnerabilityList"
                        height="75px"
                        width={"220px"}
                        backgroundColor="#ffffff"
                        navigate={true}
                        showTopBorder={false}
                        showBottomBorder={false}
                        showLeftBorder={false}
                        showRightBorder={false}
                    />
                </div>
            );
        } else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Card bordered={true}
                          style={{ backgroundColor: '#ffffff', width: '100%' }}>
                        <LoadingOutlined style={{ fontSize: '3em' }} />
                    </Card>
                </div>);
        }
    };

    render() {
        const generateAlertData = (alertsCount: number[]): { day: string; value: string }[] => {
            const alertData: { day: string; value: string }[] = [];
            // const formatDay = (date: Date): string => {
            //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            // };

            for (let i = 0; i < alertsCount.length; i++) {
                // 生成过去第i天的日期
                const date = new Date();
                date.setDate(date.getDate() - (alertsCount.length - i));

                // 格式化日期并创建所需的数据对象
                alertData.push({
                    day: `${date.getMonth() + 1}-${date.getDate() + 1}`,//formatDay(date),
                    value: alertsCount[i].toString(),
                });
            }

            return alertData;
        };


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
                        HoneyPotHostCount,
                        bruteforceTTPsOriginData, privilegeescalationTTPsOriginData, defenseavoidanceTTPsOriginData,
                        TTPsHostCount,
                        virusOriginData,
                        last7defenceForceValue,last7brutForceValue,last7privValue,
                        last7VirusValue,last7HoneyPotValue,

                        processMetaData_userName,

                        agentOriginData,
                        portMetaData_port_state,
                        assetMetaData_service,
                        vulnHostCount, hostCount,
                        vulnOriginData,
                        last7VulValue,
                        linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                        blLinuxHostCount,
                        blWindowsHostCount,
                        blLinuxNeedAdjustmentItemCount,
                        blWindowsNeedAdjustmentItemCount,
                        blLinuxNeedAdjustmentItemCount_pass, blWindowsNeedAdjustmentItemCount_pass,

                        agentAVGCPUUse, agentAVGMEMUse,
                    } = context;
                    const uniqueUUIDs_1 = new Set();
                    const uniqueUUIDs_2 = new Set();
                    agentOriginData.forEach(item => {
                        if (item.status === "1") {
                            uniqueUUIDs_1.add(item.uuid);
                        }
                        else{
                            uniqueUUIDs_2.add(item.uuid)
                        }
                    });
                    const agentOnlineCount = uniqueUUIDs_1.size;
                    const hostOfflineCount = uniqueUUIDs_2.size;


                    // console.log('过去7日漏洞风险:'+last7VulValue);
                    const vulAlertData = generateAlertData(last7VulValue);
                    // 转换value为DataItem类型
                    const vulProcessedData = vulAlertData.map(item => ({ ...item, Vulnerability: Number(item.value) }));

                    const last7totalVulSum = last7VulValue.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0

                    const bruteforceTTPsCount = Array.isArray(bruteforceTTPsOriginData) ? bruteforceTTPsOriginData.flat().length : 0;
                    const privilegeescalationTTPsCount = Array.isArray(privilegeescalationTTPsOriginData) ? privilegeescalationTTPsOriginData.flat().length : 0;
                    const defenseavoidanceTTPsCount = Array.isArray(defenseavoidanceTTPsOriginData) ? defenseavoidanceTTPsOriginData.flat().length : 0;

                    const ttpsClassData: StatusItem[] = [
                        { color: '#846CCE', label: '暴力破解捕获 ', value: bruteforceTTPsCount },
                        { color: '#FEC746', label: '权限提升捕获 ', value: privilegeescalationTTPsCount },
                        { color: '#468DFF', label: '防御规避捕获 ', value: defenseavoidanceTTPsCount },
                        // { color: '#FBB12E', label: '运行异常 ', value: 2 },
                        // { color: '#E5E8EF', label: '未安装 ', value: 1 },
                    ];
                                        // 假设 last7brutForceValue, last7privValue, last7defenceForceValue 都是等长的数组
                    const summedValues = last7brutForceValue.map((value, index) => {
                        return value + last7privValue[index] + last7defenceForceValue[index];
                    });
                    const last7brutSum = last7brutForceValue.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0
                    const last7privSum = last7privValue.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0
                    const last7defenceSum = last7defenceForceValue.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0
                    const totalSum = summedValues.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0

                    const ttpsAlertData = generateAlertData(summedValues);
                    // 转换value为DataItem类型
                    const ttpsProcessedData = ttpsAlertData.map(item => ({ ...item, TTPs: Number(item.value) }));

                    const honeypotAlertData = generateAlertData(last7HoneyPotValue);
                    const honeypotProcessedData = honeypotAlertData.map(item => ({ ...item, HoneyPot: Number(item.value) }));

                    const last7totalHoneyPotSum = last7HoneyPotValue.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0

                    const virusAlertData = generateAlertData(last7VirusValue);
                    const virusProcessedData = virusAlertData.map(item => ({ ...item, Virus: Number(item.value) }));

                    const last7totalVirusSum = last7VirusValue.reduce((acc, currentValue) => {
                        return acc + currentValue;
                    }, 0); // 初始化累加器为0

                    // 将三类威胁狩猎数据合并
                    const combinedData = ttpsProcessedData.map((item, index) => {
                        return {
                            day: item.day,  // 确保两个数据集中都有相同的日期格式
                            TTPs: item.TTPs,
                            HoneyPot: honeypotProcessedData[index].HoneyPot,
                            Virus: virusProcessedData[index].Virus,
                        };
                    });
                    const noAlertHostCount =hostCount-HoneyPotHostCount-TTPsHostCount;
                    // 第二类告警的数据集，'#FEC746','#846CCE','#468DFF',
                    const alertHostPieChartData = [
                        { label: '无告警主机', value: noAlertHostCount||0, color: '#E5E8EF' },
                        { label: '蜜罐告警', value: HoneyPotHostCount||0, color: '#FFBB28' },
                        { label: 'TTPs告警', value: TTPsHostCount||0, color: '#468DFF' },
                        // { label: '病毒扫描告警', value: VirusHostCount||0, color: '#846CCE' },
                    ];
                    //漏洞检测
                    const vulAlertPieChartData = [
                        { label: '无漏洞风险主机', value: hostCount - vulnHostCount, color: '#E5E8EF' },//GREY
                        { label: '存在高可利用漏洞主机', value: vulnHostCount, color: '#EA635F' },//RED
                    ];
                    //基线检查，进度条型展示时，使用一个各项值为1的panel
                    const baselineLineChartLabelUseData: StatusItem[] = [
                        { color: '#faad14', label: '建议调整 ', value: 1 },//蓝色E53F3F
                        { color: '#52c41a', label: '自行判断 ', value: 1 },
                        // { color: '#468DFF', label: '低风险 ', value: 2 },
                    ];
                    const labels = ['Windows主机基线检查建议调整项', 'Linux主机基线检查建议调整项', '基线检查通过项'];
                    const values = [blWindowsNeedAdjustmentItemCount || 0, blLinuxNeedAdjustmentItemCount || 0, blLinuxNeedAdjustmentItemCount_pass + blWindowsNeedAdjustmentItemCount_pass];
                    const colors = ['#faad14', '#faad14', '#52c41a']; // 指定每个进度条的颜色,弃用的绿色'#52c41a'，红ff4d4f

                    return (
                        <div>
                            <div>
                                <DisplaySettingsGuide />
                                {/* 你现有的 Dashboard 内容 */}
                            </div>
                            <Row gutter={[12, 6]}>
                                <Col md={17}>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        <Col md={24}>
                                            <Card bordered={false}
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 200 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '19px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>资产概览</h2>
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col md={4}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '150px',
                                                                minWidth: '50px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col span={24}>
                                                                    <Statistic title={<span
                                                                        style={{ fontSize: '18px' }}>主机</span>}
                                                                               value={hostCount} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col md={1} />
                                                    <Col md={4}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '150px',
                                                                minWidth: '50px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col span={24}>
                                                                    <Statistic title={<span
                                                                        style={{ fontSize: '18px' }}>开放端口</span>}
                                                                               value={portMetaData_port_state.typeCount.get('open')} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col md={1} />
                                                    <Col md={4}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '150px',
                                                                minWidth: '50px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col span={24}>
                                                                    <Statistic title={<span
                                                                        style={{ fontSize: '18px' }}>系统服务</span>}
                                                                               value={assetMetaData_service.tupleCount} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col md={1} />
                                                    <Col md={4}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '150px',
                                                                minWidth: '50px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Col span={24}>
                                                                <Statistic title={<span
                                                                    style={{ fontSize: '18px' }}>运行进程</span>}
                                                                           value={processMetaData_userName.typeCount.size} />
                                                            </Col>

                                                        </Card>
                                                    </Col>
                                                    <Col md={1} />
                                                    <Col md={4}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '150px',
                                                                minWidth: '50px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Col span={24}>
                                                                <Statistic title={<span
                                                                    style={{ fontSize: '18px' }}>系统用户</span>}
                                                                           value={processMetaData_userName.tupleCount} />
                                                            </Col>

                                                        </Card>
                                                    </Col>

                                                </Row>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        <Col md={24}>
                                            <Card bordered={false}
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 350 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '19px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>主机告警</h2>
                                                    <h2 style={{
                                                        fontSize: '15px', color: 'grey',
                                                        marginLeft: '0px',
                                                        marginRight: 'auto',
                                                        marginTop: '5px',
                                                    }}>(近7日)</h2>
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col span={18}>
                                                        <div style={{
                                                            // borderTop: '2px solid #E5E6EB',
                                                            borderBottom: '1px solid #E5E6EB',
                                                            // borderLeft: '2px solid #E5E6EB',line shape="circle"
                                                            borderRight: '3px solid #E5E6EB',
                                                        }}>
                                                            <ResponsiveContainer width="98%" height={250}>
                                                                <AreaChart data={combinedData} margin={{
                                                                    top: 10,
                                                                    right: 30,
                                                                    left: 0,
                                                                    bottom: 0,
                                                                }}
                                                                >
                                                                    {/*<CartesianGrid strokeDasharray="3 3" />*/}
                                                                    <XAxis dataKey="day" hide={true} />
                                                                    {/* <YAxis /> */}
                                                                    <Tooltip />
                                                                    <Legend align="left" verticalAlign="top"
                                                                            wrapperStyle={{ left: 0, top: 0 }} />
                                                                    <Area
                                                                        fillOpacity={0.5}
                                                                        stroke="#4086FF" // 设置线条颜色为#4086FF
                                                                        strokeWidth={2} // 设置线条厚度为3px
                                                                        fill="#F1F8FE" // 设置填充颜色为#4086FF
                                                                        type="monotone"
                                                                        dataKey="TTPs"
                                                                    />
                                                                    <Area
                                                                        fillOpacity={0.5}
                                                                        stroke="green"
                                                                        strokeWidth={2} // 设置线条厚度为3px
                                                                        fill="#F1F8FE" // 设置填充颜色为#4086FF
                                                                        type="monotone"
                                                                        dataKey="HoneyPot"
                                                                    />
                                                                    <Area
                                                                        fillOpacity={0.5}
                                                                        stroke="red"
                                                                        strokeWidth={2} // 设置线条厚度为3px
                                                                        fill="#F1F8FE" // 设置填充颜色为#4086FF
                                                                        type="monotone"
                                                                        dataKey="Virus"
                                                                    />
                                                                </AreaChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </Col>
                                                    <Col span={6}>
                                                        <DataCard
                                                            title="TTPs告警"
                                                            value={totalSum}
                                                            valueItem={[
                                                                {
                                                                    value: last7brutSum,
                                                                    backgroundColor: '#846CCE',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: last7privSum,
                                                                    backgroundColor: '#FEC746',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: last7defenceSum,
                                                                    backgroundColor: '#468DFF',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '-',
                                                                    backgroundColor: '#fff',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                            ]}
                                                            panelId="/app/threat-hunting"
                                                            height="75px"
                                                            width={"220px"}
                                                            backgroundColor="#ffffff"
                                                            navigate={true}
                                                            showTopBorder={false}
                                                            showBottomBorder={false}
                                                            showLeftBorder={false}
                                                            showRightBorder={false}
                                                        />
                                                        <DataCard
                                                            title="病毒扫描告警"
                                                            value={last7totalVirusSum}
                                                            valueItem={[
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#E53F3F',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#846CCE',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#FEC746',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#fff',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                            ]}
                                                            panelId="/app/VirusScanning/VirusScanning"
                                                            height="75px"
                                                            width={"220px"}
                                                            backgroundColor="#ffffff"
                                                            navigate={true}
                                                            showTopBorder={false}
                                                            showBottomBorder={false}
                                                            showLeftBorder={false}
                                                            showRightBorder={false}
                                                        />
                                                        <DataCard
                                                            title="蜜罐防御告警"
                                                            value={last7totalHoneyPotSum}
                                                            valueItem={[
                                                                {
                                                                    value: 0,
                                                                    backgroundColor: '#fff',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#fff',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#fff',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                                {
                                                                    value: '0',
                                                                    backgroundColor: '#fff',
                                                                    fontSize: '14px',
                                                                    color: 'white',
                                                                },
                                                            ]}
                                                            panelId="/app/RiskManagement/honeypot"
                                                            height="75px"
                                                            width={"220px"}
                                                            backgroundColor="#ffffff"
                                                            navigate={true}
                                                            showTopBorder={false}
                                                            showBottomBorder={false}
                                                            showLeftBorder={false}
                                                            showRightBorder={false}
                                                        />
                                                    </Col>
                                                </Row>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                                        <Col md={24}>

                                            <Card bordered={false}
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 350 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '19px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>漏洞风险</h2>
                                                    <h2 style={{
                                                        fontSize: '15px', color: 'grey',
                                                        marginLeft: '0px',
                                                        marginRight: 'auto',
                                                        marginTop: '5px',
                                                    }}>(近7日)</h2>
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col span={18}>
                                                        <div style={{
                                                            // borderTop: '2px solid #E5E6EB',
                                                            // borderBottom: '2px solid #E5E6EB',
                                                            // borderLeft: '2px solid #E5E6EB',
                                                            borderRight: '3px solid #E5E6EB',
                                                        }}>
                                                            <ResponsiveContainer width="98%" height={250}>
                                                                <AreaChart data={vulProcessedData} margin={{
                                                                    top: 10,
                                                                    right: 30,
                                                                    left: 0,
                                                                    bottom: 0,
                                                                }}>
                                                                    {/*<CartesianGrid strokeDasharray="3 3" />*/}
                                                                    <XAxis dataKey="day" hide={true} />
                                                                    {/* <YAxis /> */}
                                                                    <Tooltip />
                                                                    <Legend align="left" verticalAlign="top"
                                                                            wrapperStyle={{ left: 0, top: 0 }} />
                                                                    <Area
                                                                        fillOpacity={0.5}
                                                                        stroke="#4086FF" // 设置线条颜色为#4086FF
                                                                        strokeWidth={2} // 设置线条厚度为3px
                                                                        fill="#F1F8FE" // 设置填充颜色为#4086FF
                                                                        type="monotone"
                                                                        dataKey="Vulnerability"
                                                                    />
                                                                </AreaChart>
                                                            </ResponsiveContainer>

                                                        </div>
                                                    </Col>
                                                    <Col span={6}>
                                                        {this.renderVulDataCard(vulnOriginData, last7totalVulSum)}
                                                    </Col>
                                                </Row>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        <Col md={24}>
                                            <Card bordered={false}
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 350 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '19px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                        marginBottom: '10px',
                                                    }}>基线风险</h2>
                                                    <StatusPanel statusData={baselineLineChartLabelUseData}
                                                                 orientation="horizontal" />
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col span={24}>
                                                        <ProgressPanel labels={labels}
                                                                       values={values}
                                                                       colors={colors}
                                                        />
                                                    </Col>
                                                </Row>

                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col md={7}>
                                    <Col md={24}>
                                        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                            <Card bordered={false} /*title="OWL 介绍*/
                                                  style={{
                                                      fontWeight: 'bolder',
                                                      width: '100%',
                                                      height: 350,
                                                      backgroundColor: '#ffffff',
                                                  }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontSize: '19px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>OWL Security</h2>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 6,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontSize: '15px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>
                                                        OWL Security是一个云原生的基于主机的安全(入侵检测与风险识别)解决方案
                                                    </h2>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 6,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontSize: '15px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>
                                                        Owl Security is a support cloud-native and base linux host
                                                        security(Intrusion detection and risk identification)solution
                                                    </h2>
                                                </div>
                                                <div style={{ marginBottom: '3px',transform: 'translateY(-8px)' }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: 2,
                                                        marginLeft: 16,
                                                        fontWeight: 'bold',
                                                    }}>
                                                        <p><GithubOutlined /> <a
                                                            style={{ color: '#1964F5' }}
                                                            href="https://github.com"
                                                            target="_blank"
                                                            rel="noopener noreferrer">GitHub</a></p>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: 2,
                                                        marginLeft: 16,
                                                        fontWeight: 'bold',
                                                    }}>
                                                        <p><GlobalOutlined /> <a
                                                            style={{ color: '#1964F5' }}
                                                            href="https://yourwebsite.com" target="_blank"
                                                            rel="noopener noreferrer">Official website</a></p>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: 2,
                                                        marginLeft: 16,
                                                        fontWeight: 'bold',
                                                    }}>
                                                        <p><MailOutlined /> <a
                                                            style={{ color: '#1964F5' }}
                                                            href="mailto:elkeid@bytedance.com">elkeid@bytedance.com</a>
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Row>
                                    </Col>
                                    <Row gutter={[12, 6]} style={{ marginTop: '9px' }}>
                                        <Col md={24}>
                                            <Card bordered={false} /*title="主机风险扇形图" */
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 220 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>主机风险分布</h2>
                                                    <Col pull={0} span={2}
                                                         style={{ position: 'relative', top: '-6px', right: '210px' }}>
                                                        <Button
                                                            type="link"
                                                            style={{
                                                                fontWeight: 'bold',
                                                                border: 'transparent',
                                                                backgroundColor: 'transparent',
                                                                color: '#88878C',
                                                            }}
                                                            icon={<RightOutlined />}
                                                            onClick={() => this.props.history.push('/app/AssetsCenter/HostInventory')}
                                                        />
                                                    </Col>
                                                </div>
                                                <Row style={{ marginTop: '-25px' }} gutter={[6, 6]}>
                                                    <Col span={8}>
                                                        <CustomPieChart
                                                            data={alertHostPieChartData}
                                                            title={'告警'}
                                                            innerRadius={34}
                                                            deltaRadius={5}
                                                            outerRadius={50}
                                                            cardHeight={150}
                                                            hasDynamicEffect={true}
                                                        />
                                                    </Col>
                                                    <Col span={8}>
                                                        <CustomPieChart
                                                            data={vulAlertPieChartData}
                                                            title={'漏洞'}
                                                            innerRadius={34}
                                                            deltaRadius={5}
                                                            outerRadius={50}
                                                            cardHeight={150}
                                                            hasDynamicEffect={true}
                                                        />
                                                    </Col>
                                                    <Col span={8} style={{transform: 'translateX(-45px) translateY(-25px)'}}>
                                                        {renderBLPieChart(linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                                                            '无基线风险主机', '存在高危基线主机', hostCount)}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[12, 6]} style={{ marginTop: '9px' }}>
                                        <Col md={24}>
                                            <Card bordered={false} /*title="Agent 概览*/
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 330 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>Agent概览</h2>
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col span={12}>
                                                        <div style={{ marginBottom: '20px' }}>
                                                            <DataCard
                                                                title="在线 Agent"
                                                                value={agentOnlineCount}
                                                                valueItem={[]}
                                                                panelId=""
                                                                height="100px"
                                                                width="155px"
                                                                backgroundColor="#F6F7FB"
                                                                navigate={false}
                                                                showTopBorder={false}
                                                                showBottomBorder={false}
                                                                showLeftBorder={false}
                                                                showRightBorder={false}
                                                            />
                                                        </div>
                                                        <DataCard
                                                            title="离线 Agent"
                                                            value={hostCount - agentOnlineCount}
                                                            valueItem={[]}
                                                            panelId=""
                                                            height="100px"
                                                            width="155px"
                                                            backgroundColor="#F6F7FB"
                                                            navigate={false}
                                                            showTopBorder={false}
                                                            showBottomBorder={false}
                                                            showLeftBorder={false}
                                                            showRightBorder={false} />
                                                    </Col>
                                                    <Col span={12}>
                                                        <div style={{ marginBottom: '20px' }}>
                                                            <DataCard
                                                                title="CPU AVG"
                                                                value={agentAVGCPUUse}
                                                                valueItem={[]}
                                                                panelId=""
                                                                height="100px"
                                                                width="155px"
                                                                backgroundColor="#F6F7FB"
                                                                navigate={false}
                                                                showTopBorder={false}
                                                                showBottomBorder={false}
                                                                showLeftBorder={false}
                                                                showRightBorder={false} />
                                                        </div>
                                                        <DataCard
                                                            title="Mem AVG"
                                                            value={agentAVGMEMUse}
                                                            valueItem={[]}
                                                            panelId=""
                                                            height="100px"
                                                            width="155px"
                                                            backgroundColor="#F6F7FB"
                                                            navigate={false}
                                                            showTopBorder={false}
                                                            showBottomBorder={false}
                                                            showLeftBorder={false}
                                                            showRightBorder={false} />
                                                    </Col>

                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[12, 6]} style={{ marginTop: '9px' }}>
                                        <Col md={24}>
                                            <Card bordered={false}
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 350 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '19px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>威胁狩猎概览</h2>
                                                </div>
                                                <Row gutter={0}>
                                                    <Col span={12}>
                                                        <div
                                                            style={{ transform: 'translateX(-20px) translateY(20px)' }}>
                                                            <CustomPieChart
                                                                data={ttpsClassData}
                                                                innerRadius={54}
                                                                deltaRadius={8}
                                                                outerRadius={80}
                                                                cardWidth={200}
                                                                cardHeight={200}
                                                                hasDynamicEffect={true}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div style={{ transform: 'translateY(70px)' }}>
                                                            <StatusPanel statusData={ttpsClassData}
                                                                         orientation="vertical" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                {/*<Row gutter={[6, 6]}>*/}
                                                {/*    <Col span={12}>*/}
                                                {/*        <div style={{ marginBottom: '20px' }}>*/}
                                                {/*            <DataCard*/}
                                                {/*                title="服务一"*/}
                                                {/*                value={0}*/}
                                                {/*                valueItem={[]}*/}
                                                {/*                panelId=""*/}
                                                {/*                height="100px"*/}
                                                {/*                width="155px"*/}
                                                {/*                backgroundColor="#F6F7FB"*/}
                                                {/*                navigate={true}*/}
                                                {/*                showTopBorder={false}*/}
                                                {/*                showBottomBorder={false}*/}
                                                {/*                showLeftBorder={false}*/}
                                                {/*                showRightBorder={false} />*/}
                                                {/*        </div>*/}
                                                {/*        <DataCard*/}
                                                {/*            title="服务二"*/}
                                                {/*            value={0}*/}
                                                {/*            valueItem={[]}*/}
                                                {/*            panelId=""*/}
                                                {/*            height="100px"*/}
                                                {/*            width="155px"*/}
                                                {/*            backgroundColor="#F6F7FB"*/}
                                                {/*            navigate={true}*/}
                                                {/*            showTopBorder={false}*/}
                                                {/*            showBottomBorder={false}*/}
                                                {/*            showLeftBorder={false}*/}
                                                {/*            showRightBorder={false} />*/}
                                                {/*    </Col>*/}
                                                {/*    <Col span={12}>*/}
                                                {/*        <div style={{ marginBottom: '20px' }}>*/}
                                                {/*            <DataCard*/}
                                                {/*                title="服务三"*/}
                                                {/*                value={'0%'}*/}
                                                {/*                valueItem={[]}*/}
                                                {/*                panelId=""*/}
                                                {/*                height="100px"*/}
                                                {/*                width="155px"*/}
                                                {/*                backgroundColor="#F6F7FB"*/}
                                                {/*                navigate={true}*/}
                                                {/*                showTopBorder={false}*/}
                                                {/*                showBottomBorder={false}*/}
                                                {/*                showLeftBorder={false}*/}
                                                {/*                showRightBorder={false} />*/}
                                                {/*        </div>*/}
                                                {/*        <DataCard*/}
                                                {/*            title="服务四"*/}
                                                {/*            value={'0B'}*/}
                                                {/*            valueItem={[]}*/}
                                                {/*            panelId=""*/}
                                                {/*            height="100px"*/}
                                                {/*            width="155px"*/}
                                                {/*            backgroundColor="#F6F7FB"*/}
                                                {/*            navigate={true}*/}
                                                {/*            showTopBorder={false}*/}
                                                {/*            showBottomBorder={false}*/}
                                                {/*            showLeftBorder={false}*/}
                                                {/*            showRightBorder={false} />*/}
                                                {/*    </Col>*/}
                                                {/*</Row>*/}
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </div>
                    );

                }}
            </DataContext.Consumer>
        );
    }
}

export default withRouter(Dashboard);