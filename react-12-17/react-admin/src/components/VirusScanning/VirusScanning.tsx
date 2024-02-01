
import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker, Statistic } from 'antd';
import moment, { Moment } from 'moment';
import DataDisplayTable from '../AssetsCenter/DataDisplayTable'
import MySidebar from '../HostProtection/MySidebar';
import CustomPieChart from '../charts/CustomPieChart';
import { StatusItem, virusscanningColumns } from '../../utils/tableUtils';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';

interface VirusScanningProps {
  hostID:string;
  pageWidth?:number
};
interface VirusScanningState{
  count: number;
  deleteIndex: number | null;
  currentTime: string;
  activeIndex: any;

  isSidebarOpen: boolean;
  riskItemCount: number;
};




interface StatusPanelProps {
  statusData: StatusItem[];
  orientation: 'vertical' | 'horizontal'; // 添加方向属性
}

const StatusPanel: React.FC<StatusPanelProps> = ({ statusData, orientation }) => {
  const containerStyle: React.CSSProperties = {
    //border:'5px solid black',
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
            marginRight: '8px'
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

class VirusScanning extends React.Component<VirusScanningProps, VirusScanningState> {
  constructor(props: any) {
    super(props);
    this.columns = [];
    this.state = {
      count: 2,
      deleteIndex: -1,
      activeIndex:[-1,-1,-1,-1],
      isSidebarOpen: false,
      currentTime: '2023-12-28 10:30:00', // 添加用于存储当前时间的状态变量
      riskItemCount: 5, // 初始化风险项的数量
    };
  }
  columns: any;

  toggleSidebar = () => {
    this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    this.setCurrentTime();
  };
  closeSidebar = () => {
    this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
  };
  setCurrentTime = () => {
    const now = new Date();
    // 格式化时间为 YYYY-MM-DD HH:MM:SS
    const formattedTime = now.getFullYear() + '-' +
                          ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
                          ('0' + now.getDate()).slice(-2) + ' ' +
                          ('0' + now.getHours()).slice(-2) + ':' +
                          ('0' + now.getMinutes()).slice(-2) + ':' +
                          ('0' + now.getSeconds()).slice(-2);
    this.setState({ currentTime: formattedTime });
  };

  handleMouseEnter = (_: any, index: number) => {
    // 使用 map 来更新数组中特定索引的值
    this.setState(prevState => ({
      activeIndex: prevState.activeIndex.map((val: number, i: number) => (i === index ? index : val)),
    }));
  };

  handleMouseLeave = () => {
    // 重置所有索引为 -1
    this.setState({
      activeIndex: this.state.activeIndex.map(() => -1),
    });
  };


  render() {
    const { isSidebarOpen, currentTime } = this.state;
    // Conditional button style

    const virusstatusData: StatusItem[] = [
        { color: '#EA635F', label: '紧急 ', value: 7 },
        { color: '#FEC746', label: '中风险 ', value: 2 },
        { color: '#846CCE', label: '高风险 ', value: 5 },
        { color: '#468DFF', label: '低风险 ', value: 1 },
        ];
    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', width: this.props.pageWidth ? this.props.pageWidth : '1320', }}>
        <Row gutter={[12, 6]}/*(列间距，行间距)*/>
          <Col className="gutter-row" span={24}>    
            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                <Col className="gutter-row" span={24} >
                <Card bordered={false} /*title="主机状态分布" 产生分界线*/
                  style={{fontWeight: 'bolder', width: '100%', height:220}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>病毒扫描</h2>
                  </div>
                  <Row gutter={[6, 6]}>
                    <Col className="gutter-row" span={4} style={{ marginLeft: '15px',marginTop: '10px' }}>
                      <div className="container">
                        <Row gutter={24}>
                          <h2 style={{ fontSize: '16px' }}>最近扫描时间:</h2>
                          <span className="currentTime" style={{ marginRight: '10px',marginBottom:'8px' }}>{currentTime}</span>
                          <Button style={{backgroundColor:'#1664FF',color:'white'}} onClick={this.toggleSidebar}>立即扫描</Button>
                          <Button style={{backgroundColor:'white',color:'black'}}onClick={this.toggleSidebar}>全部扫描任务</Button>
                        </Row>
                        <div className={isSidebarOpen ? "overlay open" : "overlay"} onClick={this.closeSidebar}></div>
                        <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
                          <button onClick={this.toggleSidebar} className="close-btn">&times;</button>
                          <MySidebar
                            statusData={virusstatusData}
                            isSidebarOpen={this.state.isSidebarOpen}
                            toggleSidebar={this.toggleSidebar}
                            riskItemCount={this.state.riskItemCount} // 传递风险项的数量
                          />
                        </div>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={9}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '470px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row style={{ width: '100%',marginTop: '0px',paddingRight: '10px' }}>
                            <Col span={8} style={{ paddingTop:'20px',width:'400px',height:'90px'}}>
                                <Statistic title={<span>待处理告警</span>} value={1} />
                            </Col>
                            <Col span={9} style={{ width:'400px'}}>
                              
                            <CustomPieChart
                            data={virusstatusData}
                            innerRadius={24}
                            outerRadius={30}
                            deltaRadius={2}
                            //cardWidth={200}
                            cardHeight={90}
                            hasDynamicEffect={true}
                            />
                            </Col>
                            <Col span={7} style={{ width:'400px',height:'100px',paddingTop:'5px'}}>
                                <StatusPanel statusData={virusstatusData} orientation="vertical" />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col>
                    <Col className="gutter-row" span={5}>
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
                            <Col pull={2} span={24} style={{ marginRight: '50px'}}>
                                <Statistic title={<span>累计处理告警</span>} value={0} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col>              
                    <Col className="gutter-row" span={5}style={{ marginLeft: '10px' }}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '240px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24} style={{ marginRight: '50px'}}>
                                <Statistic title={<span>白名单规则数</span>} value={0} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col> 
                  </Row>

                </Card>
                </Col>
            </Row>
          </Col>  
          <Col span={24}>
              <div className="gutter-box">
              <Card bordered={false}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontWeight: 'bold', marginLeft: '6px' }}>扫描结果</h2>
                  </div>
                  <FetchAPIDataTable
                      apiEndpoint="http://localhost:5000/api/files/vulnerability"
                      timeColumnIndex={[]}
                      columns={virusscanningColumns}
                      currentPanel="vulnerabilityDetect"
                  />
                  </Card>
              </div>
          </Col>

        </Row>
      </div>
    );
  }
}


export default VirusScanning;