import React, { ReactNode } from 'react';
import { Row, Col, Card, Menu, Button, Modal, Statistic, Input, Tooltip, Table, } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import HostOverview from './HostOverview';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import HostDetailsTable from './HostDetailsTable';
import VulnerabilityDetailsSidebar from '../HostProtection/VulnerabilityDetailsSidebar';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';
import { hostalertColumns, fimColumns, baselineDetectColumns, virusscanningColumns, baselineDetectColumnsType } from '../tableUtils';
import AlertList from '../AlertList';
import VirusScanning from '../VirusScanning/VirusScanning';
import PerformanceMonitor from './PerformanceMonitor';
import { DataType } from './DetailsTableColumns'
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import Item from 'antd/lib/list/Item';
import moment from 'moment';

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
  host_name: string;
}
interface DetailsPageState {
  host_uuid: string;
  dataSource: any[];

  selectedVulnUuid: string;
  ignoredVulnerabilitiesCount: number;
  doneVulnerabilitiesCount: number;
  // ...其他状态字段
  showModal: boolean, // 控制模态框显示
  showBLModal: boolean,
  currentRecord: any, // 当前选中的记录
  vulnColumns: any[];
  blColumns: any[];
  isSidebarOpen: boolean;
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

class DetailsPage extends React.Component<DetailsPageProps, DetailsPageState> {
  constructor(props: any) {
    super(props);
    // 漏洞检测结果列配置
    const expColumns = [
      { title: '漏洞', dataIndex: 'bug_exp', key: 'bug_exp' },
      { title: '扫描时间', dataIndex: 'scanTime', key: 'scanTime', render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss') },
      {
        title: '操作', dataIndex: 'operation', key: 'operation',

        render: (text: string, record: any) => (
          <div>
            <Button onClick={() => this.toggleDetailSidebar(record.uuid)} className="custom-link-button"
              style={{
                fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF',
                padding: '0 0'
              }}>详情</Button>
          </div>
        ),
      },
    ];

    // 指纹识别结果列配置
    const fingerColumns = [
      { title: '指纹', dataIndex: 'finger', key: 'finger' },
      { title: 'URL', dataIndex: 'url', key: 'url' },
      { title: '扫描时间', dataIndex: 'scanTime', key: 'scanTime', render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss') },
    ];

    // POC检测结果列配置
    const pocColumns = [
      { title: 'POC', dataIndex: 'bug_poc', key: 'bug_poc' },
      { title: 'URL', dataIndex: 'url', key: 'url' },
      { title: '扫描时间', dataIndex: 'scanTime', key: 'scanTime', render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss') },
    ];

    const expandedRowRender = (record: { vul_detection_exp_result: any; vul_detection_finger_result: any; vul_detection_poc_result: any; }) => {
      // 根据子记录的类型选择对应的列配置
      const getColumns = (type: string) => {
        switch (type) {
          case 'exp':
            return expColumns;
          case 'finger':
            return fingerColumns;
          case 'poc':
            return pocColumns;
          default:
            return [];
        }
      };

      return (
        <>
          {/* 漏洞检测结果子表格 */}
          <Table
            columns={getColumns('exp')}
            dataSource={record.vul_detection_exp_result}
            pagination={false}
            rowKey="id"
            title={() => '漏洞检测结果'}
          />
          {/* 指纹识别结果子表格 */}
          <Table
            columns={getColumns('finger')}
            dataSource={record.vul_detection_finger_result}
            pagination={false}
            rowKey="id"
            title={() => '指纹识别结果'}
          />
          {/* POC检测结果子表格 */}
          <Table
            columns={getColumns('poc')}
            dataSource={record.vul_detection_poc_result}
            pagination={false}
            rowKey="id"
            title={() => 'POC检测结果'}
          />
        </>
      );
    };
    this.state = {
      host_uuid: '-1',
      statusData: [], // 初始状态

      showModal: false, // 控制模态框显示
      showBLModal: false,
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
      vulnColumns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: "主机名称",
          dataIndex: 'uuid',
          key: 'uuid',
          filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
          render: (text: string, record: any) => (
            <div>
              <div>
                <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                  <Button style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF', padding: '0 0' }}>
                    {record.uuid.slice(0, 5)}
                  </Button>
                </Link>
              </div>
              <div style={{
                fontSize: 'small', // 字体更小
                background: '#f0f0f0', // 灰色背景
                padding: '2px 4px', // 轻微内边距
                borderRadius: '2px', // 圆角边框
                display: 'inline-block', // 使得背景色仅围绕文本
                marginTop: '4px', // 上边距
              }}>
                <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.ip}
              </div>
            </div>
          ),
        },
        {
          title: '端口',
          dataIndex: 'port',
        },
        {
          title: '扫描时刻',
          dataIndex: 'scan_time',
          render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
          sorter: (a: any, b: any) => parseFloat(a.scan_time) - parseFloat(b.scan_time),
        },
        {
          title: '扫描类型',
          dataIndex: 'scanType',
        },

        {
          title: "操作",
          dataIndex: 'operation',
          render: (text: string, record: any) => (
            <div>
              {/* <Button onClick={() => this.toggleVulOperationModal(record)} className="custom-link-button" 
                        style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',marginRight: '20px',
                        padding:'0 0' }}>忽略</Button> */}
              <Button onClick={() => this.toggleDetailSidebar(record.uuid)} className="custom-link-button"
                style={{
                  fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF',
                  padding: '0 0'
                }}>详情</Button>
            </div>
          ),
        },
      ],
      blColumns: [
        {
          title: "ID",
          dataIndex: 'id',
          key: 'id',
          Maxwidth: '15px',
        },
        {
            title: "主机名称",
            dataIndex: 'uuid',
            key: 'uuid',
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            render: (text: string, record: baselineDetectColumnsType) => (
                <div>
                    <div>
                        <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                            <Button style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF', padding: '0 0' }}>
                                {record.uuid.slice(0, 5)}
                            </Button>
                        </Link>
                    </div>
                    <div style={{
                        fontSize: 'small', // 字体更小
                        background: '#f0f0f0', // 灰色背景
                        padding: '2px 4px', // 轻微内边距
                        borderRadius: '2px', // 圆角边框
                        display: 'inline-block', // 使得背景色仅围绕文本
                        marginTop: '4px', // 上边距
                    }}>
                        <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.ip}
                    </div>
                </div>
            ),
        },
        {
          title: "基线名称",
          dataIndex: 'check_name',
          
          filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
          render: (text: string, record: baselineDetectColumnsType) => (
            <Tooltip title={record.check_name}>
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                {record.check_name}
              </div>
            </Tooltip>
          ),
        },
        {
          title: "检查详情",
          dataIndex: 'details',
        },
        {
          title: "调整建议",
          dataIndex: 'adjustment_requirement',
          render: (text: string, record: baselineDetectColumnsType) => (
            <Tooltip title={record.instruction}>
              {text}
            </Tooltip>
          ),
        },
        {
          title: "状态",
          dataIndex: 'status',
          filters: [{ text: 'true', value: 'true' }, { text: 'fail', value: 'fail' }
          ],
          onFilter: (value: string | number | boolean, record: baselineDetectColumnsType) => record.status.includes(value as string),
        },
        {
          title: "最新扫描时间",
          dataIndex: 'last_checked',
          sorter: (a: { occurrenceTime: string | number | Date; }, b: { occurrenceTime: string | number | Date; }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: "操作",
          dataIndex: 'operation',
          render: (text: string, record: baselineDetectColumnsType) => (
            <div>
              <Link to={`/app/baseline_detail?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                <Button style={{
                  fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF', marginRight: '20px',
                  padding: '0 0'
                }} className="custom-link-button">详情</Button>
              </Link>
              <Button onClick={() => this.toggleBLOperationModal(record)} className="custom-link-button"
                style={{
                  fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF',
                  padding: '0 0'
                }}>加白名单</Button>
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
      host_uuid: host_uuid ? host_uuid : 'default',
    });

  }

  expandedRowRender: ((record: any) => ReactNode) | undefined;

  //对漏洞条目的操作
  toggleVulOperationModal = (record = null) => {
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
    this.toggleVulOperationModal(); // 关闭模态框
  }

  handleCancel = () => {
    this.toggleVulOperationModal(); // 关闭模态框
  }

  handleIgnoreButtonClick = async (record: any) => {
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
  handleDoneButtonClick = async (record: any) => {
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
            <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }} onClick={this.handleOk}>
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

  toggleDetailSidebar = (uuid: string) => {
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

  //对基线检查条目的操作
  toggleBLOperationModal = (record: any) => {
    this.setState(prevState => ({
      showBLModal: !prevState.showBLModal,
      currentRecord: record // 设置当前记录，以便后续操作
    }));
  }

  handleblOk = async () => {
    // 处理忽略操作
    const record = this.state.currentRecord;
    if (record) {
      // 调用API
      // 假设API调用的逻辑是放在handleIgnoreButtonClick方法中实现的
      await this.handleBLIgnoreButtonClick(record);
    }
    this.toggleBLOperationModal(record); // 关闭模态框
  }

  handleblCancel = () => {
    this.toggleBLOperationModal([]); // 关闭模态框
  }

  handleBLIgnoreButtonClick = async (record: any) => {
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
  handleBLDoneButtonClick = async (record: any) => {
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

  renderBLWhiteListModal = () => {
    return (
      <>
        <Modal
          title="确认操作"
          visible={this.state.showBLModal}
          onOk={this.handleblOk}
          onCancel={this.handleblCancel}
          footer={[
            <Button key="back" onClick={this.handleblCancel}>
              取消
            </Button>,
            <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }} onClick={this.handleblOk}>
              是
            </Button>,
          ]}
        //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
        >
          确认对当前主机加白该条目？
        </Modal>
      </>
    );
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
    element.download = this.state.currentPanel + '_export.csv';
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  renderList = (apiEndpoint: string, uuid: string, timeColumnIndex: string[], columns: any[], currentPanel: string, title: string,searchIndex:string[]) => {
    if (uuid !== undefined) {
      return (
        <div style={{ width: '100%' }}>
          <Col className="gutter-row" md={24} style={{ width: '100%', maxWidth: 2640, border: 'false' }}>
            <Row gutter={[8, 16]} style={{ marginTop: '0px', marginLeft: '-8px' }}>
              <Col md={24}>
                <Card bordered={false}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</h2>
                  </div>
                  <FetchDataForElkeidTable
                    apiEndpoint={apiEndpoint + uuid}
                    timeColumnIndex={timeColumnIndex}
                    columns={columns}
                    currentPanel={currentPanel}
                    expandedRowRender={this.expandedRowRender}
                    indentSize={15} // 设置缩进大小，单位是像素
                    childrenColumnName="children" // 指定子数据的属性名称
                    search={searchIndex}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </div>
      );
    }
    return (

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <LoadingOutlined style={{ fontSize: '3em' }} />
      </div>
    );
  }

  // renderPanelAndPieChart=(OriginData:any[], title:string, panelDataTitle1:string, panelDataTitle2:string)=>{
  //   if(OriginData!==undefined){
  //       // 确保OriginData总是作为数组处理
  //       const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
  //       let totalExpResultCount = 0;
  //       originDataArray.forEach(item => {
  //         totalExpResultCount += item.vul_detection_exp_result.length;
  //       });
  //       const scanPanelData: StatusItem[] = [
  //         { color: '#E63F3F', label: panelDataTitle1, value: totalExpResultCount },
  //         { color: '#468DFF', label: panelDataTitle2, value: 99 },];
  //       return (                           
  //       <Row style={{ width: '100%',marginTop: '20px',paddingRight: '10px' }}>
  //       <Col span={8} style={{ paddingTop:'20px',width:'400px',height:'90px'}}>
  //           <Statistic title={title} value={totalExpResultCount} />
  //       </Col>
  //       <Col span={9} style={{ width:'400px',marginTop:'10px'}}>
  //         <CustomPieChart
  //           data={scanPanelData}
  //           innerRadius={27}
  //           deltaRadius={2}
  //           outerRadius={33}
  //           cardWidth={90}
  //           cardHeight={90}
  //           hasDynamicEffect={true}
  //           />
  //       </Col>
  //       <Col span={7} style={{ width:'420px',height:'100px',paddingTop:'5px',marginTop:'30px'}}>
  //           <StatusPanel scanPanelData={scanPanelData} orientation="vertical" />
  //       </Col>

  //   </Row>);
  //   }
  //   else{
  //     return (
  //       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
  //         <Card bordered={true}
  //             style={{backgroundColor: '#ffffff' , width: '100%',}}>
  //         <LoadingOutlined style={{ fontSize: '3em' }} />
  //         </Card>
  //       </div>);
  //     }
  // }

  // renderTable=(OriginData:any[], title:string, timeColumnIndex:string[], column:any[], currentPanel:string)=>{
  //   if(OriginData!==undefined){
  //       // 确保OriginData总是作为数组处理
  //       const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
  //       const filteredData = originDataArray;//.filter(item => item.uuid === this.state.host_uuid)
  //       if (filteredData.length > 0) {
  //           return (
  //           <div style={{fontWeight: 'bolder', width: '100%',}}>
  //               <Card bordered={true}
  //                   style={{backgroundColor: '#ffffff' }}>
  //                   <Row>
  //                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
  //                           <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
  //                       </div>
  //                   </Row>
  //                   <DataDisplayTable
  //                   externalDataSource={filteredData}
  //                   timeColumnIndex={timeColumnIndex}
  //                   childrenColumnName="children" // 指定子数据的属性名称
  //                   indentSize={20} // 设置缩进大小，单位是像素
  //                   columns={column}
  //                   currentPanel={currentPanel}
  //                   expandedRowRender={expandedRowRender}
  //                   />
  //               </Card>
  //           </div>
  //           );
  //       }
  //   }
  //   return (
  //       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
  //         <Card bordered={true}
  //             style={{backgroundColor: '#ffffff' , width: '100%',}}>
  //         <LoadingOutlined style={{ fontSize: '3em' }} />
  //         </Card>
  //       </div>
  //   );
  // }


  renderCurrentPanel = (agentOriginData: any, linuxbaselineOriginData: any, windowsbaselineOriginData: any, vulOriginData: any[],) => {
    //扇形图数据
    const vulDataOne: StatusItem[] = [
      { label: '严重', value: 1, color: '#E63F3F' },
      { label: '高危', value: 1, color: '#846BCE' },
      { label: '中危', value: 1, color: '#FEC745' },
      { label: '低危', value: 1, color: '#468DFF' }
    ];
    const RASPdata_1: StatusItem[] = [
      { label: '未通过主机', value: 0, color: '#EA635F' },
      { label: '通过主机', value: 1, color: '#E5E8EF' },
    ];
    const RASPdata_3: StatusItem[] = [...RASPdata_1,];

    const blPassData: StatusItem[] = [
      { label: '风险项', value: 0, color: '#4086FF' },
      { label: '通过项', value: 1, color: '#E5E8EF' },
    ];
    const RASPdata_31: StatusItem[] = [...blPassData,];
    const { currentPanel } = this.state;
    //const os_version = ['ubuntu', 'windows'];
    if (agentOriginData !== undefined) {
      // 确保agentOriginData总是作为数组处理
      const originDataArray = Array.isArray(agentOriginData) ? agentOriginData : [agentOriginData];
      if (originDataArray && originDataArray.length > 0) {
        const filteredData = originDataArray.find(item => item.uuid === this.state.host_uuid);

        if (!filteredData) {
          return <div>No data available for this host.</div>;
        }
        const os_version = filteredData.os_version.toLowerCase().includes('ubuntu') ? 'linux' : 'windows';
        const baselineOriginData = os_version === 'linux' ? linuxbaselineOriginData : windowsbaselineOriginData;

        //针对基线检查数据的筛选
        if (baselineOriginData === undefined) {
          return <div>baselineOriginData available for this host.</div>;
        }
        const blDataArray = Array.isArray(baselineOriginData) ? baselineOriginData : [baselineOriginData];
        if (blDataArray.length === 0) {
          return <div>baselineOriginData available for this host.</div>;
        }
        const filteredBLData = blDataArray.filter(Item => Item.uuid === this.state.host_uuid);
        if (!filteredBLData) {
          return <div>没有该主机的信息</div>;
        }
        const filteredAdjData = filteredBLData.filter(Item => Item.adjustment_requirement === "建议调整");
        if (!filteredAdjData) {
          return <div>该主机没有建议调整项</div>;
        }

        //针对漏洞数据的筛选
        if (vulOriginData === undefined) {
          return <div>vulOriginData available for this host.</div>;
        }
        const vulOriginDataArray = Array.isArray(vulOriginData) ? vulOriginData : [vulOriginData];
        if (vulOriginDataArray.length === 0) {
          return <div>baselineOriginData available for this host.</div>;
        }
        const filteredvulData = vulOriginDataArray.filter(Item => Item.uuid === this.state.host_uuid);
        if (!filteredvulData) {
          return <div>没有该主机漏洞的信息</div>;
        }
        let totalExpResultCount = 0;
        filteredvulData.forEach(item => {
          totalExpResultCount += item.vul_detection_exp_result.length;
        });





        switch (currentPanel) {
          case 'HostOverview':
            return (
              <HostOverview
                changePanel={this.changePanel}
              />
            );
          case 'hostalertlist':
            return (
              <div style={{ marginTop: '-20px' }}>
                <AlertList
                  apiEndpoint={"http://localhost:5000/api/files/logs/hostalertlist/host_1"}
                  columns={hostalertColumns}
                  currentPanel='hostalertlist'
                />
              </div>
            );
          case 'vulnerabilityDetailList':
            return (
              <div style={{ marginTop: '0px' }}>
                <Card bordered={false} /*title="主机状态分布" 产生分界线*/
                  style={{ fontWeight: 'bolder', width: '100%', height: 220 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>漏洞概览</h2>
                  </div>
                  <Row gutter={[6, 6]}>
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
                        <Row style={{ width: '100%', marginTop: '0px', paddingRight: '10px' }}>
                          <Col span={8} style={{ paddingTop: '20px', width: '400px', height: '90px' }}>
                            <Statistic title={<span>待处理漏洞</span>} value={totalExpResultCount} />
                          </Col>
                          <Col span={9} style={{ width: '400px' }}>
                            <CustomPieChart
                              data={
                                [{ color: '#E63F3F', label: '风险项', value: totalExpResultCount },
                                { color: '#468DFF', label: '通过项', value: 99 }]}
                              innerRadius={27}
                              deltaRadius={2}
                              outerRadius={33}
                              cardWidth={90}
                              cardHeight={90}
                              hasDynamicEffect={true}
                            />
                          </Col>
                          <Col span={7} style={{ width: '420px', height: '100px', paddingTop: '5px', marginTop: '10px' }}>
                            <StatusPanel statusData={[
                              { label: '风险项', value: totalExpResultCount, color: '#EA635F' },
                              { label: '通过项', value: 99, color: '#E5E8EF' },
                            ]} orientation="vertical" />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col span={1}>
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
                          <Col pull={2} span={24} style={{ marginRight: '50px' }}>
                            <Statistic title={<span>累计处理的漏洞</span>} value={this.state.doneVulnerabilitiesCount} />
                          </Col>

                        </Row>
                      </Card>
                    </Col>

                    <Col className="gutter-row" span={6} style={{ marginLeft: '10px' }}>
                      <Card
                        bordered={false}
                        style={{
                          height: '100px',
                          width: '270px',
                          minWidth: '200px', // 最小宽度300px，而非100px
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                      >
                        <Row>
                          <Col pull={2} span={24} style={{ marginRight: '50px' }}>
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
                  this.state.host_uuid, ['scanTime'], this.state.vulnColumns, currentPanel, '漏洞概览',["port"])}
              </div>
            );
          case 'baseLineDetectDetailList':
            return (
              <div>
                <Row style={{ width: '100%', margin: '0 auto' }}>
                  <Col className="gutter-row" md={24}>
                    <Card bordered={false}
                      style={{ fontWeight: 'bolder', marginTop: '0px', height: 200 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '0px' }}>告警概览</h2>
                      </div>
                      <Row gutter={[6, 6]}>
                        <Col md={2}>
                        </Col>
                        <Col className="gutter-row" md={8}>
                          <Card
                            bordered={false}
                            style={{
                              height: '100px',
                              // width: '520px',
                              width: '100%',
                              minWidth: '150px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#F6F7FB',
                            }}
                          >
                            <Row style={{ width: '100%', marginBottom: '-130px' }}>
                              <Col span={12} style={{ height: '100px', marginRight: '20px', marginLeft: '20px', marginBottom: '-170px', paddingTop: '10px' }}>
                                <Statistic title={<span>最近检查通过率</span>} value={100 * (1 - filteredAdjData.length / filteredBLData.length) + '%'} />
                              </Col>
                              <Col span={12} style={{ height: '90px', marginLeft: '250px', marginRight: '150px', marginBottom: '130px' }}>
                                {/* <StatusPanel statusData={statusData} orientation="vertical" /> */}
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                        <Col md={2}>
                        </Col>
                        <Col className="gutter-row" md={8}>
                          <Card
                            bordered={false}
                            style={{
                              height: '100px',
                              // width: '620px',
                              width: '100%',
                              minWidth: '150px', // 最小宽度300px，而非100px
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                          >
                            <Row style={{ width: '100%', marginTop: '0px', paddingRight: '10px' }}>
                              <Col span={3} style={{ paddingTop: '25px', paddingLeft: '20px', width: '440px', height: '100px' }}>
                                {/* <StatusPanel statusData={RASPdata_2} orientation="vertical" /> */}
                              </Col>
                              <Col span={5} style={{ marginLeft: '20px', paddingTop: '20px', width: '180px', height: '90px' }}>
                                <Statistic title={<span>检查项</span>} value={filteredBLData.length} />
                              </Col>
                              <Col span={5} style={{ marginLeft: '-20px', marginRight: '20px', width: '100px', alignItems: 'center', justifyContent: 'center' }}>
                                <CustomPieChart
                                  data={[
                                    { label: '风险项', value: filteredAdjData.length, color: '#EA635F' },
                                    { label: '通过项', value: filteredBLData.length - filteredAdjData.length, color: '#E5E8EF' },
                                  ]}
                                  innerRadius={24}
                                  deltaRadius={2}
                                  outerRadius={30}
                                  cardWidth={130}
                                  cardHeight={90}
                                  hasDynamicEffect={true}
                                />
                              </Col>
                              <Col span={8} style={{ paddingTop: '15px', width: '450px', height: '100px' }}>
                                <StatusPanel statusData={[
                                  { label: '风险项', value: filteredAdjData.length, color: '#EA635F' },
                                  { label: '通过项', value: filteredBLData.length - filteredAdjData.length, color: '#E5E8EF' },
                                ]}
                                  orientation="vertical" />
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>

                    </Card>
                  </Col>
                </Row>
                <Row style={{ width: '100%', margin: '0 auto' }}>
                  {this.renderBLWhiteListModal()}
                  {this.renderList('http://localhost:5000/api/baseline_check/' + os_version + '/query_uuid?uuid=',
                    this.state.host_uuid, ['last_checked'], this.state.blColumns, currentPanel, '基线概览',["check_name"])}
                </Row>
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
              <div style={{ marginTop: '-20px' }}>
                <VirusScanning
                  hostID=""
                  pageWidth={1320}
                />
              </div>
            );
          case 'performancemonitor':
            return (
              <div style={{ marginTop: '-20px' }}>
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
    } else {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <LoadingOutlined style={{ fontSize: '3em' }} />
        </div>
      );
    }
  }

  render() {

    return (
      <DataContext.Consumer>
        {(context: DataContextType | undefined) => {
          if (!context) {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <LoadingOutlined style={{ fontSize: '3em' }} />
              </div>); // 或者其他的加载状态显示
          }
          // 从 context 中解构出 topFiveFimData 和 n
          const { agentOriginData, linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData, vulnOriginData } = context;
          return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
              <BreadcrumbCustom />
              <span>
                {this.props.host_name}
              </span>
              <div>
                <Row gutter={[12, 6]} style={{ marginTop: '10px', width: '100%', margin: '0 auto' }}>
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
                    <Card bordered={false} style={{ backgroundColor: '#F6F7FB', margin: '0 auto', width: '90%' }}>
                      {this.renderCurrentPanel(agentOriginData, linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData, vulnOriginData)}
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          );

        }}
      </DataContext.Consumer>
    )
  }
}

export default withRouter(DetailsPage);
