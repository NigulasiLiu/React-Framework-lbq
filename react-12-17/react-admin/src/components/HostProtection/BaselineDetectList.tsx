import zhCN from 'antd/es/locale/zh_CN';
import DataDisplayTable from '../ContextAPI/DataDisplayTable'
import { Tooltip } from 'antd';
import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker, ConfigProvider,Statistic } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import moment, { Moment } from 'moment';
import BaseLineDetectScanSidebar from './ScanProcessSidebar';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';
import { baselineDetectColumns, BaseLineDataType, StatusItem } from '../tableUtils';

const { RangePicker } = DatePicker;
type RangeValue<T> = [T | null, T | null] | null;
const { Search } = Input;

type HostInventoryProps = {};
type HostInventoryState = {
  count: number;
  deleteIndex: number | null;
  currentTime: string;
  selectedRowKeys: React.Key[];
  selectedDateRange: [string | null, string | null];
  activeIndex: any;
  areRowsSelected: boolean;
  isSidebarOpen: boolean;
  riskItemCount:number;
};



// Define an interface for the props expected by the StatusPanel component
interface StatusPanelProps {
  statusData: StatusItem[];
}
export const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
  return (
    //<div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>      
    <div style={{ fontFamily: 'YouYuan, sans-serif' }}>
      {statusData.map((status, index) => (
        <div key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ height: '10px', width: '10px', backgroundColor: status.color, borderRadius: '50%', display: 'inline-block', marginRight: '16px' }}></span>
          <span style={{ marginRight: 'auto', paddingRight: '8px' }}>{status.label}</span>
          <span>{status.value}</span>
        </div>
      ))}
    </div>//</div>

  );
};

class BaselineDetectList extends React.Component<HostInventoryProps, HostInventoryState> {
  constructor(props: any) {
    super(props);
    this.columns = [];
    this.state = {
      count: 2,
      deleteIndex: -1,
      activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
      selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
      areRowsSelected: false,
      selectedDateRange: [null, null],
      isSidebarOpen: false,
      currentTime: '2023-12-28 10:30:00', // 添加用于存储当前时间的状态变量
      riskItemCount:5,
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

  onSelectChange = (selectedRowKeys: React.Key[]) => {
    this.setState({
      selectedRowKeys,
      areRowsSelected: selectedRowKeys.length > 0,
    });
  };
  // Define the rowSelection object inside the render method



  renderRowSelection = () => {
    return {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys });
      },
      // Add other rowSelection properties and methods as needed
    };
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
    const { isSidebarOpen, selectedDateRange, currentTime } = this.state;
    // Conditional button style

    const scanResult: StatusItem[] = [
      { color: 'green', label: '通过项', value: 7 },
      { color: '#E53F3F', label: '严重风险项', value: 2 },
      { color: '#846BCE', label: '高危风险项', value: 5 },
      { color: '#FEC745', label: '中危风险项', value: 1 },
      { color: '#468DFF', label: '低危风险项', value: 1 },
    ];
    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
        <Row gutter={[12, 6]}/*(列间距，行间距)*/>
          
        <Col className="gutter-row" md={24}>    
            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                <Col className="gutter-row" md={24}>
                <Card bordered={false} /*title="主机状态分布" 产生分界线*/
                  style={{fontWeight: 'bolder', width: '100%', height:220}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>基线概览</h2>
                  </div>
                  <Row gutter={[6, 6]}>
                    <Col className="gutter-row" md={6} style={{ marginLeft: '15px',marginTop: '10px'  }}>
                    {/* <h2>最近扫描时间（每日自动扫描）</h2> */}
                    <div className="container" style={{
                    // borderTop: '2px solid #E5E6EB',
                    // borderBottom: '2px solid #E5E6EB',
                    // borderLeft: '2px solid #E5E6EB',
                    borderRight: '2px solid #E5E6EB'}}>
                      <Row gutter={24}>
                      <h2 style={{ fontSize: '16px' }}>最近扫描时间（每隔一日自动扫描）</h2>
                      <span className="currentTime" style={{ marginRight: '10px' }}>{currentTime}</span>
                      <Button style={{backgroundColor:'#1664FF',color:'white'}} onClick={this.toggleSidebar}>立即扫描</Button>
                      </Row>
                      <div className={isSidebarOpen ? "overlay open" : "overlay"} onClick={this.closeSidebar} />
                      <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
                      <button onClick={this.toggleSidebar} className="close-btn">&times;</button>
                          <BaseLineDetectScanSidebar
                            scanInfo={['基线检查','基线扫描中，请稍后',"返回基线列表，查看详情"]}
                            statusData={scanResult}
                            isSidebarOpen={this.state.isSidebarOpen}
                            toggleSidebar={this.toggleSidebar}
                            riskItemCount={this.state.riskItemCount} // 传递风险项的数量
                          />
                      </div>
                    </div>
                    </Col>
                    <Col className="gutter-row" md={4}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '240px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24}>
                                <Statistic title={<span>最近检查通过率</span>} value={1} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col>
                    <Col className="gutter-row" md={4}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '240px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24}>
                                <Statistic title={<span>检查主机数</span>} value={0} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col>              
                    <Col className="gutter-row" md={4}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '240px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24}>
                                <Statistic title={<span>检查项</span>} value={0} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col> 
                  </Row>

                </Card>
                </Col>
            </Row>
          </Col>  
          <Col md={24}>
              <div className="gutter-box">
              <Card bordered={false}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontWeight: 'bold', marginLeft: '0px' }}>基线内容</h2>
                  </div>
                  {/* <DataDisplayTable
                      apiEndpoint="http://localhost:5000/api/files/log"
                      sqlTableName='windows_security_checks'
                      columns={baselineDetectColumns}
                      currentPanel={"BaseLineDetectDetect"}
                      selectedRowKeys={this.state.selectedRowKeys}
                      onSelectChange={(keys: any) => this.onSelectChange(keys)}
                  /> */}
                  <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/api/baseline_check/linux"
                    timeColumnIndex={['last_checked']}
                    columns={baselineDetectColumns}
                    currentPanel="baseline_check_linux"
                    />
                  </Card>
              </div>
          </Col>

        </Row>
      </div>
    );
  }
}





export default BaselineDetectList;