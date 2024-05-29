import React from 'react';
import axios from 'axios';
import { Row, Col, Card, message } from 'antd';
import { constRenderTable, hostinventoryColumns, StatusItem } from '../Columns';
import FetchDataForElkeidTable from '../OWLTable/FetchDataForElkeidTable';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import { Agent_Data_API } from '../../service/config';

//const { Search } = Input;

interface HostInventoryProps {

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

const renderBLPieChart = (linuxOriginData: any, winOriginData: any,
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

            const baselinePieChartData: StatusItem[] = [
                // 确保使用正确的方法来计数
                { label: title1, value: uniqueUuidCount1 + uniqueUuidCount2, color: '#E5E8EF' },//GREY
                { label: title2, value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2), color: '#4086FF' },//BLUE
            ];
            return (
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
            );
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingOutlined style={{ fontSize: '3em' }} />
        </div>
    );
};


const renderPieChart = (linuxOriginData: any, winOriginData: any, hostCount: number, vulnHostCount: number,
                        title1: string, title2: string, wholeCount: number,
                        blLinuxHostCount: number,
                        blWindowsHostCount: number, HoneyPotHostCount: number, TTPsHostCount: number, VirusHostCount: number,
                        width?: number, height?: number, inner?: number, delta?: number, outter?: number,
) => {
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

            const noAlertHostCount = 40 + hostCount - HoneyPotHostCount - TTPsHostCount - VirusHostCount;
            // 第二类告警的数据集，'#FEC746','#846CCE','#468DFF',
            const alertHostPieChartData = [
                { label: '无告警主机', value: noAlertHostCount > 0 ? noAlertHostCount : 0, color: '#E5E8EF' },
                { label: '蜜罐告警', value: HoneyPotHostCount ? HoneyPotHostCount : -1, color: '#FFBB28' },
                { label: 'TTPs告警', value: TTPsHostCount ? TTPsHostCount : -1, color: '#468DFF' },
                { label: '病毒扫描告警', value: VirusHostCount === 0 ? 20 : VirusHostCount, color: '#846CCE' },
            ];
            const vulAlertData = [
            { label: '无漏洞风险主机', value: hostCount - vulnHostCount, color: '#E5E8EF' },//GREY
            { label: '存在高可利用漏洞主机', value: vulnHostCount, color: '#EA635F' },//RED
          ];
          const baselinePieChartData: StatusItem[] = [
            // 确保使用正确的方法来计数
            { label: '无基线风险主机', value: uniqueUuidCount1 + uniqueUuidCount2, color: '#E5E8EF' },//GREY
            { label: '存在高危基线主机', value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2), color: '#4086FF' },//BLUE
          ];

            const riskStatusPanelData: StatusItem[] = [
                { color: '#E5E8EF', label: '主机总数 ', value: wholeCount },
                {
                    color: '#FBB12E',
                    label: '存在告警的主机 ',
                    value: HoneyPotHostCount + TTPsHostCount + VirusHostCount,
                },
                { color: '#EA635F', label: '存在漏洞的主机 ', value: vulnHostCount },
                {
                    color: '#4086FF',
                    label: '存在高危基线的主机 ',
                    value: wholeCount - (uniqueUuidCount1 + uniqueUuidCount2),
                },
            ];



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
                        {/*{renderBLPieChart(linuxOriginData, winOriginData, '无基线风险主机', '存在高危基线主机', blLinuxHostCount + blWindowsHostCount)}*/}
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
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoadingOutlined style={{ fontSize: '3em' }} />
        </div>
    );
};

class HostInventory extends React.Component<HostInventoryProps, HostInventoryState> {
    private refreshInterval: NodeJS.Timeout | null = null;

    constructor(props: any) {
        super(props);
        this.state = {
            runningStatusData: [],
            riskData: [],
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            fullDataSource: [], // 存储完整的数据源副本
        };
    }

    render() {

        //扇形图数据
        const alertDataOne: StatusItem[] = [
            { label: '运行中', value: 7, color: '#22BC44' },//GREEN
            { label: '运行异常', value: 2, color: '#FBB12E' },//ORANGE
            { label: '离线', value: 5, color: '#EA635F' },//RED
            { label: '未安装', value: 1, color: '#E5E8EF' },//GREY
        ];

        const riskData1: StatusItem[] = [
            { color: '#E53F3F', label: '高风险 ', value: 1 },
            { color: '#FEC746', label: '中风险 ', value: 1 },
            { color: '#468DFF', label: '低风险 ', value: 2 },
        ];
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
                        agentMetaData_status, agentOriginData,
                        linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData,
                        blLinuxHostCount,
                        blWindowsHostCount,
                        vulnHostCount, hostCount,
                        HoneyPotHostCount, TTPsHostCount, VirusHostCount,
                    } = context;
                    const hostOnlineCount = agentMetaData_status.typeCount.get('Online') || 0;
                    const hostOfflineCount = agentMetaData_status.typeCount.get('Offline') || 0;
                    //StatusLabel数据
                    const runningStatusData: StatusItem[] = [
                        { color: '#22BC44', label: '运行中 ', value: Number(hostOnlineCount) },
                        { color: '#EA635F', label: '离线 ', value: Number(hostOfflineCount) },
                        // { color: '#FBB12E', label: '运行异常 ', value: 2 },
                        // { color: '#E5E8EF', label: '未安装 ', value: 1 },
                    ];

                    return (
                        <div style={{
                            // fontFamily: '\'YouYuan\', sans-serif',
                            fontWeight: 'bold' }}>
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
                                            blLinuxHostCount, blWindowsHostCount, HoneyPotHostCount, TTPsHostCount, VirusHostCount)}
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '0px' }}>
                                <Col md={24}>
                                    {constRenderTable(agentOriginData, '主机内容', [],
                                        hostinventoryColumns, 'hostinventory', Agent_Data_API,
                                        ['uuid', 'os_version'])}
                                    {/* <div className="gutter-box">
                    <Card bordered={false}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                        <h2 style={{ fontWeight: 'bold', marginLeft: '0px' }}>主机内容</h2>
                      </div>
                      <FetchDataForElkeidTable
                        apiEndpoint="http://localhost:5000/api/agent/all"//后续更换为agent表
                        timeColumnIndex={[]}
                        columns={hostinventoryColumns}//hostinventoryColumns
                        currentPanel="hostinventory"
                      />
                    </Card>
                  </div> */}
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

export default HostInventory;
