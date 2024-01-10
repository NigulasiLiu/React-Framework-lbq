/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import './card.less'; // 确保路径正确
import { Row, Col, Card, Statistic,Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { PieChart, Pie, Cell,Label, LineChart, TooltipProps, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import DataCard from '../DataCard';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import { GithubOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';


interface StatusItem {
  color: string;
  label: string;
  value: number;
}

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
  colors: string[]; // 新增颜色数组
  max?: number;
}
interface DashboardProps extends RouteComponentProps {
  // ... other props if there are any
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
          <div key={index} style={{ marginBottom: '60px' }}> {/* 增加行与行之间的距离 */}
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
      const alertData = [
        { day: '12-01', value: 30 },
        { day: '12-02', value: 10 },
        { day: '12-03', value: 50 },
        { day: '12-04', value: 20 },
        { day: '12-05', value: 40 },
        // ...更多数据点
      ];
      
      
          const alertStats = {
            total: 15,
            types: [
              { name: 'SQL注入', count: 3 },
              { name: 'XSS跨站', count: 4 },
              { name: '命令注入', count: 5 },
              { name: '未知攻击', count: 3 },
            ]
          };

      
          // 第二类告警的数据集
          const alertDataTwo = [
            { name: '待处理告警', value: 75, color: '#FFBB28' },
            { name: '已处理告警', value: 25, color: '#E5E8EF' },
          ];

          const alertDataThree = [
            { name: '无风险主机', value: 13, color: '#E5E8EF' },//GREY
            { name: '存在高可利用漏洞', value: 1, color: '#EA635F' }//RED
            ];
            const alertDataFour = [
              { name: '无风险主机', value: 13, color: '#E5E8EF' },//GREY
              { name: '存在高危基线', value: 2, color: '#4086FF' }//BLUE
          ];
          const riskData: StatusItem[] = [
            { color: '#E53F3F', label: '高风险 ', value: 1 },
            { color: '#FEC746', label: '中风险 ', value: 1 },
            { color: '#468DFF', label: '低风险 ', value: 2 },
            ];
          // const renderCustomLabel = () => {
          //   console.log('okkkkk')
          //   const percent = (alertDataTwo[0].value / (alertDataTwo[0].value + alertDataTwo[1].value) * 100).toFixed(0);
          //   return (
          //     <text fill="black" textAnchor="middle" dominantBaseline="central">
          //       <tspan x="50%" dy="-1em">待处理告警</tspan>
          //       <tspan x="50%" dy="1.2em">{`${percent}%`}</tspan>
          //     </text>
          //   );
          // };
          const labels = ['OWL最佳实现-centos基线检查', '等保三级-centos基线检查', '等保二级-centos基线检查'];
          const values = [16, 19, 15];
          const colors = ['#ff4d4f', '#faad14', '#52c41a']; // 指定每个进度条的颜色

          
  return (
           
    <div className="gutter-example button-demo">
      <Row gutter={[12, 6]} >
    <Col className="gutter-row" md={17}>    
      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
          {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
          <Col className="gutter-row" md={24}>
          <Card /*title="主机状态分布" 产生分界线*/
            style={{fontWeight: 'bolder', width: '100%', height:200}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>资产概览</h2>
            </div>
            <Row gutter={[6, 6]}>
            <Col className="gutter-row" md={6}>
              <Card
                bordered={false}
                style={{
                    height: '100px',
                    width: '230px',
                    minWidth: '200px', // 最小宽度300px，而非100px
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                }}
                >
                <Row>
                    <Col pull={2} span={24}>
                        <Statistic title={<span>主机</span>} value={1} />
                    </Col>
                    
                </Row>
              </Card>
            </Col>
            <Col className="gutter-row" md={6}>
              <Card
                bordered={false}
                style={{
                    height: '100px',
                    width: '230px',
                    minWidth: '200px', // 最小宽度300px，而非100px
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                }}
                >
                <Row>
                    <Col pull={2} span={24}>
                        <Statistic title={<span>集群</span>} value={0} />
                    </Col>
                    
                </Row>
              </Card>
            </Col>              <Col className="gutter-row" md={6}>
              <Card
                bordered={false}
                style={{
                    height: '100px',
                    width: '230px',
                    minWidth: '200px', // 最小宽度300px，而非100px
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                }}
                >
                <Row>
                    <Col pull={2} span={24}>
                        <Statistic title={<span>容器</span>} value={0} />
                    </Col>
                    
                </Row>
              </Card>
            </Col>              <Col className="gutter-row" md={6}>
              <Card
                bordered={false}
                style={{
                    height: '100px',
                    width: '230px',
                    minWidth: '200px', // 最小宽度300px，而非100px
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                }}
                >
                    <Col pull={2} span={24}>
                        <Statistic title={'RASP注入进程'} value={0} />
                    </Col>
                    
              </Card>
            </Col>
            </Row>

          </Card>
          </Col>
      </Row>
      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
            {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
            <Col className="gutter-row" md={24}>
            <Card /*title="主机状态分布" 产生分界线*/
              style={{fontWeight: 'bolder', width: '100%', height:400}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                  <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>入侵告警</h2>
              </div>
              <Row gutter={[6, 6]}>
                <Col span={19}>
                <div style={{
                    // borderTop: '2px solid #E5E6EB',
                    // borderBottom: '2px solid #E5E6EB',
                    // borderLeft: '2px solid #E5E6EB',
                    borderRight: '3px solid #E5E6EB'}}>
                <ResponsiveContainer width="98%" height={300}>
                  <LineChart data={alertData}>
                    <XAxis dataKey="day" />
                    <YAxis hide /> {/* 隐藏 Y 轴 */}
                    <CartesianGrid strokeDasharray="3 3" vertical /> {/* 只显示竖线网格 */}
                    <Tooltip />
                    <Line type="linear" dataKey="value" stroke="#8884d8" strokeWidth={5} />
                  </LineChart>
                </ResponsiveContainer>

                </div>
                </Col>
                <Col span={5}>
                <DataCard
                        title="主机和容器安全告警"
                        value={5}
                        valueItem={[
                          { value: '1', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                          { value: '1', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                          { value: '1', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                          { value: '2', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                        ]}
                        panelId="/app/hcp/rqjc/gjlb"
                        height="85px"
                        width="210px"
                        backgroundColor="#ffffff"
                        navigate={true}
                        showTopBorder={false}
                        showBottomBorder={false}
                        showLeftBorder={false}
                        showRightBorder={false}
                        //onPanelClick={(panelId) => { this.goToPanel('running-processes') }}
                    />
                <DataCard
                        title="应用运行时安全告警"
                        value={3}
                        valueItem={[
                          { value: '1', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                          { value: '1', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                          { value: '1', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                          { value: '0', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                        ]}
                        panelId="/app/ARP/rqjc/gjlb"
                        height="85px"
                        width="210px"
                        backgroundColor="#ffffff"
                        navigate={true}
                        showTopBorder={false}
                        showBottomBorder={false}
                        showLeftBorder={false}
                        showRightBorder={false}
                        //onPanelClick={(panelId) => { this.goToPanel('running-processes') }}
                    />
                <DataCard
                    title="容器集群安全告警"
                        value={2}
                        valueItem={[
                          { value: '0', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                          { value: '0', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                          { value: '0', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                          { value: '2', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                        ]}
                        panelId="/app/CCP/rqjc/gjlb"
                        height="85px"
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
                {/* <Col span={3}>
                  <Title level={4}>主机1告警</Title>
                  {alertStats.types.map((type, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <Text>{type.name}: </Text>
                      <Text>{type.count}</Text>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px' }}>
                    <Text strong>总告警个数: </Text>
                    <Text strong>{alertStats.total}</Text>
                  </div>
                </Col>
                <Col span={3}>
                  <Title level={4}>主机2告警</Title>
                  {alertStats.types.map((type, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <Text>{type.name}: </Text>
                      <Text>{type.count}</Text>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px' }}>
                    <Text strong>总告警个数: </Text>
                    <Text strong>{alertStats.total}</Text>
                  </div>
                </Col> */}
              </Row>

            </Card>
            </Col>
        </Row>
      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
          {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
          <Col className="gutter-row" md={24}>

          <Card /*title="主机状态分布" 产生分界线*/
              style={{fontWeight: 'bolder', width: '100%', height:400}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                  <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>漏洞风险</h2>
              </div>
              <Row gutter={[6, 6]}>
                <Col span={19}>
                <div style={{
                    // borderTop: '2px solid #E5E6EB',
                    // borderBottom: '2px solid #E5E6EB',
                    // borderLeft: '2px solid #E5E6EB',
                    borderRight: '3px solid #E5E6EB'}}>
                <ResponsiveContainer width="98%" height={300}>
                  <LineChart data={alertData}>
                    <XAxis dataKey="day" />
                    <YAxis hide /> {/* 隐藏 Y 轴 */}
                    <CartesianGrid strokeDasharray="3 3" vertical /> {/* 只显示竖线网格 */}
                    <Tooltip />
                    <Line type="linear" dataKey="value" stroke="#8884d8" strokeWidth={5} />
                  </LineChart>
                </ResponsiveContainer>

                </div>
                </Col>
                <Col span={5}>
                <DataCard
                        title="待处理高可利用漏洞"
                        value={5}
                        valueItem={[
                          { value: '1', backgroundColor: '#E53F3F', fontSize: '14px', color: 'white' },
                          { value: '1', backgroundColor: '#846CCE', fontSize: '14px', color: 'white' },
                          { value: '1', backgroundColor: '#FEC746', fontSize: '14px', color: 'white' },
                          { value: '2', backgroundColor: '#468DFF', fontSize: '14px', color: 'white' },
                        ]}
                        panelId="/app/hcp/rqjc/gjlb"
                        height="85px"
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
            <Card /*title="主机状态分布" 产生分界线*/
              style={{fontWeight: 'bolder', width: '100%', height:400}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                  <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>基线风险 Top3</h2>
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
        <Card /*title="OWL 介绍*/
          style={{fontWeight: 'bolder', width: '100%', height:380,backgroundColor:'#ffffff'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
              <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>OWL Security</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 ,fontWeight: 'bold'}}>
              <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '6px' }}>
                OWL Security是一个云原生的基于主机的安全(入侵检测与风险识别)解决方案
              </h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 ,fontWeight: 'bold'}}>
              <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '6px' }}>
                Owl Security is a support cloud-native and base linux host security(Intrusion detection and risk identification)solution
              </h2>
          </div>
          <div style={{ marginBottom: 3}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, marginLeft: 16,fontWeight: 'bold'}}>
              <p><GithubOutlined /> <a 
              style={{ color: '#1964F5' }}
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer">GitHub</a></p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 ,marginLeft: 16,fontWeight: 'bold'}}>
              <p><GlobalOutlined /> <a 
              style={{ color: '#1964F5' }}
              href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">Official website</a></p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 ,marginLeft: 16,fontWeight: 'bold'}}>    
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
        <Card /*title="主机风险扇形图" */
          style={{fontWeight: 'bolder', width: '100%', height:250}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
              <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>主机风险分布</h2>
              <Col pull={0} span={2} style={{ position: 'relative', top: '-5px',right:'220px' }}>
                <Button
                  type="link"
                  style={{ color: '#000' }}
                  icon={<RightOutlined />}
                  onClick={() => this.props.history.push('/app/AssetsCenter/HostInventory')}
                />
              </Col>
          </div>
          <Row gutter={[6, 6]}>
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
                      outerRadius={56} // 如果悬停则扇形半径变大
                      >
                      {alertDataTwo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label value={'待处理告警:'+`${Math.round(alertDataTwo[1].value/(alertDataTwo[0].value+alertDataTwo[1].value)*100)}%`} 
                      position="center" 
                      style={{ fontSize: '14px' }}
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
                      outerRadius={56} // 如果悬停则扇形半径变大
                      >
                      {alertDataThree.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label value={'高可用漏洞:'+`${Math.round(alertDataThree[1].value/(alertDataThree[0].value+alertDataThree[1].value)*100)}%`} 
                      position="center" 
                      style={{ fontSize: '14px' }}
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
                      outerRadius={56} // 如果悬停则扇形半径变大
                      >
                      {alertDataFour.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label value={'待加固基线:'+`${Math.round(alertDataFour[1].value/(alertDataFour[0].value+alertDataFour[1].value)*100)}%`} 
                      position="center" 
                      style={{ fontSize: '14px' }}
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
        <Card /*title="Agent 概览*/
          style={{fontWeight: 'bolder', width: '100%', height:330}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
              <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>Agent概览</h2>
          </div>
          <Row gutter={[6, 6]}>
            <Col className="gutter-row" span={12}>
            <div style={{ marginBottom: '20px' }}>
              <DataCard
                      title="在线 Agent"
                      value={0}
                      valueItem={[]}
                      panelId=""
                      height="100px"
                      width="170px"
                      backgroundColor="#F6F7FB"
                      navigate={true}
                      showTopBorder={false}
                      showBottomBorder={false}
                      showLeftBorder={false}
                      showRightBorder={false}/>
                      </div>
              <DataCard
                      title="离线 Agent"
                      value={0}
                      valueItem={[]}
                      panelId=""
                      height="100px"
                      width="170px"
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
                      value={"0%"}
                      valueItem={[]}
                      panelId=""
                      height="100px"
                      width="170px"
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
                      width="170px"
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
        <Card /*title="后端服务状态*/
          style={{fontWeight: 'bolder', width: '100%', height:440}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
              <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>后端服务状态</h2>
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
                      width="170px"
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
                      width="170px"
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
                      width="170px"
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
                      width="170px"
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
    }
}

export default withRouter(Dashboard);