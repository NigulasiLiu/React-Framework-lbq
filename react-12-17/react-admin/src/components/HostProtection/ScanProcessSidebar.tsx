import React from 'react';
import { Row, Col,Card,Button} from 'antd';
import { StatusItem } from '../tableUtils';
import { CloseCircleOutlined } from '@ant-design/icons';
import CustomLoader from './CustomLoader';
import scanguard from '../../style/imgs/scanguard.png'
import LoadingBar from './LoaderBar';


interface ScanProcessSidebarState {
  isSidebarOpen: boolean;
  statusData:StatusItem[]


  isLoading: boolean; // 添加 isLoading 状态
  scanProgress: number; // 添加 scanProgress 状态
}
// 定义 ScanProcessSidebar 组件的 Props 类型
interface ScanProcessSidebarProps {
    riskItemCount: number; // 添加风险项数量的prop类型声明
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    statusData: StatusItem[];

    currenthostnums?:number;
    
    hostlist?:string[];

    scanInfo:string[];
    
  }
class ScanProcessSidebar extends React.Component<ScanProcessSidebarProps,ScanProcessSidebarState> {
  constructor(props:any) {
    super(props);
    this.state = {
      isLoading: false, // 初始化 isLoading 为 false
      scanProgress: 0, // 初始化 scanProgress 为 0
      isSidebarOpen: false,
      statusData: [
        { label: '通过项', value: 0, color: 'green' },
        { label: '严重风险项', value: 2, color: '#E53F3F' },
        { label: '高风险项', value: 3, color: 'orange' },
        { label: '中风险项', value: 2, color: 'yellow' },
        { label: '低风险项', value: 0, color: 'blue' },
      ],
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
  handleScanButtonClick = () => {
    // 开始扫描，设置 isLoading 为 true，scanProgress 为 0
    this.setState({ isLoading: true, scanProgress: 0 });

    // 模拟扫描进度增加
    const interval = setInterval(() => {
      if (this.state.scanProgress < 100) {
        // 逐步增加 scanProgress
        this.setState((prevState) => ({
          scanProgress: prevState.scanProgress + 10,
        }));
      } else {
        // 扫描完成，清除定时器，设置 isLoading 为 false
        clearInterval(interval);
        this.setState({ isLoading: false });
      }
    }, 500); // 每秒增加一次进度
  };
  toggleSidebar = () => {
    this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
  };
  
  renderStatusList = () => {
    return this.props.statusData.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '18px',marginLeft: '6px'}}>
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
    const buttonstyle1={
        width: '400px',
        height: '35px',
        color: '#527ED5',
        border: '1px solid #527ED5',
        backgroundColor: 'white',
        // 由于按钮高度较小，可能需要调整字体大小或内边距来改善显示
        fontSize: '13px', // 根据需要调整字体大小
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
        <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
            <Col md={24} style={{borderTop: '5px solid #4086FF'}}>
            <Card 
            style={{fontWeight: 'bolder', width: '100%', height:800}}>
            <Row>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 ,fontWeight: 'bold'}}>
                  <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>{this.props.scanInfo[0]}</h2>
              </div>
              <button onClick={this.handleScanButtonClick} className="close-btn">重新扫描</button>
            </Row>
            <Row style={{ width: '100%', marginTop: '0px', paddingRight: '10px' }}>
                <Col span={6} style={{ paddingTop: '20px', width: '400px', }}>
                <img src={scanguard} alt="shield icon" className="heartbeat-animation" style={{ width: '75px', height: '75px',marginLeft:'15px',marginTop:'-7px'}}/>
                </Col>
                <Col span={17} style={{ paddingTop: '20px', width: '400px', }}>
                  {this.state.isLoading && (
                      <React.Fragment>
                      <Row>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 ,fontWeight: 'bold'}}>
                          <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '0px' }}>{this.props.scanInfo[1]}</h2>
                        </div>
                      </Row>
                      </React.Fragment>)}
                  {!this.state.isLoading && (
                      <React.Fragment>
                      <Row>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 ,fontWeight: 'bold'}}>
                          <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '0px' }}>检查完成</h2>
                        </div>
                      </Row>
                      </React.Fragment>)}
                  <Row>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 ,fontWeight: 'bold'}}>
                      <h2 style={{ color:'grey',fontSize:'12px',fontWeight: 'bold', marginLeft: '0px' }}>进度:{this.state.scanProgress}%</h2>
                    </div>
                  </Row>
                </Col>
                <Col span={1} style={{ paddingTop: '10px', width: '400px', }}>
                <Button onClick={toggleSidebar} style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  outline: 'none',}}>
                <CloseCircleOutlined /> 
                </Button>

                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ marginLeft:'25px',marginTop: '10px', marginBottom:'10px',maxWidth: '400px', }}>
                  {/* <LoadingBar/> */}
                  <CustomLoader isLoading={this.state.isLoading} scanProgress={this.state.scanProgress} />
                </Col>
            </Row>
            {!this.state.isLoading && (
                <React.Fragment>
                <Row gutter={15} style={{marginLeft: '6px'}}>
                <div>本次检查出 {this.props.riskItemCount} 个风险项</div>
                </Row>
                <Row gutter={15} style={{marginLeft: '6px'}}>
                <div style={{marginTop: '12px',marginBottom: '6px',marginLeft: '15px',alignItems:'center'}}>
                    <button style={buttonstyle1} onClick={toggleSidebar}>{this.props.scanInfo[2]}</button>
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