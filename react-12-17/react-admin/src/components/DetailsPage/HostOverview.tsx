import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Button, Badge } from 'antd';
import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import { diskColumns, netColumns, pluginColumns } from './DetailsTableColumns';
import {
    fimColumns,
    openPortsColumns,
    runningProcessesColumns, systemServicesColumns,
    GenericDataItem, StatusItem
} from '../tableUtils';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';
import DataDisplayTable from '../ElkeidTable/DataDisplayTable';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { convertUnixTime } from '../ContextAPI/DataService';

const { Text } = Typography;


interface HostOverviewProps extends RouteComponentProps {
    // ... other props if there are any
    changePanel: (panelName: string) => void; //切换子panel
}
export interface agentInfoType {
    host_name: string;
    ip_address: string;
    os_version: string;
    status: string;
    last_seen: string;
    disk_total: string;
    mem_total: string;
    mem_use: string;
    cpu_use: string;
    py_version: string;
    processor_name: string;
    processor_architecture: string;
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

    // 修改后的函数，使其能够导航到对应的子面板
    goToPanel = (panelName: string) => {
        // 更新父组件的状态，changePanel 的函数负责这个逻辑
        this.props.changePanel(panelName);
    };
    // renderVulPieChart1 = (OriginData:any) =>{
    //     if(OriginData!==undefined){
    //         // 确保OriginData总是作为数组处理
    //         const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
    //         const filteredData = originDataArray.filter(item => item.uuid === this.state.host_uuid);

    //         // 确保filteredData不为空再访问它的属性
    //         if (filteredData.length > 0) {
    //             //message.info("filteredData.filter:"+(filteredData[0].uuid));

