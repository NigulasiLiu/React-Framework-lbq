import React from 'react';
import { Row, Col, Card, Statistic,Button } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { DataContext, DataContextType} from '../ContextAPI/DataManager'
import { PieChart, Pie, Cell,Label, LineChart, Line, } from 'recharts';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import { StatusItem } from '../tableUtils';
import { GithubOutlined, GlobalOutlined, LoadingOutlined, MailOutlined,RightOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import CustomLineChart from './CustomLineChart';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import DataCard from '../DataCard';
import CustomPieChart from '../AssetsCenter/CustomPieChart';


// const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ddd' }}>
//           <Text>{data.name}: {data.value}</Text>
//         </div>
//       );
//     }
  
//     return null;
//   };
interface ProgressPanelProps {
  labels: string[];
  values: number[];
  colors: string[]; 
  max?: number;
}
interface DashboardProps extends RouteComponentProps {
  host_number:number;
  host_in_alert:number;
  host_with_vul:number;
  host_with_baselineRisk:number;

  agent_number:number;
  agent_online_number:number;

  open_port_number:number;
  service_number:number;
  RASP_number:number;
  alert_undone:number[];//长度为1+x，总的待处理的告警数量+各个等级的待处理告警数量
  vulnerability_number:number[];
  baseliineDetect_number:number[];
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
            <div style={{ fontFamily: 'YouYuan', marginBottom: '10px' }}>
              {`${label}`} {/* 添加序号 {`${index + 1}. ${label}`}*/}
            </div>
            {/* Progress bar in a separate row */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ flexGrow: 1, marginRight: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
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

const renderBLPieChart = (linuxOriginData:any, winOriginData:any, 
  title1:string,title2:string, wholeCount:number,
  width?:number,height?:number,inner?:number,delta?:number,outter?:number) =>{
  if(linuxOriginData!==undefined && winOriginData!==undefined){
      // 确保OriginData总是作为数组处理
      const originDataArray1 = Array.isArray(linuxOriginData) ? linuxOriginData : [linuxOriginData];
      const needAdjItems1 = originDataArray1.filter(item => item.adjustment_requirement === '建议调整');

      const originDataArray2 = Array.isArray(winOriginData) ? winOriginData : [winOriginData];
      const needAdjItems2 = originDataArray2.filter(item => item.adjustment_requirement === '建议调整');
      // 确保needAdjItems不为空再访问它的属性
      if (needAdjItems1.length > 0 || needAdjItems2.length>0) {
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
          
          const alertData3_:StatusItem[]=[
              // 确保使用正确的方法来计数
              { label: title1, value: uniqueUuidCount1+uniqueUuidCount2, color: '#EA635F' },//RED
              { label: title2, value: wholeCount - (uniqueUuidCount1+uniqueUuidCount2), color: '#468DFF' }//蓝
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

class Dashboard extends React.Component<DashboardProps> {
    


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
            day: `${date.getMonth() + 1}-${date.getDate()+1}`,//formatDay(date),
            value: alertsCount[i].toString(),
          });
        }
      
        return alertData;
      };
      


      return(
        <DataContext.Consumer>
        {(context: DataContextType | undefined) => {
        if (!context) {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
              <LoadingOutlined style={{ fontSize: '3em' }} />
              </div>); // 或者其他的加载状态显示
        }
        // 从 context 中解构出 topFiveFimData 和 n
        const { 
            agentMetaData_status,
            agentOnlineCount,
            portMetaData_port_state, 
            assetMetaData_service,      
            hostCount,
            vulnOriginData,
            vulnHostCount,last7VulValue,
          
            linuxBaseLineCheckOriginData,windowsBaseLineCheckOriginData,
            blLinuxHostCount,
            blWindowsHostCount,
            blLinuxNeedAdjustmentItemCount,
            blWindowsNeedAdjustmentItemCount,
            blLinuxNeedAdjustmentItemCount_pass,blWindowsNeedAdjustmentItemCount_pass,
            
            agentAVGCPUUse,agentAVGMEMUse,
          } = context;
          //console.log('过去7日漏洞风险:'+last7VulValue);
          const alertData = generateAlertData(last7VulValue);
          // 转换value为数字类型
          const processedData = alertData.map(item => ({ ...item, value: Number(item.value) }));


            // 第二类告警的数据集
            const alertDataTwo = [
              { label: '待处理告警', value: 1, color: '#FFBB28' },
              { label: '已处理告警', value: 1, color: '#E5E8EF' },
            ];
      
            const alertDataThree = [
              { label: '无风险主机', value: hostCount-vulnHostCount, color: '#E5E8EF' },//GREY
              { label: '存在高可利用漏洞主机', value: vulnHostCount, color: '#EA635F' }//RED
            ];
            const alertDataFour = [
              { label: '无风险主机', value: hostCount-(blLinuxHostCount+blWindowsHostCount), color: '#E5E8EF' },//GREY
              { label: '存在高危基线主机', value: blLinuxHostCount+blWindowsHostCount, color: '#4086FF' }//BLUE
            ];
            const riskData: StatusItem[] = [
              { color: '#faad14', label: '建议调整 ', value: 1 },//蓝色E53F3F
              { color: '#52c41a', label: '自行判断 ', value: 1 },
              // { color: '#468DFF', label: '低风险 ', value: 2 },
            ];
      const labels = ['Windows主机基线检查建议调整项', 'Linux主机基线检查建议调整项','基线检查通过项' ];
      const values = [blWindowsNeedAdjustmentItemCount||0, blLinuxNeedAdjustmentItemCount||0,blLinuxNeedAdjustmentItemCount_pass+blWindowsNeedAdjustmentItemCount_pass];
      const colors = ['#faad14', '#faad14', '#52c41a']; // 指定每个进度条的颜色,弃用的绿色'#52c41a'，红ff4d4f
            return (
           
              <div >
                <Row gutter={[12, 6]} >
              <Col className="gutter-row" md={17}>    
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col className="gutter-row" md={24}>
                    <Card bordered={false}  
                      style={{fontWeight: 'bolder', width: '100%', height:200}}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                          <h2 style={{ fontSize:'19px',fontWeight: 'bold', marginLeft: '0px' }}>资产概览</h2>
                      </div>
                      <Row gutter={[6, 6]}>
                      <Col className="gutter-row" md={8}>
                        <Card
                          bordered={false}
                          style={{
                              height: '100px',
                              width: '260px',
                              minWidth: '200px', // 最小宽度300px，而非100px
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                          }}
                          >
                          <Row>
                              <Col span={24}>
                                  <Statistic title={<span style={{fontSize:'18px'}}>主机</span>} value={hostCount} />
                              </Col>
                              
                          </Row>
                        </Card>
                      </Col>
                      <Col className="gutter-row" md={8}>
                        <Card
                          bordered={false}
                          style={{
                              height: '100px',
                              width: '260px',
                              minWidth: '200px', // 最小宽度300px，而非100px
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                          }}
                          >
                          <Row>
                              <Col span={24}>
                                  <Statistic title={<span style={{fontSize:'18px'}}>开放端口</span>} value={portMetaData_port_state.typeCount.get('open')} />
                              </Col>
                              
                          </Row>
                        </Card>
                      </Col>              
                      <Col className="gutter-row" md={8}>
                        <Card
                          bordered={false}
                          style={{
                              height: '100px',
                              width: '260px',
                              minWidth: '200px', // 最小宽度300px，而非100px
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                          }}
                          >
                          <Row>
                              <Col  span={24}>
                                  <Statistic title={<span style={{fontSize:'18px'}}>服务数量</span>} value={assetMetaData_service.tupleCount} />
                              </Col>
                              
                          </Row>
                        </Card>
                      </Col>              
                      {/* <Col className="gutter-row" md={8}>
                        <Card
                          bordered={false}
                          style={{
                              height: '100px',
                              width: '260px',
                              minWidth: '200px', // 最小宽度300px，而非100px
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                          }}
                          >
                              <Col  span={24}>
                                  <Statistic title={'RASP注入进程'} value={0} />
                              </Col>
                              
                        </Card>
                      </Col> */}
                      </Row>
          
                    </Card>
                    </Col>
                </Row>
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}> 
                      <Col className="gutter-row" md={24}>
                      <Card bordered={false}  
                        style={{fontWeight: 'bolder', width: '100%', height:350}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'19px',fontWeight: 'bold', marginLeft: '0px' }}>入侵告警</h2>
                        </div>
                        <Row gutter={[6, 6]}>
                          <Col span={18}>
                          <div style={{
                              // borderTop: '2px solid #E5E6EB',
                              // borderBottom: '2px solid #E5E6EB',
                              // borderLeft: '2px solid #E5E6EB',line shape="circle" 
                              borderRight: '3px solid #E5E6EB'}}>
                          <ResponsiveContainer width="98%" height={250}>
                            <AreaChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              {/* <YAxis /> */}
                              <Tooltip />
                              <Area
                                fillOpacity={0.5}
                                stroke="#4086FF" // 设置线条颜色为#4086FF
                                strokeWidth={2} // 设置线条厚度为3px
                                fill="#F1F8FE" // 设置填充颜色为#4086FF
                                type="monotone"
                                dataKey="value"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
          
                          </div>
                          </Col>
                          <Col span={6}>
                          <DataCard
                                  title="主机安全告警"
                                  value={5}
                                  valueItem={[
                                    { value: '0', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                                    { value: '0', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                                    { value: '0', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                                    { value: '0', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                                  ]}
                                  panelId="/app/HostProtection/InvasionDetect/HCPAlertList"
                                  height="75px"
                                  width="210px"
                                  backgroundColor="#ffffff"
                                  navigate={true}
                                  showTopBorder={false}
                                  showBottomBorder={false}
                                  showLeftBorder={false}
                                  showRightBorder={false}
                                  //onPanelClick={(panelId) => { this.goToPanel('running-processes') }}
                              />
                          </Col>
                        </Row>
          
                      </Card>
                      </Col>
                  </Row>
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                    <Col className="gutter-row" md={24}>
          
                    <Card bordered={false}  
                        style={{fontWeight: 'bolder', width: '100%', height:350}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'19px',fontWeight: 'bold', marginLeft: '0px' }}>漏洞风险</h2>
                        </div>
                        <Row gutter={[6, 6]}>
                          <Col span={18}>
                          <div style={{
                              // borderTop: '2px solid #E5E6EB',
                              // borderBottom: '2px solid #E5E6EB',
                              // borderLeft: '2px solid #E5E6EB',
                              borderRight: '3px solid #E5E6EB'}}>
                          <ResponsiveContainer width="98%" height={250}>                            
                          <AreaChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              {/* <YAxis /> */}
                              <Tooltip />
                              <Area
                                fillOpacity={0.5}
                                stroke="#4086FF" // 设置线条颜色为#4086FF
                                strokeWidth={2} // 设置线条厚度为3px
                                fill="#F1F8FE" // 设置填充颜色为#4086FF
                                type="monotone"
                                dataKey="value"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
          
                          </div>
                          </Col>
                          <Col span={6}>
                          <DataCard
                                  title="待处理高可利用漏洞"
                                  value={vulnHostCount}
                                  valueItem={[
                                    { value: '0', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                                    { value: '0', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                                    { value: '0', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                                    { value: '0', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                                  ]}
                                  panelId="/app/HostProtection/VulnerabilityList"
                                  height="75px"
                                  width="210px"
                                  backgroundColor="#ffffff"
                                  navigate={true}
                                  showTopBorder={false}
                                  showBottomBorder={false}
                                  showLeftBorder={false}
                                  showRightBorder={false}
                                  //onPanelClick={(panelId) => { this.goToPanel('running-processes') }}
                              />
                          </Col>
                        </Row>
          
                      </Card>
                    </Col>
                </Row>      
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}> 
                      <Col className="gutter-row" md={24}>
                      <Card bordered={false}
                        style={{fontWeight: 'bolder', width: '100%', height:330}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>基线风险</h2>
                        <StatusPanel statusData={riskData} orientation="horizontal" />
                        </div>
                        <Row gutter={[6, 6]}>
                          <Col span={24}>
                            <ProgressPanel labels={labels} values={values} colors={colors} />
                          </Col>
                        </Row>
          
                      </Card>
                      </Col>
                </Row>       
              </Col>   
          
              <Col className="gutter-row" md={7}>
                <Col className="gutter-row" md={24}>
                  <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                  <Card bordered={false} /*title="OWL 介绍*/
                    style={{fontWeight: 'bolder', width: '100%', height:350,backgroundColor:'#ffffff'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>OWL Security</h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '0px' }}>
                          OWL Security是一个云原生的基于主机的安全(入侵检测与风险识别)解决方案
                        </h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '0px' }}>
                          Owl Security is a support cloud-native and base linux host security(Intrusion detection and risk identification)solution
                        </h2>
                    </div>
                    <div style={{ marginBottom: 3}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, marginLeft: 16,fontWeight: 'bold'}}>
                        <p><GithubOutlined /> <a 
                        style={{ color: '#1964F5' }}
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer">GitHub</a></p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 ,marginLeft: 16,fontWeight: 'bold'}}>
                        <p><GlobalOutlined /> <a 
                        style={{ color: '#1964F5' }}
                        href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">Official website</a></p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 ,marginLeft: 16,fontWeight: 'bold'}}>    
                        <p><MailOutlined /> <a 
                        style={{ color: '#1964F5' }}
                        href="mailto:elkeid@bytedance.com">elkeid@bytedance.com</a></p>
                    </div>
                      </div>                
                    </Card>
                  </Row>
                </Col>
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                  <Col className="gutter-row" md={24}>
                  <Card bordered={false} /*title="主机风险扇形图" */
                    style={{fontWeight: 'bolder', width: '100%', height:220}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>主机风险分布</h2>
                        <Col pull={0} span={2} style={{ position: 'relative', top: '-6px',right:'210px' }}>
                          <Button
                            type="link"
                            style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#88878C'}}
                            icon={<RightOutlined />}
                            onClick={() => this.props.history.push('/app/AssetsCenter/HostInventory')}
                          />
                        </Col>
                    </div>
                    <Row style={{marginTop:'-25px'}} gutter={[6, 6]}>
                      <Col span={8}>
                      <CustomPieChart
                                data={alertDataTwo}
                                innerRadius={34}
                                deltaRadius={5}
                                outerRadius={50}
                                cardHeight={150}
                                hasDynamicEffect={true}
                                />
                      </Col>
                      <Col span={8}>
                        
                      <CustomPieChart
                                data={alertDataThree}
                                innerRadius={34}
                                deltaRadius={5}
                                outerRadius={50}
                                cardHeight={150}
                                hasDynamicEffect={true}
                                />
                      </Col>
                      <Col span={8}>
                        {renderBLPieChart(linuxBaseLineCheckOriginData,windowsBaseLineCheckOriginData,'无风险主机','存在高危基线主机',blLinuxHostCount+blWindowsHostCount)}
                      {/* <CustomPieChart
                                data={alertDataFour}
                                innerRadius={34}
                                deltaRadius={5}
                                outerRadius={50}
                                cardHeight={150}
                                hasDynamicEffect={true}
                                /> */}
                      </Col>
                    </Row>
                  </Card>
                  </Col>
                </Row>      
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                  <Col className="gutter-row" md={24}>
                  <Card bordered={false} /*title="Agent 概览*/
                    style={{fontWeight: 'bolder', width: '100%', height:330}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>Agent概览</h2>
                    </div>
                    <Row gutter={[6, 6]}>
                      <Col className="gutter-row" span={12}>
                      <div style={{ marginBottom: '20px' }}>
                        <DataCard
                                title="在线 Agent"
                                value={agentOnlineCount}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}
                                />
                      </div>
                        <DataCard
                                title="离线 Agent"
                                value={hostCount-agentOnlineCount}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                      </Col>
                      <Col className="gutter-row" span={12}>
                      <div style={{ marginBottom: '20px' }}>
                        <DataCard
                                title="CPU AVG"
                                value={agentAVGCPUUse}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                                </div>
                        <DataCard
                                title="Mem AVG"
                                value={agentAVGMEMUse}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                      </Col>
          
                    </Row>
                  </Card>
                  </Col>
                </Row>      
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                  <Col className="gutter-row" md={24}>
                  <Card bordered={false} /*title="后端服务状态*/
                    style={{fontWeight: 'bolder', width: '100%', height:330}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>后端服务状态</h2>
                    </div>
                    <Row gutter={[6, 6]}>
                      <Col className="gutter-row" span={12}>
                      <div style={{ marginBottom: '20px' }}>
                        <DataCard
                                title="服务一"
                                value={0}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                                </div>
                        <DataCard
                                title="服务二"
                                value={0}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                      </Col>
                      <Col className="gutter-row" span={12}>
                      <div style={{ marginBottom: '20px' }}>
                        <DataCard
                                title="服务三"
                                value={"0%"}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                                </div>
                        <DataCard
                                title="服务四"
                                value={"0B"}
                                valueItem={[]}
                                panelId=""
                                height="100px"
                                width="155px"
                                backgroundColor="#F6F7FB"
                                navigate={true}
                                showTopBorder={false}
                                showBottomBorder={false}
                                showLeftBorder={false}
                                showRightBorder={false}/>
                      </Col>
          
                    </Row>
                  </Card>
                  </Col>
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

export default withRouter(Dashboard);