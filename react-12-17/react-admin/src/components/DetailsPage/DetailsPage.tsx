import React from 'react';
import { Row, Col, Card, Menu, Button, Modal,Statistic,} from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { RouteComponentProps, withRouter, Link} from 'react-router-dom';
import HostOverview from './HostOverview';
import CustomPieChart from '../AssetsCenter/CustomPieChart';
import HostDetailsTable from './HostDetailsTable';
import VulnerabilityDetailsSidebar from '../HostProtection/VulnerabilityDetailsSidebar';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';
import {hostalertColumns, fimColumns, baselineDetectColumns, virusscanningColumns} from '../tableUtils';
import AlertList from '../AlertList';
import VirusScanning from '../VirusScanning/VirusScanning';
import PerformanceMonitor from './PerformanceMonitor';
import { DataType } from './DetailsTableColumns'

// Define an interface for the individual status item
interface StatusItem {
    color: string;
    label: string;
    value: number;
}

// Define an interface for the props expected by the StatusPanel component
interface StatusPanelProps {
    statusData: StatusItem[];
}

interface DetailsPageProps extends RouteComponentProps<{ uuid: string }> {
    host_name:string;
  }
interface DetailsPageState {
host_uuid:string;
dataSource: any[];

selectedVulnUuid:string;
ignoredVulnerabilitiesCount:number;
doneVulnerabilitiesCount:number;
// ...其他状态字段
showModal: boolean, // 控制模态框显示
currentRecord: any, // 当前选中的记录
vulnColumns:any[];
isSidebarOpen:boolean;
currentTime: string;

count: number;
deleteIndex: number | null;

selectedRowKeys: React.Key[];
activeIndex: any;
areRowsSelected: boolean;


statusData: StatusItem[]; // 初始状态
currentPanel: string;
// 新增状态字段，记录每个面板的选中行键
panelSelectedRowKeys: {
    [panelName: string]: React.Key[];
};
};


const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
    return (
        //<div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <div style={{ fontFamily: 'YouYuan, sans-serif' }}>
            {statusData.map((status, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: status.color,
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '16px',
                        }}
                    ></span>
                    <span style={{ marginRight: 'auto', paddingRight: '8px' }}>{status.label}</span>
                    <span>{status.value}</span>
                </div>
            ))}
        </div> //</div>
    );
};

