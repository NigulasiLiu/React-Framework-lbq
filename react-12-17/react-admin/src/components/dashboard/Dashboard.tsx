import React from 'react';
import { Row, Col, Card, Statistic,Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { DataContext, DataContextType} from '../ContextAPI/DataManager'
import { PieChart, Pie, Cell,Label, LineChart, TooltipProps, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import DataCard from '../DataCard';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import { StatusItem } from '../tableUtils';
import { GithubOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';


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
              {`${index + 1}. ${label}`} {/* 添加序号 */}
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

class Dashboard extends React.Component<DashboardProps> {
    
    render() {
      function getPastSevenDays() {
        const currentDate = new Date();
        const pastSevenDays = [];
      
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(date.getDate() - i);
      
          // 如果日期小于 1，则回滚到上个月的最后一天
          if (date.getDate() < 1) {
            date.setDate(0); // 将日期设置为上个月的最后一天
          }
      
          pastSevenDays.push(date);
        }
      
        return pastSevenDays;
      }
      
      const pastSevenDays = getPastSevenDays();
      const alertData = pastSevenDays.map(date => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return { day: `${month}-${day}`, value: day };
      });

      return(
        <DataContext.Consumer>
        {(context: DataContextType | undefined) => {
        if (!context) {
            return <div>Loading...</div>; // 或者其他的加载状态显示
        }
        // 从 context 中解构出 topFiveFimData 和 n
        const { 
            agentMetaData,
            agentOnlineCount,
            portMetaData, 
            assetMetaData,      
            hostCount,
            vulnHostCount,
          
            blLinuxHostCount,
            blWindowsHostCount,
            agentCPUuseMetaData,
            agentAVGCPUUse,
          } = context;
          // let totalWeightedPercent = 0;
          // let totalCount
          // Object.entries(agentCPUuseMetaData.typeCount).forEach(([typeName, count]) => {
          //   const percentValue = parseFloat(typeName.replace('%', ''));
          //   totalWeightedPercent += percentValue * count;
          //   totalCount += count;
          // });
      
            // 第二类告警的数据集
            const alertDataTwo = [
              { name: '待处理告警', value: 75, color: '#FFBB28' },
              { name: '已处理告警', value: 25, color: '#E5E8EF' },
            ];
      
            const alertDataThree = [
              { name: '无风险主机', value: hostCount-vulnHostCount, color: '#E5E8EF' },//GREY
              { name: '存在高可利用漏洞', value: vulnHostCount, color: '#EA635F' }//RED
            ];
            const alertDataFour = [
              { name: '无风险主机', value: hostCount-(blLinuxHostCount+blWindowsHostCount), color: '#E5E8EF' },//GREY
              { name: '存在高危基线', value: blLinuxHostCount+blWindowsHostCount, color: '#4086FF' }//BLUE
            ];
            const riskData: StatusItem[] = [
              { color: '#E53F3F', label: '高风险 ', value: 1 },
              { color: '#FEC746', label: '中风险 ', value: 1 },
              { color: '#468DFF', label: '低风险 ', value: 2 },
            ];
      const labels = ['Windows主机基线检查', 'Linux主机基线检查', ];
      const values = [blWindowsHostCount, blLinuxHostCount];
      const colors = ['#ff4d4f', '#faad14', ]; // 指定每个进度条的颜色,弃用的绿色'#52c41a'
            return (
           
              <div >
                <Row gutter={[12, 6]} >
              <Col className="gutter-row" md={17}>    
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col className="gutter-row" md={24}>
                    <Card bordered={false}  
                      style={{fontWeight: 'bolder', width: '100%', height:200}}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                          <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>资产概览</h2>
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
                                  <Statistic title={<span style={{fontSize:'18px'}}>开放端口</span>} value={portMetaData.typeCount.get('open')} />
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
                                  <Statistic title={<span style={{fontSize:'18px'}}>服务数量</span>} value={assetMetaData.tupleCount} />
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
                            <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>入侵告警</h2>
                        </div>
                        <Row gutter={[6, 6]}>
                          <Col span={18}>
                          <div style={{
                              // borderTop: '2px solid #E5E6EB',
                              // borderBottom: '2px solid #E5E6EB',
                              // borderLeft: '2px solid #E5E6EB',
                              borderRight: '3px solid #E5E6EB'}}>
                          <ResponsiveContainer width="98%" height={250}>
                            <LineChart data={alertData}>
                              <XAxis dataKey="day" tick={{ fontSize: 12 }}/>
                              <YAxis dataKey="value" tickCount={24} tick={{ fontSize: 13 }}/> 
                              <CartesianGrid strokeDasharray="3 5" horizontal /> {/* 只显示竖线网格 */}
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
          
                          </div>
                          </Col>
                          <Col span={6}>
                          <DataCard
                                  title="主机安全告警"
                                  value={5}
                                  valueItem={[
                                    { value: '1', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                                    { value: '1', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                                    { value: '1', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                                    { value: '2', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                                  ]}
                                  panelId="/app/HostProtection/HostAlertList"
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
                            <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>漏洞风险</h2>
                        </div>
                        <Row gutter={[6, 6]}>
                          <Col span={18}>
                          <div style={{
                              // borderTop: '2px solid #E5E6EB',
                              // borderBottom: '2px solid #E5E6EB',
                              // borderLeft: '2px solid #E5E6EB',
                              borderRight: '3px solid #E5E6EB'}}>
                          <ResponsiveContainer width="98%" height={250}>
                            <LineChart data={alertData}>
                              <XAxis dataKey="day" tick={{ fontSize: 12 }}/>
                              <YAxis dataKey="value" tickCount={12} tick={{ fontSize: 13 }}/> 
                              <CartesianGrid strokeDasharray="3 5" horizontal /> {/* 只显示竖线网格 */}
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
          
                          </div>
                          </Col>
                          <Col span={6}>
                          <DataCard
                                  title="待处理高可利用漏洞"
                                  value={vulnHostCount}
                                  valueItem={[
                                    { value: '1', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                                    { value: '1', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                                    { value: '1', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                                    { value: '2', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                                  ]}
                                  panelId="/app/HostProtection/HostAlertList"
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
                            <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px' }}>基线风险 Top3</h2>
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
                            style={{ color: '#000' }}
                            icon={<RightOutlined />}
                            onClick={() => this.props.history.push('/app/AssetsCenter/HostInventory')}
                          />
                        </Col>
                    </div>
                    <Row style={{marginTop:'-25px'}} gutter={[6, 6]}>
                      <Col span={8}>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie className="pie-chart-segment"
                                data={alertDataTwo}
                                cx="50%"
                                cy="50%"
                                innerRadius={39}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                outerRadius={50} // 如果悬停则扇形半径变大
                                >
                                {alertDataTwo.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label value={'待处理告警:'+`${Math.round(alertDataTwo[1].value/(alertDataTwo[0].value+alertDataTwo[1].value)*100)}%`} 
                                position="center" 
                                style={{ fontSize: '11px' }}
                                />
                                </Pie>
          
                                {/* <Tooltip content={<CustomTooltip />} /> */}
                            </PieChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col span={8}>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie className="pie-chart-segment"
                                data={alertDataThree}
                                cx="50%"
                                cy="50%"
                                innerRadius={39}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                outerRadius={50} // 如果悬停则扇形半径变大
                                >
                                {alertDataThree.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label value={'高可用漏洞:'+`${Math.round(alertDataThree[1].value/(alertDataThree[0].value+alertDataThree[1].value)*100)}%`} 
                                position="center" 
                                style={{ fontSize: '11px' }}
                                />
                                </Pie>
          
                                {/* <Tooltip content={<CustomTooltip />} /> */}
                            </PieChart>
                        </ResponsiveContainer>
                      </Col>
                      <Col span={8}>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie className="pie-chart-segment"
                                data={alertDataFour}
                                cx="50%"
                                cy="50%"
                                innerRadius={39}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                outerRadius={50} // 如果悬停则扇形半径变大
                                >
                                {alertDataFour.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label value={'待加固基线:'+`${Math.round(alertDataFour[1].value/(alertDataFour[0].value+alertDataFour[1].value)*100)}%`} 
                                position="center" 
                                style={{ fontSize: '11px' }}
                                />
                                </Pie>
          
                                {/* <Tooltip content={<CustomTooltip />} /> */}
                            </PieChart>
                        </ResponsiveContainer>
                      </Col>
                    </Row>
                  </Card>
                  </Col>
                </Row>      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
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
                                showRightBorder={false}/>
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
                </Row>      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
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