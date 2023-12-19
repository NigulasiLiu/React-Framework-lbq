/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import './card.less'; // 确保路径正确
import { Row, Col, Card, Timeline,Typography } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { HashRouter as Router, Route, Switch, Redirect,Link } from 'react-router-dom';
import { PieChart, Pie, Cell,Label, LineChart, TooltipProps, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
// import {
//     CameraOutlined,
//     CloudOutlined,
//     HeartOutlined,
//     MailOutlined,
//     SyncOutlined,
// } from '@ant-design/icons';
const { Title, Text } = Typography;


const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ddd' }}>
          <Text>{data.name}: {data.value}</Text>
        </div>
      );
    }
  
    return null;
  };

class Dashboard extends React.Component {
    
    render() {
        const alertData = [
            { day: '01', value: 1 },
            { day: '02', value: 2 },
            // ...每天的数据
            { day: '07', value: 5 },
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

          const alertDataOne = [
            { name: '待处理告警', value: 16, color: '#0088FE' },
            { name: '已处理告警', value: 35, color: '#00C49F' },
          ];
      
          // 第二类告警的数据集
          const alertDataTwo = [
            { name: '待处理告警', value: 75, color: '#FFBB28' },
            { name: '已处理告警', value: 25, color: '#FF8042' },
          ];

          // 第三类告警的数据集
          const alertDataThree = [
            { name: '待处理告警', value: 175, color: '#0FBB28' },
            { name: '已处理告警', value: 25, color: '#0F8042' },
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
      
  return (
           
    <div className="gutter-example button-demo">
        <BreadcrumbCustom />
        <Row gutter={10}>
            {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
            <Col className="gutter-row" md={6}>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <div className="card-content">
                            <div className="text-muted"><Link to="/app/ui/buttons">主机</Link></div>
                            <h2>0</h2>
                        </div>
                    </Card>
                </div>
            </Col>
            <Col className="gutter-row" md={6}>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <div className="card-content">
                            <div className="text-muted"><Link to="/app/ui/buttons">集群</Link></div>
                            <h2>0</h2>
                        </div>
                    </Card>
                </div>
            </Col>
            <Col className="gutter-row" md={6}>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <div className="card-content">
                        <div className="text-muted"><Link to="/app/ui/buttons">容器</Link></div>
                            <h2>0</h2>
                        </div>
                    </Card>
                </div>
            </Col>
            <Col className="gutter-row" md={6}>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <div className="card-content">
                        <div className="text-muted"><Link to="/app/ui/buttons">RASP注入进程</Link></div>
                            <h2>0</h2>
                        </div>
                    </Card>
                </div>
            </Col>
            </Row>
            
    
    <Card title="入侵报警" extra={<Text type="secondary">近7天</Text>} style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={15}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertData}>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Col>
          {/* <Row gutter={10}> */}
          <Col span={3}>
            <Title level={4}>主机告警</Title>
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
          </Col>
          {/* </Row> */}
        </Row>
      </Card>

      <Row gutter={4}>
      <Col span={12}>
      <Card title="主机风险分布" style={{ width: '100%' }}>
        <Row gutter={1}>
        <Col span={8}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDataOne}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertDataOne.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label value={'待处理告警：'+`${Math.round(alertDataOne[0].value/(alertDataOne[0].value+alertDataOne[1].value)*100)}%`} position="center" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col span={8}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDataTwo}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertDataTwo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label value={'高危漏洞：'+`${Math.round(alertDataTwo[0].value/(alertDataTwo[0].value+alertDataTwo[1].value)*100)}%`} position="center" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col span={8}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDataThree}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertDataThree.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label value={'待加固基线：'+`${Math.round(alertDataThree[0].value/(alertDataThree[0].value+alertDataThree[1].value)*100)}%`} position="center" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card>
      </Col>
                    
      <Col span={12}>
      <Card title="入侵报警" extra={<Text type="secondary">近7天</Text>} style={{ width: '100%' }}>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertData}>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          {/* <Row gutter={10}> */}
          {/* </Row> */}
      </Card>
      </Col>
      </Row>      

            </div>
        );
    }
}

export default Dashboard;