const fimColumns_pre = [
    {
        title: '文件名',
        dataIndex: 'filename',
        key: 'filename',
        onHeaderCell: () => ({
            style: {
              minWidth: 100, // 最小宽度100px
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: 'MD5哈希值',
        dataIndex: 'content_md5',
        key: 'content_md5',
    },
    {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '修改时间',
        dataIndex: 'mtime',
        key: 'mtime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
        sorter: (a: any, b: any) => b.mtime - a.mtime,
        //sorter: (a: any, b: any) => new Date(a.mtime).getTime() - new Date(b.mtime).getTime(),
    },
    {
        title: '访问时间',
        dataIndex: 'atime',
        key: 'atime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',                
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
        onHeaderCell: () => ({
            style: {
              minWidth: 100, // 最小宽度100px
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: '文件名哈希值',
        dataIndex: 'filename_md5',
        key: 'filename_md5',
    },
];


class DetailsPage extends React.Component<DetailsPageProps, DetailsPageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            host_uuid: '-1',
            statusData: [], // 初始状态

            showModal: false, // 控制模态框显示
            currentRecord: null, // 当前选中的记录
            selectedVulnUuid: '', // 添加状态来存储当前选中的漏洞 id
            ignoredVulnerabilitiesCount: 0, // 初始化为0或从其他数据源加载的初始值
            doneVulnerabilitiesCount: 0, // 初始化为0或从其他数据源加载的初始值
            isSidebarOpen: false,
            currentTime: '2023-12-28 10:30:00', // 添加用于存储当前时间的状态变量

            dataSource: [],
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图


            currentPanel: 'hostoverview', // 默认选中的面板
            vulnColumns:[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                    title: "主机名称",
                    dataIndex: 'uuid',
                    render: (text: string) => (
                        // 使用模板字符串构造带查询参数的路径,encodeURIComponent 函数确保 text 被正确编码
                        <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
                          <Button style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF'}}>{text.slice(1,4)}</Button>
                        </Link>
                      ),
                },
                {
                  title: '主机IP',
                  dataIndex: 'ip',
                },
                {
                  title: '端口',
                  dataIndex: 'port',
                },
                {
                  title: '扫描时刻',
                  dataIndex: 'scanTime',
                },
                {
                  title: '扫描类型',
                  dataIndex: 'scanType',
                },
                
                {
                    title: "操作",
                    dataIndex: 'operation',
                    
                    render: (text:string, record:any) => (
                        <div>
                        <Button onClick={() => this.toggleModal(record)} className="custom-link-button" 
                        style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',marginRight: '20px',
                        padding:'0 0' }}>忽略</Button>
                        <Button onClick={() => this.toggleDetailSidebar(record.uuid)} className="custom-link-button"
                        style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',
                        padding:'0 0'}}>详情</Button>
                        </div>
                      ),
                },
            ],


            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            panelSelectedRowKeys: {
                HostOverview: [],
                'hostalertlist': [],
                'vulnerabilityalertlist': [],
                'baselineDetectalertlist': [],
                'runningalertlist': [],
                'virusscanning': [],
                'assetfingerprint': [],
                // 根据您的应用添加或删除面板
            },
        };
    }
    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const host_uuid = queryParams.get('uuid');
        this.setState({
            host_uuid : host_uuid?host_uuid:'default',
        });

    }


    toggleModal = (record = null) => {
        this.setState(prevState => ({
          showModal: !prevState.showModal,
          currentRecord: record // 设置当前记录，以便后续操作
        }));
      }
      
      handleOk = async () => {
        // 处理忽略操作
        const record = this.state.currentRecord;
        if (record) {
          // 调用API
          // 假设API调用的逻辑是放在handleIgnoreButtonClick方法中实现的
          await this.handleIgnoreButtonClick(record);
        }
        this.toggleModal(); // 关闭模态框
      }
      
      handleCancel = () => {
        this.toggleModal(); // 关闭模态框
      }
      
      handleIgnoreButtonClick = async (record:any) => {
        try {
          const response = await fetch('apiEndpoint', {
            method: 'POST', // 或 'GET', 根据您的API要求
            headers: {
              'Content-Type': 'application/json',
              // 可能还需要其他头部信息，如认证令牌
            },
            body: JSON.stringify({
              // 这里根据API的需要发送适当的数据
              vulnId: record.id, // 假设每条记录有唯一的id来标识漏洞
            }),
          });
      
          if (1) {
            // 如果API调用成功，更新状态以增加累计忽略的漏洞计数
            this.setState(prevState => ({
              ignoredVulnerabilitiesCount: prevState.ignoredVulnerabilitiesCount + 1,
            }));
          } else {
            // 处理API调用失败的情况
            console.error('API调用失败:', response.statusText);
          }
        } catch (error) {
          console.error('请求错误:', error);
        }
      }
      handleDoneButtonClick = async (record:any) => {
        try {
          const response = await fetch('apiEndpoint', {
            method: 'POST', // 或 'GET', 根据您的API要求
            headers: {
              'Content-Type': 'application/json',
              // 可能还需要其他头部信息，如认证令牌
            },
            body: JSON.stringify({
              // 这里根据API的需要发送适当的数据
              vulnId: record.id, // 假设每条记录有唯一的id来标识漏洞
            }),
          });
      
          if (1) {
            // 如果API调用成功，更新状态以增加累计忽略的漏洞计数
            this.setState(prevState => ({
              doneVulnerabilitiesCount: prevState.doneVulnerabilitiesCount + 1,
            }));
          } else {
            // 处理API调用失败的情况
            console.error('API调用失败:', response.statusText);
          }
        } catch (error) {
          console.error('请求错误:', error);
        }
      }
      renderModal = () => {
        return (
          <>
            <Modal
              title="确认操作"
              visible={this.state.showModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button key="submit" style={{backgroundColor:'#1664FF',color:'white'}} onClick={this.handleOk}>
                  是
                </Button>,
              ]}
            //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
            >
              确认忽略选中的漏洞？
            </Modal>
          </>
        );
      };
      
      toggleSidebar = () => {
        this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
        this.setCurrentTime();
      };
    
      toggleDetailSidebar = (uuid:string) => {
        this.setState(prevState => ({
            isSidebarOpen: !prevState.isSidebarOpen,
            selectedVulnUuid: uuid,
        }));
        this.setCurrentTime();
        //message.info('selectedVulnUuid:'+uuid);
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
    changePanel = (panelName: string) => {
        this.setState({ currentPanel: panelName });
    };
    //为不同panel的勾选框设置状态
    onSelectChange = (selectedKeys: React.Key[], panel: string) => {
        // 根据panel来设置对应的选中行keys
        this.setState((prevState) => ({
            panelSelectedRowKeys: {
                ...prevState.panelSelectedRowKeys,
                [panel]: selectedKeys,
            },
        }));
    };

    columns: any;
    // 点击Menu.Item时调用的函数
    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };

    setStatusData() {
        // 本地定义的StatusItem数据
        const localStatusData: StatusItem[] = [
            { label: 'Created', value: 7, color: '#22BC44' }, //GREEN
            { label: 'Running', value: 2, color: '#FBB12E' }, //ORANGE
            { label: 'Exited', value: 5, color: '#EA635F' }, //RED
            { label: 'Unknown', value: 1, color: '#E5E8EF' }, //GREY
        ];

        // 更新状态
        this.setState({ statusData: localStatusData });
    }

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
        this.setState((prevState) => ({
            activeIndex: prevState.activeIndex.map((val: number, i: number) =>
                i === index ? index : val
            ),
        }));
    };
    handleMouseLeave = () => {
        // 重置所有索引为 -1
        this.setState({
            activeIndex: this.state.activeIndex.map(() => -1),
        });
    };
    handleExport = () => {
      const { dataSource, selectedRowKeys } = this.state;
  
      // 过滤出已选中的行数据
      const selectedData = dataSource.filter(row =>
          selectedRowKeys.includes(row.key)
      );
  
      // 检查是否有选中的行
      if (selectedData.length === 0) {
          alert('没有选中的行');
          return;
      }
  
      // 假设您希望导出的CSV中包括所有字段
      const headers = Object.keys(selectedData[0]).join(',');
      const rows = selectedData.map(row => {
          const riskValues = Object.values(row.risks).join(',');
          return `${row.key},${row.host_name},${row.label},${row.group},${row.OStype},${riskValues},${row.status},${row.clientUsage},${row.updateTime}`;
      });
      const csvData = [headers, ...rows].join('\n');
  
      // 触发下载
      const element = document.createElement('a');
      element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
      element.download = this.state.currentPanel+'_export.csv';
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };
  

