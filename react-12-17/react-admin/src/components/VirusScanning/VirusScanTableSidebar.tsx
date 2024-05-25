import React from 'react';
import { Row, Col,Card,Typography ,} from 'antd';
import { StatusItem,virusscannigAllTasksColumns } from '../Columns';
import FetchDataForElkeidTable from '../OWLTable/FetchDataForElkeidTable';
const { Text } = Typography;

interface VirusScanTableSidebarState {
isSidebarOpen: boolean;
statusData:StatusItem[]
}
// 定义 VirusScanTableSidebar 组件的 Props 类型
interface VirusScanTableSidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    sidebarWidth?:number
  }
class VirusScanTableSidebar extends React.Component<VirusScanTableSidebarProps,VirusScanTableSidebarState> {
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
  
//   renderStatusList = () => {
//     return this.props.statusData.map((item, index) => (
//         <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '18px',marginLeft: '6px'}}>
//           <span style={{
//             height: '15px',
//             width: '15px',
//             backgroundColor: item.color,
//             borderRadius: '50%',
//             display: 'inline-block',
//             marginRight: '10px',
//           }}></span>
//           <span style={{ flexGrow: 1, fontSize: '14px' }}>{item.label}</span>
//           <span>{item.value}</span>
//         </div>
//       ));
//   };

  render() {
    const { isSidebarOpen, toggleSidebar } = this.props;
    const vulnerName=' Sudo 本地权限提升漏洞(CVE-2021-23240) ';

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
    const data = {
    '漏洞名称': 'Sudo 本地权限提升漏洞',
    '漏洞编号': 'CVE-2021-23240',
    '漏洞类型': '文件访問前链接解析不正确',
    '风险级别': '高危',
    '是否有exp': '是',};
    const data1={
        '漏洞概述': '本地非特权用户可以通过将临时文件替换为任意文件目标的符号链接来获取文件所有权和提升特权。这会影响许可模式下的SELinux RBAC支持。没有SELinux的机器不容易受到攻击。',
        }
    const sidebartablewidth=this.props.sidebarWidth?this.props.sidebarWidth:490;
    return (
        <div className={isSidebarOpen ? "Largersidebar open" : "Largersidebar"}>
            <Col md={24} style={{borderTop: '5px solid #4086FF'}}>
            <Row>
                <Card style={{width: '100%', borderTop:'1px solid black',}}>
                    <Row style={{borderTop:'1px solid #E5E8EF' ,}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 ,marginBottom: 10 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'16px',fontWeight: 'bold', marginLeft: '0px'}}>全部扫描任务</h2>
                        </div>
                        <div style={{ maxWidth: sidebartablewidth, width: '100%', margin: '0 auto'}}>
                            {/*<FetchDataForElkeidTable*/}
                            {/*    apiEndpoint="http://localhost:5000/api/vulnerdetailpage"*/}
                            {/*    timeColumnIndex={['foundtime']}*/}
                            {/*    columns={virusscannigAllTasksColumns}*/}
                            {/*    currentPanel="virusscanninglargesidebar"*/}
                            {/*/>*/}
                        </div>
                    </Row>
                </Card>
            </Row>
            </Col>
        </div>
        );
        }
  }
  
  export default VirusScanTableSidebar;