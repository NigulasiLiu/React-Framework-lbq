import React from 'react';
import { Row, Col, Card, Button,Spin } from 'antd';
import { StatusItem } from '../Columns';
import { CloseCircleOutlined } from '@ant-design/icons';
import CustomLoader from '../CustomAntd/CustomLoader';
import scanguard from '../../style/imgs/scanguard.png'


interface ScanProcessSidebarState {
  isSidebarOpen: boolean;

  isLoading: boolean; // 添加 isLoading 状态
  scanProgress: number; // 添加 scanProgress 状态
}
// 定义 ScanProcessSidebar 组件的 Props 类型
interface ScanProcessSidebarProps {
  riskItemCount: number; // 添加风险项数量的prop类型声明
  hostCount:number;
  statusData: StatusItem[];

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  scanInfo: string[];

}
class ScanProcessSidebar extends React.Component<ScanProcessSidebarProps, ScanProcessSidebarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false, // 初始化 isLoading 为 false
      scanProgress: 0, // 初始化 scanProgress 为 0
      isSidebarOpen: false,
    };
  }
  componentDidMount() {
    // 如果初始时侧边栏是打开的，就开始扫描
    if (this.props.isSidebarOpen) {
      this.handleScanButtonClick();
    }
  }

  componentDidUpdate(prevProps: ScanProcessSidebarProps) {
    // 如果侧边栏从关闭变为打开状态，开始扫描
    if (!prevProps.isSidebarOpen && this.props.isSidebarOpen) {
      this.handleScanButtonClick();
    }
  }
  // handleScanButtonClick = () => {
  //   // 开始扫描，设置 isLoading 为 true，scanProgress 为 0
  //   this.setState({ isLoading: true, scanProgress: 0 });
  //   const randomInterval = Math.floor(Math.random()) + 150; // 生成 500 到 1000 之间的随机时间间隔
  //
  //   // 模拟扫描进度增加
  //   const progressInterval = setInterval(() => {
  //     if (this.state.scanProgress < 100) {
  //       // 平滑递增，每次增加0.5到2之间的随机值
  //       const randomIncrement = Math.random() * 1.5 + 0.5;
  //       this.setState((prevState) => ({
  //         scanProgress: Math.min(prevState.scanProgress + randomIncrement, 100),
  //       }));
  //     } else {
  //       // 扫描完成，清除定时器，更新状态
  //       clearInterval(progressInterval);
  //       this.setState({ isLoading: false });
  //     }
  //   }, randomInterval);
  //
  // };
  handleScanButtonClick = () => {
    // 开始扫描，设置 isLoading 为 true，scanProgress 为 0
    this.setState({ isLoading: true, scanProgress: 0 });
    const randomInterval = Math.floor(Math.random()) + 250; // 生成 150 到 151 之间的随机时间间隔

    // 模拟扫描进度增加
    const progressInterval = setInterval(() => {
      if (this.state.scanProgress < 100) {
        // 平滑递增，每次增加0.5到2之间的随机值
        const randomIncrement = Math.random() * 1.5 + 0.5;

        // 有一定概率触发大跳变
        const shouldJump = Math.random() < 0.2; // 20% 的概率触发大跳变
        const bigJump = Math.random() * 2 + 2; // 大跳变的增量

        if (shouldJump) {
          this.setState((prevState) => ({
            scanProgress: Math.min(prevState.scanProgress + bigJump, 100), // 触发大跳变
          }));
        } else {
          this.setState((prevState) => ({
            scanProgress: Math.min(prevState.scanProgress + randomIncrement, 100), // 正常增加进度
          }));
        }
      } else {
        // 扫描完成，清除定时器，更新状态
        clearInterval(progressInterval);
        this.setState({ isLoading: false });
      }
    }, randomInterval);
    // 清理资源
    return () => clearInterval(progressInterval);
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
  };

  renderStatusList = () => {
    return this.props.statusData.map((item, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '18px', marginLeft: '6px' }}>
        <span style={{
          height: '15px',
          width: '15px',
          backgroundColor: item.color,
          borderRadius: '50%',
          display: 'inline-block',
          marginRight: '10px',
        }}></span>
        <span style={{ flexGrow: 1, fontSize: '14px' }}>{item.label}</span>
        <span>{item.value}</span>
      </div>
    ));
  };

  render() {
    const { isSidebarOpen, toggleSidebar } = this.props;
    const returnButton = {
      width: '350px',
      height: '45px',
      color: '#527ED5',
      border: '1px solid #527ED5',
      backgroundColor: 'white',
      // 由于按钮高度较小，可能需要调整字体大小或内边距来改善显示
      fontSize: '14px', // 根据需要调整字体大小
      lineHeight: '14px', // 根据按钮高度调整行高以垂直居中文本
      padding: '1px 6px', // 根据需要调整内边距以确保文本垂直居中
      // 可能还需要其他样式，如圆角、字体族等
      borderRadius: '4px', // 如果您想要圆角边框
      fontFamily: 'Arial, sans-serif', // 根据需要设置字体
      cursor: 'pointer', // 显示为可点击的手型光标
      outline: 'none', // 移除焦点时的轮廓
      // 添加一些边距来避免文本紧贴边框
    }

    return (
      <div>
        <Col md={24} style={{ borderTop: '5px solid #4086FF' }}>
          <Card
            style={{ fontWeight: 'bolder', width: 500, height: 680, border:'2px solid #becffa', justifyContent: 'center' }}>
            <Row>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontWeight: 'bold' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '0px' }}>{this.props.scanInfo[0]}</h2>
              </div>
              {!this.state.isLoading && (
              <button onClick={this.handleScanButtonClick} className="close-btn">重新扫描</button>
                  )}
            </Row>
            <Row style={{ width: '100%', marginTop: '0px', paddingRight: '10px' }}>
              <Col span={6} style={{ paddingTop: '20px', width: '200px', }}>
                <img src={scanguard} alt="shield icon" className="heartbeat-animation" style={{ width: '75px', height: '75px', marginLeft: '15px', marginTop: '-7px' }} />
              </Col>
              <Col span={17} style={{ paddingTop: '20px', width: '200px', }}>
                {this.state.isLoading && (
                  <React.Fragment>
                    <Row>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 'bold' }}>
                        <h2 style={{ fontSize: '17px', fontWeight: 'bold', marginLeft: '0px' }}>{this.props.scanInfo[1]}</h2>
                      </div>
                      <Spin style={{ transform: 'translateX(40%) translateY(10%)'}}/>
                    </Row>
                  </React.Fragment>)}
                {!this.state.isLoading && (
                  <React.Fragment>
                    <Row>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 'bold' }}>
                        <h2 style={{ fontSize: '17px', fontWeight: 'bold', marginLeft: '0px' }}>检查完成</h2>
                      </div>
                    </Row>
                  </React.Fragment>)}
                <Row>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontWeight: 'bold' }}>
                    <h2 style={{ color: 'grey', fontSize: '15px', fontWeight: 'bold', marginLeft: '0px' }}>
                      进度:{this.state.scanProgress === 100 ? '100' : (this.state.scanProgress.toString()[1] === '.' ? this.state.scanProgress.toString().slice(0, 1) : this.state.scanProgress.toString().slice(0, 2))}%
                    </h2>
                  </div>
                </Row>
              </Col>
              <Col span={1} style={{ paddingTop: '10px', width: '200px', }}>
                <Button onClick={toggleSidebar} style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  outline: 'none',
                }}>
                  <CloseCircleOutlined />
                </Button>

              </Col>
            </Row>
            <Row>
              <Col span={22} style={{ marginLeft: '25px', marginTop: '10px', marginBottom: '10px', }}>
                {/* <LoadingBar/> */}
                <CustomLoader isLoading={this.state.isLoading} scanProgress={this.state.scanProgress} />
              </Col>
            </Row>
            {!this.state.isLoading && (
              <React.Fragment>
                <Row gutter={15} style={{ marginLeft: '6px' }}>
                  <div>本次共检查 {this.props.hostCount} 个主机,共 {this.props.riskItemCount} 个风险项</div>
                </Row>
                <Row gutter={15} style={{ marginLeft: '6px' }}>
                  <div style={{ margin: '12px auto', alignItems: 'center' }}>
                    <button style={returnButton} onClick={toggleSidebar}>{this.props.scanInfo[2]}</button>
                  </div>
                </Row>
                {this.renderStatusList()}
              </React.Fragment>)}
          </Card>
        </Col>
      </div>
    );

  }
}

export default ScanProcessSidebar;