/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import './card.less'; // 确保路径正确
import { Row, Col, Card, Statistic,Typography } from 'antd';
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
      <Row gutter={[12, 6]} >
    <Col className="gutter-row" md={18}>    
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
                        <Statistic title={<span>主机</span>} value={13} />
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
                        <Statistic title={<span>集群</span>} value={13} />
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
                        <Statistic title={<span>容器</span>} value={13} />
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
                        <Statistic title={'RASP注入进程'} value={13} />
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
                          <Statistic title={<span>主机</span>} value={13} />
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
                          <Statistic title={<span>集群</span>} value={13} />
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
                          <Statistic title={<span>容器</span>} value={13} />
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
                          <Statistic title={'RASP注入进程'} value={13} />
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
                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>漏洞风险</h2>
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
                        <Statistic title={<span>主机</span>} value={13} />
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
                        <Statistic title={<span>集群</span>} value={13} />
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
                        <Statistic title={<span>容器</span>} value={13} />
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
                        <Statistic title={'RASP注入进程'} value={13} />
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
                  <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>基线风险 Top3</h2>
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
                          <Statistic title={<span>主机</span>} value={13} />
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
                          <Statistic title={<span>集群</span>} value={13} />
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
                          <Statistic title={<span>容器</span>} value={13} />
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
                          <Statistic title={'RASP注入进程'} value={13} />
                      </Col>
                      
                </Card>
              </Col>
              </Row>

            </Card>
            </Col>
      </Row>       
    </Col>     
    <Col className="gutter-row" md={6}>
      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
        {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
        <Col className="gutter-row" md={24}>
        <Card /*title="主机状态分布" 产生分界线*/
          style={{fontWeight: 'bolder', width: '100%', height:350}}>
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
                        <Statistic title={<span>主机</span>} value={13} />
                    </Col>
                    
                </Row>
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
          style={{fontWeight: 'bolder', width: '100%', height:350}}>
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
                        <Statistic title={<span>主机</span>} value={13} />
                    </Col>
                    
                </Row>
              </Card>
            </Col>

          </Row>
        </Card>
        </Col>
      </Row>      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
        {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
        <Col className="gutter-row" md={24}>
        <Card /*title="主机状态分布" 产生分界线*/
          style={{fontWeight: 'bolder', width: '100%', height:350}}>
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
                        <Statistic title={<span>主机</span>} value={13} />
                    </Col>
                    
                </Row>
              </Card>
            </Col>

          </Row>
        </Card>
        </Col>
      </Row>      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
        {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
        <Col className="gutter-row" md={24}>
        <Card /*title="主机状态分布" 产生分界线*/
          style={{fontWeight: 'bolder', width: '100%', height:350}}>
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
                        <Statistic title={<span>主机</span>} value={13} />
                    </Col>
                    
                </Row>
              </Card>
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

export default Dashboard;
