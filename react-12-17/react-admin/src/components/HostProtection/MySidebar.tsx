import React from 'react';
import { Row, Col,Card} from 'antd';
import { StatusItem } from '../../utils/tableUtils';
interface MySidebarState {
isSidebarOpen: boolean;
statusData:StatusItem[]
}
// 定义 MySidebar 组件的 Props 类型
interface MySidebarProps {
    riskItemCount: number; // 添加风险项数量的prop类型声明
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    statusData: StatusItem[]; 
  }
class MySidebar extends React.Component<MySidebarProps,MySidebarState> {
  constructor(props:any) {
    super(props);
    this.state = {
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
        width: '300px',
        height: '50px',
        color: '#527ED5',
        border: '1px solid #527ED5',
        backgroundColor: 'white',
        // 由于按钮高度较小，可能需要调整字体大小或内边距来改善显示
        fontSize: '17px', // 根据需要调整字体大小
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>漏洞检查</h2>
            </div>
            <Row gutter={15} style={{marginLeft: '6px'}}>
            <button onClick={toggleSidebar} className="close-btn">×</button>
            <div>本次检查出 {this.props.riskItemCount} 个风险项</div>
            </Row>
            <Row gutter={15} style={{marginLeft: '6px'}}>
            <div style={{marginTop: '8px',marginLeft: '65px'}}>
                <button style={buttonstyle1} onClick={toggleSidebar}>返回漏洞列表，查看详情</button>
            </div>
            </Row>
            {this.renderStatusList()}
            

            </Card>
            </Col>
        </div>
        );
        }
  }
  
  export default MySidebar;