renderList=(apiEndpoint:string, uuid:string, timeColumnIndex:string[], columns:any[], currentPanel:string, title:string)=>{
    if(uuid!==undefined){
            return (
                <div style={{ width: '100%' }}>
                <Col className="gutter-row" md={24} style={{ width: '100%',maxWidth:2640,border:'false'}}>
                    <Row gutter={[8, 16]} style={{ marginTop: '-21px',marginLeft: '-8px' }}>
                        <Col md={24}>
                                <Card bordered={false}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</h2>
                                    </div>
                                    <FetchAPIDataTable
                                    apiEndpoint={apiEndpoint+uuid}
                                    timeColumnIndex={timeColumnIndex}
                                    columns={columns}
                                    currentPanel={currentPanel}
                                    />
                                </Card>
                        </Col>
                    </Row>
                </Col>
                </div>
            );
    }
    return (
        <div>
            Loading...
        </div>
    );
}

    renderCurrentPanel() {
                //扇形图数据
                const vulDataOne:StatusItem[] = [
                    { label: '严重', value: 1, color: '#E63F3F' },
                    { label: '高危', value: 1, color: '#846BCE' },
                    { label: '中危', value: 1, color: '#FEC745' },
                    { label: '低危', value: 1, color: '#468DFF' }
                ];
        const { currentPanel } = this.state;
    
        switch (currentPanel) {
            case 'HostOverview':
                return (
                    <HostOverview
                        changePanel={this.changePanel}
                    />
                );      
            case 'hostalertlist':
                return (
                    <div style={{marginTop:'-20px'}}>
                    <AlertList
                        apiEndpoint={"http://localhost:5000/api/files/logs/hostalertlist/host_1"}
                        columns={hostalertColumns}
                        currentPanel='hostalertlist'
                    />
                    </div>
                );
            case 'vulnerabilityDetailList':
                return ( 
                    <div>                    
                    <Card bordered={false} /*title="主机状态分布" 产生分界线*/
                        style={{fontWeight: 'bolder', width: '100%', height:220}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>漏洞概览</h2>
                        </div>
                        <Row gutter={[6, 6]}>
                        {/* <Col className="gutter-row" span={4} style={{ marginLeft: '15px',marginTop: '10px' }}>
                          <div className="container">
                            <div className={this.state.isSidebarOpen ? "overlay open" : "overlay"} onClick={this.closeSidebar}></div>
                            <div className={this.state.isSidebarOpen ? "sidebar open" : "sidebar"}>
                              <button onClick={() => this.toggleSidebar} className="close-btn">&times;</button>
                                <VulnerabilityDetailsSidebar
                                  //vulnOriginData={vulnOriginData}
                                  //vulnInfoArray={getSelectedVulnDetails()}
                                  onDoneButtonClick={this.handleDoneButtonClick}//点击‘处理’按键
                                  toggleSidebar={this.toggleSidebar}
                                  host_uuid={this.state.selectedVulnUuid}
                                  isSidebarOpen={this.state.isSidebarOpen}
                                />
                            </div>
                          </div>
                        </Col> */}
                        <Col className="gutter-row" span={10}>
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
                                    <Statistic title={<span>待处理漏洞</span>} value={99} />
                                </Col>
                                <Col span={9} style={{ width:'400px'}}>
                                  <CustomPieChart
                                    data={vulDataOne}
                                    innerRadius={27}
                                    deltaRadius={2}
                                    outerRadius={33}
                                    cardWidth={90}
                                    cardHeight={90}
                                    hasDynamicEffect={true}
                                    />
                                </Col>
                                <Col span={7} style={{ width:'420px',height:'100px',paddingTop:'5px'}}>
                                    {/* <StatusPanel scanPanelData={scanPanelData} orientation="vertical" /> */}
                                </Col>
                            </Row>
                          </Card>
                        </Col>
                        <Col className="gutter-row" span={6}>
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
                                    <Statistic title={<span>累计处理的漏洞</span>} value={this.state.doneVulnerabilitiesCount} />
                                </Col>
                                
                            </Row>
                          </Card>
                        </Col>              
                        <Col className="gutter-row" span={6}style={{ marginLeft: '10px' }}>
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
                                    <Statistic title={<span>累计忽略的漏洞</span>} value={this.state.ignoredVulnerabilitiesCount} />
                                </Col>
                                
                            </Row>
                          </Card>
                        </Col> 
                        <div className="container">
                            <div className={this.state.isSidebarOpen ? "overlay open" : "overlay"} onClick={this.closeSidebar}></div>
                            <div className={this.state.isSidebarOpen ? "sidebar open" : "sidebar"}>
                              <button onClick={() => this.toggleSidebar} className="close-btn">&times;</button>
                                <VulnerabilityDetailsSidebar
                                  //vulnOriginData={vulnOriginData}
                                  //vulnInfoArray={getSelectedVulnDetails()}
                                  onDoneButtonClick={this.handleDoneButtonClick}//点击‘处理’按键
                                  toggleSidebar={this.toggleSidebar}
                                  host_uuid={this.state.selectedVulnUuid}
                                  isSidebarOpen={this.state.isSidebarOpen}
                                />
                            </div>
                          </div>
                         </Row>
                         </Card>
                        {this.renderModal()}
                        {this.renderList('http://localhost:5000/api/vulndetetion/query_uuid?uuid=',
                        this.state.host_uuid,['scanTime'],this.state.vulnColumns,currentPanel,'漏洞概览')}
                    </div>
                // <div style={{ width: '100%' }}>
                // <Col className="gutter-row" md={24} style={{ width: '100%',maxWidth:2640,border:'false'}}>
                //     <Row gutter={[8, 16]} style={{ marginTop: '-21px',marginLeft: '-8px' }}>
                //         <Col md={24}>
                //                 <Card bordered={false}>
                //                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                //                         <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{'漏洞概览'}</h2>
                //                     </div>
                //                     <FetchAPIDataTable
                //                     apiEndpoint={'http://localhost:5000/api/vulndetetion/query_uuid?uuid='+this.state.host_uuid}
                //                     timeColumnIndex={[]}
                //                     columns={this.state.vulnColumns}
                //                     currentPanel={currentPanel}
                //                     />
                //                 </Card>
                //         </Col>
                //     </Row>
                // </Col>
                // </div>
                );
            case 'baseLineDetectDetailList':
                return (
                    <div>
                        {this.renderList('http://localhost:5000/api/baseline_check/linux/query_uuid?uuid=',
                        this.state.host_uuid,['last_checked'],baselineDetectColumns,currentPanel,'基线概览')}
                    </div>
                        // <HostDetailsTable
                        //     apiEndpoint="http://localhost:5000/api/vulndetetion/query?host_ip="
                        //     columns={baselineDetectColumns}
                        //     currentPanel={currentPanel}
                        //     titleName="基线概览"
                        //     selectedRowKeys={this.state.panelSelectedRowKeys.baselineDetectalertlist}
                        //     onSelectChange={(keys: any) => this.onSelectChange(keys, 'baselineDetectalertlist')}
                        // />
                );
            case 'virusscanning':
                return (
                    <div style={{marginTop:'-20px'}}>
                        <VirusScanning
                            hostID=""
                            pageWidth={1320}
                        />
                    </div>
                );
            case 'performancemonitor':
                return (
                    <div style={{marginTop:'-20px'}}>
                        <PerformanceMonitor />
                    </div>
                );
            // case 'assetfingerprint':
            //     return (
            //             <HostDetailsTable
            //                 apiEndpoint="http://localhost:5000/api/vulndetetion/query?host_ip="
            //                 columns={fimColumns}
            //                 currentPanel={currentPanel}
            //                 titleName="资产指纹"
            //                 selectedRowKeys={this.state.panelSelectedRowKeys.assetfingerprint}
            //                 onSelectChange={(keys: any) => this.onSelectChange(keys, 'assetfingerprint')}
            //             />
            //     );
            default:
                return (
                        <HostOverview
                            changePanel={this.changePanel}
                        />
                );
        }
    }
    
    render() {
        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <BreadcrumbCustom />
                <span>
                    {this.props.host_name}
                </span>
                <div>
                    <Row gutter={[12, 6]} style={{ marginTop: '10px',width: '100%', margin: '0 auto' }}>
                        <Col md={24}>
                            <Menu
                                onClick={this.handleMenuClick}
                                selectedKeys={[this.state.currentPanel]}
                                mode="horizontal"
                                style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                            >
                                <Menu.Item key="hostoverview">主机概览</Menu.Item>
                                <Menu.Item key="hostalertlist">安全告警（AlarmTotal）</Menu.Item>
                                <Menu.Item key="vulnerabilityDetailList">漏洞风险（VulnTotal）</Menu.Item>
                                <Menu.Item key="baseLineDetectDetailList">基线风险（BaselineTotal）</Menu.Item>
                                <Menu.Item key="virusscanning">病毒查杀（VirusTotal）</Menu.Item>
                                <Menu.Item key="performancemonitor">性能监控</Menu.Item>
                                {/* <Menu.Item key="runningalertlist">运行时安全告警（RaspAlarmTotal）</Menu.Item> */}
                                {/* <Menu.Item key="assetfingerprint">资产指纹</Menu.Item> */}
                                {/* 可以根据需要添加更多的Menu.Item */}
                                {/* 使用透明div作为flex占位符 */}
                                <div style={{ flexGrow: 1 }}></div>
                                
                            </Menu>
                            {/* 渲染当前激活的子面板 */}
                            <Card bordered={false} style={{backgroundColor: '#F6F7FB', margin:'0 auto',width:'90%' }}>
                                {this.renderCurrentPanel()}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default withRouter(DetailsPage);