    //             const alertData3_:StatusItem[]=[
    //                 // 确保使用正确的方法来计数
    //                 { label: 'Pending', value: filteredData.filter(item => item.status === 'Pending').length, color: '#EA635F' },//RED
    //                 { label: '通过', value: 99 - filteredData.filter(item => item.status === 'Pending').length, color: '#468DFF' }//蓝
    //             ];
    //             return (
    //               <div>
    //                 <Row>
    //                 <Col span={12}>
    //                     <CustomPieChart
    //                     data={alertData3_}
    //                     innerRadius={54}
    //                     deltaRadius={8}
    //                     outerRadius={80}
    //                     cardWidth={200}
    //                     cardHeight={200}
    //                     hasDynamicEffect={true}
    //                     />
    //                 </Col>
    //                 <Col span={2}> </Col>
    //                 <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
    //                     <StatusPanel statusData={alertData3_} orientation="vertical"/>
    //                 </div>
    //                 </Row>
    //               </div>
    //             );
    //         }
    //     }
    //     return (
    //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
    //         <LoadingOutlined style={{ fontSize: '3em' }} />
    //         </div>
    //     );
    // }
    renderVulPieChart = (OriginData: any[], title: string, panelDataTitle1: string, panelDataTitle2: string) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            let totalExpResultCount = 0;
            originDataArray.forEach(item => {
                totalExpResultCount += item.vul_detection_exp_result.length;
            });
            const scanPanelData: StatusItem[] = [
                { color: '#E63F3F', label: panelDataTitle1, value: totalExpResultCount },
                { color: '#468DFF', label: panelDataTitle2, value: 99 },];
            return (
                <div>
                    <Row>
                        <Col span={12}>
                            <CustomPieChart
                                data={scanPanelData}
                                innerRadius={54}
                                deltaRadius={8}
                                outerRadius={80}
                                cardWidth={200}
                                cardHeight={200}
                                hasDynamicEffect={true}
                            />
                        </Col>
                        <Col span={2}> </Col>
                        <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                            <StatusPanel statusData={scanPanelData} orientation="vertical" />
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

    renderBLPieChart = (linuxOriginData: any, winOriginData: any,
        title1: string, title2: string, wholeCount: number,
        width?: number, height?: number, inner?: number, delta?: number, outter?: number) => {
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

                const alertData3_: StatusItem[] = [
                    // 确保使用正确的方法来计数
                    { label: title1, value: uniqueUuidCount1 + uniqueUuidCount2, color: '#EA635F' },//RED
                    { label: title2, value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2), color: '#468DFF' }//蓝
                ];
                return (
                    <CustomPieChart
                        data={alertData3_}
                        innerRadius={34}
                        deltaRadius={5}
                        outerRadius={50}
                        cardHeight={150}
                        hasDynamicEffect={true}
                    />
                );
            }
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <LoadingOutlined style={{ fontSize: '3em' }} />
            </div>
        );
    }
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
                            const alertData3_: StatusItem[] = [
                                // 确保使用正确的方法来计数
                                { label: '建议调整项', value: needAdjItemCounts, color: '#EA635F' },//RED
                                { label: '自行判断项', value: linuxData.length - needAdjItemCounts, color: '#468DFF' }//蓝
                            ];
                            return (
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <CustomPieChart
                                                data={alertData3_}
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
                                            <StatusPanel statusData={alertData3_} orientation="vertical" />
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
                            const alertData3_: StatusItem[] = [
                                // 确保使用正确的方法来计数
                                { label: '建议调整项', value: needAdjItemCounts, color: '#EA635F' },//RED
                                { label: '自行判断项', value: linuxData.length - needAdjItemCounts, color: '#468DFF' }//蓝
                            ];
                            return (
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <CustomPieChart
                                                data={alertData3_}
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
                                            <StatusPanel statusData={alertData3_} orientation="vertical" />
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
                    '主机名称': filteredData.host_name,
                    '主机ID': filteredData.uuid,
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


    renderTable = (OriginData: any[], api: string, title: string, timeColumnIndex: string[], column: any[], currentPanel: string) => {
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
                                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
                                </div>
                            </Row>
                            <DataDisplayTable
                                externalDataSource={filteredData}
                                apiEndpoint={api}
                                timeColumnIndex={timeColumnIndex}
                                columns={column}
                                currentPanel={currentPanel}
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
                        vulnOriginData, portOriginData, assetOriginData, processOriginData, fimOriginData,
                        agentOriginData, } = context;
                    const data = {
                        '主机名称': this.state.host_uuid,
                        '主机ID': 'bb141656-d7ed-5e41-b7f5-300...',
                        '操作系统': '',
                        '主机标签': '-',
                        '设备型号': 'VMware, Inc.',
                        '生产商': '-',
                        '系统负载': '1.03/1.13',
                        '公网IPv4': '-',
                        '公网IPv6': '-',
                        '私网IPv4': '172.17.0.2',
                        '私网IPv6': '-',
                        '网络区域': 'private',
                        '操作系统版本': '3.10.0-1160.el7.x86_64',
                        '容器平台': 'VMware Virtual Platform',
                        'CPU信息': '12th Gen Intel(R) Core(TM) i7...',
                        'CPU使用率': '2.69%',
                        '内存大小': '3.68 GB',
                        '内存使用率': '83%',
                        '默认网关': '172.17.0.1',
                        '地域': 'default',
                        '内存占用率': '84.24%',
                        '磁盘占用': '0.82/0.56/0.5',
                        '网卡序列': 'F0684D56-4A26-C1B9-CE...',
                        '注册时间': '2023-12-27 04:08:53',
                        '最近活跃时间': '2024-01-12 17:46:01',
                        '更新时间': '2023-12-13 23:18:24',
                        '探测时间': '2023-12-27 04:09:03',
                        'DNS服务器': '192.168.218.2',
                        // ... any other data fields
                    };
                    //const result: GenericDataItem[] = agentOriginData.filter(item => item['host_name'] === this.state.host_uuid);

                    const alertData2_: StatusItem[] = [
                        { label: '紧急', value: 5, color: '#EA635F' },//RED
                        { label: '高风险', value: 1, color: '#846CCE' },//紫
                        { label: '中风险', value: 1, color: '#FBB12E' },//ORANGE
                        { label: '低风险', value: 1, color: '#468DFF' }//蓝
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
                                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>基础信息</h2>
                                            </div>
                                            <div style={{ marginLeft: '90px' }}>
                                                {this.renderBasicInfoData(agentOriginData)}
                                            </div>
                                        </Card>
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        <Col md={8}>
                                            <Card bordered={false}
                                                style={{ fontWeight: 'bolder', width: '100%', minHeight: 200, backgroundColor: '#ffffff' }}>
                                                <Row>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>安全告警</h2>
                                                    </div>
                                                    <Button
                                                        type="link"
                                                        style={{
                                                            fontWeight: 'bold', border: 'transparent',
                                                            backgroundColor: 'transparent', color: '#686E7A', marginLeft: 'auto', marginRight: '0',
                                                        }}//style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}
                                                        onClick={() => this.goToPanel('hostalertlist')}>详情</Button>
                                                </Row>
                                                <Row gutter={0}>
                                                    <Col span={12}>
                                                        <CustomPieChart
                                                            data={alertData2_}
                                                            innerRadius={54}
                                                            deltaRadius={8}
                                                            outerRadius={80}
                                                            cardWidth={200}
                                                            cardHeight={200}
                                                            hasDynamicEffect={true}
                                                        />
                                                    </Col>
                                                    <Col span={2}> </Col>
                                                    <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                                                        <StatusPanel statusData={alertData2_} orientation="vertical" />
                                                    </div>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col md={8}>
                                            <Card bordered={false}
                                                style={{ fontWeight: 'bolder', width: '100%', minHeight: 200, backgroundColor: '#ffffff' }}>

                                                <Row>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>漏洞风险</h2>
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
                                                    {/* {this.renderVulPieChart(vulnOriginData)} */}
                                                    {this.renderVulPieChart(vulnOriginData, '待处理高可利用漏洞', '风险项', '通过项')}

                                                </Row>

                                            </Card>
                                        </Col>
                                        <Col md={8} style={{ width: '33%', marginLeft: 'auto', marginRight: '0' }}>
                                            <Card bordered={false}
                                                style={{ fontWeight: 'bolder', width: '100%', minHeight: 200, backgroundColor: '#ffffff' }}>

                                                <Row>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>基线风险</h2>
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

                                                    {/* {this.renderVulPieChart(vulnOriginData)} */}
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        <Card bordered={false}
                                            style={{ fontWeight: 'bolder', width: '100%', minHeight: 80, backgroundColor: '#ffffff' }}>
                                            <Row>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>资产指纹</h2>
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
                                                                    onClick={() => this.goToPanel('open-ports')}
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
                                                                    onClick={() => this.goToPanel('running-processes')}
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
                                                                    onClick={() => this.goToPanel('system-services')}
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
                                                                    onClick={() => this.goToPanel('fim')}
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
                                                                <Statistic title={<span>定时任务</span>} value={99} />
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
                                                                    onClick={() => this.goToPanel('scheduled-tasks')}
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
                                    {/* <Row gutter={[8,16]}>
                                <Card bordered={true}
                                    style={{fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>磁盘信息</h2>
                                        </div>
                                    </Row>
                                    <FetchDataForElkeidTable
                                        apiEndpoint="http://localhost:5000/api/files/diskinfo"
                                        timeColumnIndex={[]}
                                        columns={diskColumns}
                                        currentPanel="hostOverviewdiskinfolist"
                                    />
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={true}
                                    style={{fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>网卡信息</h2>
                                        </div>
                                    </Row>
                                    <FetchDataForElkeidTable
                                        apiEndpoint="http://localhost:5000/api/files/netinfo"
                                        timeColumnIndex={[]}
                                        columns={netColumns}
                                        currentPanel="hostOverviewnetinfolist"
                                    />
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={true}
                                    style={{fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>插件列表</h2>
                                        </div>
                                    </Row>
                                    <FetchDataForElkeidTable
                                        apiEndpoint="http://localhost:5000/api/files/plugininfo"
                                        timeColumnIndex={[]}
                                        columns={pluginColumns}
                                        currentPanel="hostOverviewplugininfolist"
                                    />
                                </Card>
                            </Row> */}
                                    <Row gutter={[8, 16]}>
                                        {this.renderTable(portOriginData, 'http://localhost:5000/api/portinfo/all', '开放端口', [], openPortsColumns, 'open-ports_' + this.state.host_uuid)}
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        {this.renderTable(fimOriginData, 'http://localhost:5000/api/FileIntegrityInfo/all', '文件完整性检验', ['event_time'], fimColumns, 'fim_' + this.state.host_uuid)}
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                        {this.renderTable(processOriginData, 'http://localhost:5000/api/process/all', '运行进程', ['createTime'], runningProcessesColumns, 'process_' + this.state.host_uuid)}
                                    </Row>
                                    <Row gutter={[8, 16]}>

                                        {this.renderTable(assetOriginData, 'http://localhost:5000/api/asset_mapping/all', '系统服务', [], systemServicesColumns, 'services_' + this.state.host_uuid)}
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