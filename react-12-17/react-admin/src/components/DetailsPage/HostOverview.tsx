import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Button, Badge } from 'antd';
import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import {
    fimColumns,
    openPortsColumns,
    runningProcessesColumns, systemServicesColumns,
    GenericDataItem, StatusItem, monitoredColumns,
} from '../Columns';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import DataDisplayTable from '../OWLTable/DataDisplayTable';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { convertUnixTime } from '../ContextAPI/DataService';
import { Assets_Data_API, Fim_Data_API, Monitor_Data_API, Port_Data_API, Process_Data_API } from '../../service/config';

const { Text } = Typography;


interface HostOverviewProps extends RouteComponentProps {
    // ... other props if there are any
    changePanel: (panelName: string) => void; //切换子panel
}

interface HostOverviewState {
    host_uuid: string;

    filteredData: any[], // 用于存储过滤后的数据
    activeIndex: any;
    dataIsReady: boolean;

}

class HostOverview extends React.Component<HostOverviewProps, HostOverviewState> {
    constructor(props: any) {
        super(props);
        // 创建具有明确类型的 refs
        this.openPortsRef = React.createRef<HTMLDivElement>();
        this.fimRef = React.createRef<HTMLDivElement>();
        this.MonitorRef = React.createRef<HTMLDivElement>();
        this.processRef = React.createRef<HTMLDivElement>();
        this.assetRef = React.createRef<HTMLDivElement>();
        this.state = {
            activeIndex: [-1], //一个扇形图
            filteredData: [], // 用于存储过滤后的数据
            host_uuid: '',
            dataIsReady: false,
        };
    }
    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const host_uuid = queryParams.get('uuid');
        this.setState({
            host_uuid: host_uuid ? host_uuid : 'default',
        });
    }

    openPortsRef: React.RefObject<HTMLDivElement>;
    fimRef: React.RefObject<HTMLDivElement>;
    MonitorRef: React.RefObject<HTMLDivElement>;
    processRef: React.RefObject<HTMLDivElement>;
    assetRef: React.RefObject<HTMLDivElement>;

    //扇形图动态效果实现
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
    handleScrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
        if(sectionRef && sectionRef.current){
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    // 修改后的函数，使其能够导航到对应的子面板
    goToPanel = (panelName: string) => {
        // 更新父组件的状态，changePanel 的函数负责这个逻辑
        this.props.changePanel(panelName);
    };
    renderVulPieChart = (OriginData: any[], title: string, panelDataTitle1: string, panelDataTitle2: string) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            const filteredvulData = originDataArray.filter(Item => Item.uuid === this.state.host_uuid);
            if (!filteredvulData) {
                return <div>没有该主机漏洞的信息</div>;
            }
            let totalExpResultCount = 0;
            filteredvulData.forEach(item => {
                totalExpResultCount += item.vul_detection_exp_result.length;
            });
            const vulPieChartData: StatusItem[] = [
                { color: '#E63F3F', label: panelDataTitle1, value: totalExpResultCount },
                { color: '#468DFF', label: panelDataTitle2, value: 99 },];
            return (
                <div>
                    <Row>
                        <Col span={12}>
                            <CustomPieChart
                                data={vulPieChartData}
                                innerRadius={54}
                                deltaRadius={8}
                                outerRadius={80}
                                cardWidth={200}
                                cardHeight={200}
                                hasDynamicEffect={true}
                            />
                        </Col>
                        <Col span={2}> </Col>
                        <div style={{ transform: 'translateX(40px) translateY(50px)' }}>
                            <StatusPanel statusData={vulPieChartData} orientation="vertical" />
                        </div>
                    </Row>
                </div>
            );
        }
        else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                    <Card bordered={true}
                        style={{ backgroundColor: '#ffffff', width: '100%', }}>
                        <LoadingOutlined style={{ fontSize: '3em' }} />
                    </Card>
                </div>);
        }
    }

    // renderBLPieChart = (linuxOriginData: any, winOriginData: any,
    //     title1: string, title2: string, wholeCount: number,
    //     width?: number, height?: number, inner?: number, delta?: number, outter?: number) => {
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
    //                 { label: title1, value: uniqueUuidCount1 + uniqueUuidCount2, color: '#EA635F' },//RED
    //                 { label: title2, value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2), color: '#468DFF' }//蓝
    //             ];
    //             return (
    //                 <CustomPieChart
    //                     data={baselineAlertData}
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
    //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
    //             <LoadingOutlined style={{ fontSize: '3em' }} />
    //         </div>
    //     );
    // }
    renderPieCharBaseLineChart = (OriginData: any, linux: any, windows: any) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            if (originDataArray.length > 0) {
                const filteredData = originDataArray.find(item => item.uuid === this.state.host_uuid);

                if (!filteredData) {
                    return <div>No data available for this host.</div>;
                }
                if (filteredData.os_version.includes('tu')) {
                    if (linux !== undefined) {
                        // 确保OriginData总是作为数组处理
                        const array = Array.isArray(linux) ? linux : [linux];
                        const linuxData = array.filter(item => item.uuid === this.state.host_uuid);
                        const needAdjItemCounts = linuxData.filter(item => item.adjustment_requirement === '建议调整').length;
                        if (linuxData.length > 0) {
                            const baselineAlertData: StatusItem[] = [
                                // 确保使用正确的方法来计数
                                { label: '建议调整项', value: needAdjItemCounts, color: '#EA635F' },//RED
                                { label: '自行判断项', value: linuxData.length - needAdjItemCounts, color: '#468DFF' }//蓝
                            ];
                            return (
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <CustomPieChart
                                                data={baselineAlertData}
                                                innerRadius={54}
                                                deltaRadius={8}
                                                outerRadius={80}
                                                cardWidth={200}
                                                cardHeight={200}
                                                hasDynamicEffect={true}
                                            />
                                        </Col>
                                        <Col span={2}> </Col>
                                        <div style={{ transform: 'translateX(30px) translateY(50px)' }}>
                                            <StatusPanel statusData={baselineAlertData} orientation="vertical" />
                                        </div>
                                    </Row>
                                </div>
                            );
                        }
                    }
                    else {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>
                        );
                    }
                }
                else {
                    if (windows !== undefined) {
                        // 确保OriginData总是作为数组处理
                        const array = Array.isArray(windows) ? windows : [windows];
                        const linuxData = array.filter(item => item.uuid === this.state.host_uuid);
                        const needAdjItemCounts = linuxData.filter(item => item.adjustment_requirement === '建议调整').length;
                        if (linuxData.length > 0) {
                            const baselineAlertData: StatusItem[] = [
                                // 确保使用正确的方法来计数
                                { label: '建议调整项', value: needAdjItemCounts, color: '#EA635F' },//RED
                                { label: '自行判断项', value: linuxData.length - needAdjItemCounts, color: '#468DFF' }//蓝
                            ];
                            return (
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <CustomPieChart
                                                data={baselineAlertData}
                                                innerRadius={54}
                                                deltaRadius={8}
                                                outerRadius={80}
                                                cardWidth={200}
                                                cardHeight={200}
                                                hasDynamicEffect={true}
                                            />
                                        </Col>
                                        <Col span={2}> </Col>
                                        <div style={{ transform: 'translateX(30px) translateY(50px)' }}>
                                            <StatusPanel statusData={baselineAlertData} orientation="vertical" />
                                        </div>
                                    </Row>
                                </div>
                            );
                        }
                    }
                    else {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>
                        );
                    }
                }
            }
        }
        else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <LoadingOutlined style={{ fontSize: '3em' }} />
                </div>
            );
        }
    }

    renderBasicInfoData = (agentOriginData: any) => {
        if (agentOriginData !== undefined) {
            // 确保agentOriginData总是作为数组处理
            const originDataArray = Array.isArray(agentOriginData) ? agentOriginData : [agentOriginData];
            if (originDataArray && originDataArray.length > 0) {
                const filteredData = originDataArray.find(item => item.uuid === this.state.host_uuid);

                if (!filteredData) {
                    return <div>No data available for this host.</div>;
                }
                // 将filteredData转换为所需的data结构
                const data = {
                    'UUID': filteredData.uuid,
                    '主机名称': filteredData.host_name,
                    '操作系统': filteredData.os_version,
                    '在线状态': filteredData.status,
                    '最后一次上线': convertUnixTime(filteredData.last_seen),
                    '磁盘大小': filteredData.disk_total,
                    '内存大小': filteredData.mem_total,
                    '内存使用': filteredData.mem_use,
                    'CPU使用率': filteredData.cpu_use,
                    'CPU信息': `${filteredData.processor_name}_${filteredData.processor_architecture}`,
                    'python版本': filteredData.py_version,
                    // 其他字段按需填充
                };

                return (
                    // <Row gutter={[16, 16]}>
                    //     {Object.entries(data).map(([key, value], index) => (
                    //         <Col key={index} span={8} style={{ fontSize: '15px', marginBottom: '10px' }}>
                    //             <Text style={{color:'#686E7A'}}strong>{key}:</Text> <Text>{value}</Text>
                    //         </Col>
                    //     ))}
                    // </Row>
                    <Row gutter={[16, 16]}>
                        {Object.entries(data).map(([key, value], index) => (
                            <Col key={index} span={8} style={{ fontSize: '15px', marginBottom: '10px' }}>
                                <Text style={{ color: '#686E7A' }} strong>{key}: </Text>
                                {key === '在线状态' ? (
                                    <Badge status={filteredData.status === 'Online' ? 'success' : 'error'} text={filteredData.status} />
                                ) : (
                                    <Text>{value}</Text>
                                )}
                            </Col>
                        ))}
                    </Row>
                );
            }
        } else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <LoadingOutlined style={{ fontSize: '3em' }} />
                </div>
            );
        }
    };


    renderTable = (OriginData: any[], api: string, title: string, timeColumnIndex: string[], column: any[], currentPanel: string,
        searchIndex:string[]
    ) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            const filteredData = originDataArray.filter(item => item.uuid === this.state.host_uuid);
            if (filteredData.length > 0) {
                return (
                    <div style={{ fontWeight: 'bolder', width: '100%', }}>
                        <Card bordered={true}
                            style={{ backgroundColor: '#ffffff' }}>
                            <Row>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold' }}>
                                    <h2 style={{
                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
                                </div>
                            </Row>
                            <DataDisplayTable
                                externalDataSource={filteredData}
                                apiEndpoint={api}
                                timeColumnIndex={timeColumnIndex}
                                columns={column}
                                currentPanel={currentPanel}
                                searchColumns={searchIndex}
                            />
                        </Card>
                    </div>
                );
            }
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                <Card bordered={true}
                    style={{ backgroundColor: '#ffffff' }}>
                    <LoadingOutlined style={{ fontSize: '3em' }} />
                </Card>
            </div>
        );
    }

    renderDataCard = (OriginData: any[], title: string) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            const filteredData = originDataArray.filter(item => item.uuid === this.state.host_uuid);
            if (filteredData.length > 0) {
                return (
                    <div style={{ width: '100%', }}>
                        {OriginData !== undefined && <Statistic title={<span>{title}</span>}
                            value={(Array.isArray(OriginData) ? OriginData : [OriginData]).filter(item => item.uuid === this.state.host_uuid).length} />}
                        {OriginData === undefined && <Statistic title={<span>{title}</span>} value={'-'} />}
                    </div>
                );
            }
        }
        return (

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <LoadingOutlined style={{ fontSize: '3em' }} />
            </div>
        );
    }

    render() {
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const { linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                        vulnOriginData, portOriginData, assetOriginData, processOriginData,
                        fimOriginData,monitoredOriginData,
                        agentOriginData,

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


                    const AlertData_uuid = [
                        { label: '蜜罐告警', value: HoneyPotHostCount?HoneyPotHostCount:0, color: '#FFBB28' },
                        { label: 'TTPs告警', value: TTPsHostCount?TTPsHostCount:0, color: '#468DFF' },
                        { label: '病毒扫描告警', value: VirusHostCount === 0 ? 40 : VirusHostCount, color: '#846CCE' },
                    ];
                    const agentversion = '1.7.0.24';

                    return (
                        <div>
                            <Row style={{ width: '100%', margin: '0 auto' }}>
                                <Col className="gutter-row" md={24} style={{ border: 'false' }}>{/*maxWidth:1260*/}
                                    <Row gutter={[8, 16]}>
                                        <Card bordered={false}
                                            style={{ fontWeight: 'bolder', width: '100%', minHeight: 150, backgroundColor: '#ffffff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                                <h2 style={{
                                                    fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>基础信息</h2>
                                            </div>
                                            <div style={{ marginLeft: '90px' }}>
                                                {this.renderBasicInfoData(agentOriginData)}
                                            </div>
                                        </Card>
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        <Col md={8}>
                                            <Card bordered={false}
                                                style={{ fontWeight: 'bolder', width: '100%', maxHeight: 280, backgroundColor: '#ffffff' }}>
                                                <Row>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                        <h2 style={{
                                                            fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>安全告警</h2>
                                                    </div>
                                                    {/*<Button*/}
                                                    {/*    type="link"*/}
                                                    {/*    style={{*/}
                                                    {/*        fontWeight: 'bold', padding: '0 0',*/}
                                                    {/*        border: 'transparent',*/}
                                                    {/*        backgroundColor: 'transparent',marginLeft: 'auto', marginRight: '0',*/}
                                                    {/*    }}//style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}*/}
                                                    {/*    onClick={() => this.goToPanel('hostalertlist')}>详情</Button>*/}
                                                </Row>
                                                <Row >
                                                    <Col span={12}>
                                                        <CustomPieChart
                                                            data={AlertData_uuid}
                                                            innerRadius={54}
                                                            deltaRadius={8}
                                                            outerRadius={80}
                                                            cardWidth={200}
                                                            cardHeight={200}
                                                            hasDynamicEffect={true}
                                                        />
                                                    </Col>
                                                    <Col span={2}> </Col>
                                                    <div style={{ transform: 'translateX(220px) translateY(-160px)',}}>
                                                        <StatusPanel statusData={AlertData_uuid}
                                                                     orientation="vertical" />
                                                    </div>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col md={8}>
                                            <Card bordered={false}
                                                  style={{
                                                      fontWeight: 'bolder',
                                                      width: '100%', maxHeight: 280, backgroundColor: '#ffffff' }}>

                                                <Row>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                        <h2 style={{
                                                            fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>漏洞风险</h2>
                                                    </div>
                                                    <Button
                                                        type="link"
                                                        style={{
                                                            fontWeight: 'bold', border: 'transparent',
                                                            backgroundColor: 'transparent', color: '#686E7A', marginLeft: 'auto', marginRight: '0',
                                                        }}//style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}
                                                        onClick={() => this.goToPanel('vulnerabilityDetailList')}>详情</Button>
                                                </Row>

                                                <Row gutter={0}>
                                                    {this.renderVulPieChart(vulnOriginData, '待处理高可利用漏洞', '风险项', '通过项')}

                                                </Row>

                                            </Card>
                                        </Col>
                                        <Col md={8} style={{ width: '33%', marginLeft: 'auto', marginRight: '0' }}>
                                            <Card bordered={false}
                                                style={{ fontWeight: 'bolder', width: '100%', maxHeight: 280, backgroundColor: '#ffffff' }}>

                                                <Row>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                        <h2 style={{
                                                            fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>基线风险</h2>
                                                    </div>
                                                    <Button
                                                        type="link"
                                                        style={{
                                                            fontWeight: 'bold', border: 'transparent',
                                                            backgroundColor: 'transparent', color: '#686E7A', marginLeft: 'auto', marginRight: '0',
                                                        }}//style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}
                                                        onClick={() => this.goToPanel('baseLineDetectDetailList')}>详情</Button>
                                                </Row>
                                                <Row gutter={0}>
                                                    {this.renderPieCharBaseLineChart(agentOriginData, linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData)}

                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        <Card bordered={false}
                                            style={{ fontWeight: 'bolder', width: '100%', minHeight: 80, backgroundColor: '#ffffff' }}>
                                            <Row>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>资产指纹</h2>
                                                </div>
                                            </Row>
                                            <Row justify="space-between" align="middle">
                                                <Col span={2}>
                                                </Col>
                                                <Col span={2}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '75px',
                                                            width: '140px',
                                                            minWidth: 110, // 最小宽度100px
                                                            maxWidth: 200, // 最大宽度200px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col pull={2} span={22}>
                                                                {this.renderDataCard(portOriginData, '开放端口')}
                                                            </Col>
                                                            <Col
                                                                pull={0}
                                                                span={2}
                                                                style={{ position: 'relative', top: '-3.5px' }}
                                                            >
                                                                <Button
                                                                    type="link"
                                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                                    icon={<RightOutlined />}
                                                                    onClick={() => this.handleScrollToSection(this.openPortsRef)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col span={2}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '75px',
                                                            width: '140px',
                                                            minWidth: 110, // 最小宽度100px
                                                            maxWidth: 200, // 最大宽度200px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col pull={2} span={22}>
                                                                {this.renderDataCard(processOriginData, '运行进程')}
                                                            </Col>
                                                            <Col
                                                                pull={0}
                                                                span={2}
                                                                style={{ position: 'relative', top: '-3.5px' }}
                                                            >
                                                                <Button
                                                                    type="link"
                                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                                    icon={<RightOutlined />}
                                                                    onClick={() => this.handleScrollToSection(this.processRef)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col span={2}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '75px',
                                                            width: '140px',
                                                            minWidth: 110, // 最小宽度100px
                                                            maxWidth: 200, // 最大宽度200px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col pull={2} span={22}>
                                                                {this.renderDataCard(assetOriginData, '系统服务')}
                                                            </Col>
                                                            <Col
                                                                pull={0}
                                                                span={2}
                                                                style={{ position: 'relative', top: '-3.5px' }}
                                                            >
                                                                <Button
                                                                    type="link"
                                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                                    icon={<RightOutlined />}
                                                                    // onClick={() => this.goToPanel('system-services')}
                                                                    onClick={() => this.handleScrollToSection(this.assetRef)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col span={2}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '75px',
                                                            width: '140px',
                                                            minWidth: 110, // 最小宽度100px
                                                            maxWidth: 200, // 最大宽度200px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col pull={2} span={22}>
                                                                {this.renderDataCard(monitoredOriginData, '文件监控')}
                                                            </Col>
                                                            <Col
                                                                pull={0}
                                                                span={2}
                                                                style={{ position: 'relative', top: '-3.5px' }}
                                                            >
                                                                <Button
                                                                    type="link"
                                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                                    icon={<RightOutlined />}
                                                                    // onClick={() => this.goToPanel('system-services')}
                                                                    onClick={() => this.handleScrollToSection(this.MonitorRef)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col span={3}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '75px',
                                                            width: '160px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col pull={2} span={22}>
                                                                {this.renderDataCard(fimOriginData, '文件完整性检验')}
                                                            </Col>
                                                            <Col
                                                                pull={0}
                                                                span={2}
                                                                style={{ position: 'relative', top: '-3.5px' }}
                                                            >
                                                                <Button
                                                                    type="link"
                                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                                    icon={<RightOutlined />}
                                                                    // onClick={() => this.goToPanel('fim')}
                                                                    onClick={() => this.handleScrollToSection(this.fimRef)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col span={2}>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Row>
                                    <Row ref={this.openPortsRef} gutter={[8, 16]}>
                                        {this.renderTable(portOriginData, Port_Data_API, '开放端口', [], openPortsColumns, 'open_ports_' + this.state.host_uuid+"_details",
                                            ["port_number","port_name"]
                                        )}
                                    </Row>
                                    <Row ref={this.processRef} gutter={[8, 16]}>
                                        {this.renderTable(processOriginData, Process_Data_API, '运行进程', ['createTime'], runningProcessesColumns, 'process_' + this.state.host_uuid+"_details"
                                            ,["pid","name","userName","cmdline"]
                                        )}
                                    </Row>
                                    <Row ref={this.assetRef} gutter={[8, 16]}>
                                        {this.renderTable(assetOriginData, Assets_Data_API, '系统服务', [], systemServicesColumns, 'services_' + this.state.host_uuid+"_details"
                                            ,["service","port","ostype"]
                                        )}
                                    </Row>
                                    <Row ref={this.MonitorRef} gutter={[8, 16]}>
                                        {this.renderTable(monitoredOriginData, Monitor_Data_API, '文件监控', ['timestamp'], monitoredColumns, 'monitored_' + this.state.host_uuid+"_details"
                                            ,["file_path",]
                                        )}
                                    </Row>
                                    <Row ref={this.fimRef} gutter={[8, 16]}>
                                        {this.renderTable(fimOriginData, Fim_Data_API, '文件完整性检验', ['event_time'], fimColumns, 'fim_' + this.state.host_uuid+"_details"
                                            ,["filename",]
                                        )}
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        <Card bordered={false}
                                            style={{ fontWeight: 'bolder', width: '100%', minHeight: 100, backgroundColor: '#ffffff' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 0, fontWeight: 'bold' }}>
                                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>版本信息</h2>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 0, fontWeight: 'bold' }}>
                                                <h2 style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '0px' }}>Agent版本 {agentversion}</h2>
                                            </div>

                                        </Card>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    );

                }}
            </DataContext.Consumer>
        )
    }
}

export default withRouter(HostOverview);