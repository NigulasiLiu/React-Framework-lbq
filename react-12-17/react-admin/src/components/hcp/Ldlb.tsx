
import './YourComponent.css'; // 确保引入了CSS文件


import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker, Statistic } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import moment, { Moment } from 'moment';
import DataDisplayTable from '../AssetsCenter/DataDisplayTable'
const { RangePicker } = DatePicker;
type RangeValue<T> = [T | null, T | null] | null;
const { Search } = Input;

type HostInventoryProps = {};
type HostInventoryState = {
  dataSource: any[];
  count: number;
  deleteIndex: number | null;
  currentTime: string;
  selectedRowKeys: React.Key[];
  selectedDateRange: [string | null, string | null];
  activeIndex: any;
  areRowsSelected: boolean;
  isSidebarOpen: boolean;
};


interface DataType1 {
  key: React.Key;
  alarmName: string;        // 告警名称
  affectedAsset: string;    // 影响资产
  alarmType: string;        // 告警类型
  level: string;            // 级别
  status: string;           // 状态
  tz: string;
  occurrenceTime: string;   // 发生时间
}

interface StatusItem {
  color: string;
  label: string;
  value: number;
}

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
const vulnerabilityColumns = [
  {
    title: () => <span style={{ fontWeight: 'bold' }}>漏洞名称</span>,
    dataIndex: 'alarmName',
    //width: '13%',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>影响资产数</span>,
    dataIndex: 'affectedAsset',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>漏洞特征</span>,
    dataIndex: 'tz',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>级别</span>,
    dataIndex: 'level',
    filters: [
      { text: '紧急', value: '紧急' },
      { text: '高危', value: '高危' },
      { text: '低危', value: '低危' },
      { text: '中危', value: '中危' },
    ],
    onFilter: (value: string | number | boolean, record: DataType1) => record.level.includes(value as string),
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
    dataIndex: 'status',
    filters: [
        { text: '已处理', value: '已处理' },
        { text: '未处理', value: '未处理' },
    ],
    onFilter: (value: string | number | boolean, record: DataType1) => record.status.includes(value as string),
},
  {
    title: () => <span style={{ fontWeight: 'bold' }}>最新扫描时间</span>,
    dataIndex: 'occurrenceTime',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
    dataIndex: 'operation',
  },
];

class Ldlb extends React.Component<HostInventoryProps, HostInventoryState> {
  constructor(props: any) {
    super(props);
    this.columns = [
      {
        title: () => <span style={{ fontWeight: 'bold' }}>漏洞名称</span>,
        dataIndex: 'alarmName',
        //width: '13%',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>影响资产数</span>,
        dataIndex: 'affectedAsset',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>漏洞特征</span>,
        dataIndex: 'tz',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>级别</span>,
        dataIndex: 'level',
        filters: [
          { text: '紧急', value: '紧急' },
          { text: '高危', value: '高危' },
          { text: '低危', value: '低危' },
          { text: '中危', value: '中危' },
        ],
        onFilter: (value: string | number | boolean, record: DataType1) => record.level.includes(value as string),
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
        dataIndex: 'status',
        filters: [
            { text: '已处理', value: '已处理' },
            { text: '未处理', value: '未处理' },
        ],
        onFilter: (value: string | number | boolean, record: DataType1) => record.status.includes(value as string),
    },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>最新扫描时间</span>,
        dataIndex: 'occurrenceTime',
      },
      // {
      //   title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
      //   dataIndex: 'operation',
      //   render: (text: string, record: DataType1) => (
      //     <a
      //       href={'/login'}
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     //style={{ color: 'blue' }} // 添加颜色样式
      //     >
      //       查看详情
      //     </a>
      //   ),
      // },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
        dataIndex: 'operation',
        render: (text: any, record: any, index: number) => {
          return this.state.dataSource.length > 0 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.onDelete(record, index)}
            >
              <span>Delete</span>
            </Popconfirm>
          ) : null;
        },
      },
    ];
    this.state = {
      dataSource: [

        {
          key: '1',
          alarmName: '漏洞A',
          affectedAsset: '5',
          tz: '特征信息A',
          level: '高危',
          status: '未处理',
          occurrenceTime: '2023-01-01 10:00',
        },
        {
          key: '2',
          alarmName: '漏洞B',
          affectedAsset: '3',
          tz: '特征信息B',
          level: '中危',
          status: '已处理',
          occurrenceTime: '2023-01-02 11:00',
        },
        {
          key: '3',
          alarmName: '漏洞C',
          affectedAsset: '8',
          tz: '特征信息C',
          level: '紧急',
          status: '未处理',
          occurrenceTime: '2023-01-03 09:30',
        },
      ],
      count: 2,
      deleteIndex: -1,
      activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
      selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
      areRowsSelected: false,
      selectedDateRange: [null, null],
      isSidebarOpen: false,
      currentTime: '2023-12-28 10:30:00', // 添加用于存储当前时间的状态变量
    };
  }
  columns: any;

  toggleSidebar = () => {
    this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    this.setCurrentTime();
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


  onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
    if (dates) {
      // 用户选择了日期范围
      const [start, end] = dateStrings; // 使用 dateStrings，它是日期的字符串表示
      this.setState({ selectedDateRange: [start, end] });
    } else {
      // 用户清除了日期选择
      this.setState({ selectedDateRange: [null, null] });
    }
  };

  renderRowSelection = () => {
    return {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys });
      },
      // Add other rowSelection properties and methods as needed
    };
  };
  onDelete = (record: any, index: number) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ deleteIndex: record.key });
    setTimeout(() => {
      this.setState({ dataSource });
    }, 500);
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: '1',
      alarmName: '网络连接失败',
      affectedAsset: '路由器X',
      alarmType: '恶意破坏',
      level: '高风险',
      status: '未处理',
      occurrenceTime: '2023-12-28 08:00:00',
      action: '查看详情'
    };
    this.setState({
      dataSource: [newData, ...dataSource],
      count: count + 1,
    });
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
  handleExport = () => {
    const { dataSource, selectedRowKeys } = this.state;

    // 过滤出已选中的行数据
    const selectedData = dataSource.filter((row: DataType1) => selectedRowKeys.includes(row.key));

    // 检查是否有选中的行
    if (selectedData.length === 0) {
      alert('没有选中的行');
      return;
    }

    // 转换数据为CSV格式
    const csvData = this.convertToCSV(selectedData);

    // 触发下载
    this.triggerDownload(csvData, 'export.csv');
  };

  convertToCSV = (data: DataType1[]) => {
    // 假设您希望导出的CSV中包括所有字段
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row: DataType1) => {
      return `${row.key},${row.alarmName},${row.affectedAsset},${row.level},${row.tz},${row.status},${row.occurrenceTime}`;
    });
    return [headers, ...rows].join('\n');
  };

  triggerDownload = (data: string, filename: string) => {
    const element = document.createElement('a');
    element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
    element.download = filename;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  render() {
    const { isSidebarOpen, dataSource, selectedRowKeys, selectedDateRange, currentTime } = this.state;
    // Conditional button style

    const filteredDataSource = dataSource.filter(item => {
      // 解析 occurrenceTime 字符串为 moment 对象
      const itemDate = moment(item.occurrenceTime, 'YYYY-MM-DD HH:mm:ss');

      // 将 selectedDateRange 中的字符串转换为 moment 对象，如果为 null 则保持为 null
      const [startDateStr, endDateStr] = selectedDateRange;
      const startDate = startDateStr ? moment(startDateStr, 'YYYY-MM-DD') : null;
      const endDate = endDateStr ? moment(endDateStr, 'YYYY-MM-DD') : null;

      // 检查 itemDate 是否在选定的日期范围内
      return (!startDate || itemDate.isSameOrAfter(startDate, 'day')) &&
        (!endDate || itemDate.isSameOrBefore(endDate, 'day'));
    });

    const buttonStyle = this.state.areRowsSelected
      ? { fontWeight: 'bold' as 'bold', color: 'red' }
      : { fontWeight: 'normal' as 'normal', color: 'grey' };

    const StatusPanel: React.FC<{ statusData: StatusItem[] }> = ({ statusData }) => (
      <Row gutter={[16, 16]}>
        {statusData.map((item, index) => (
          <Col span={12} key={index}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: item.color, width: 20, height: 20, borderRadius: '50%', marginRight: 10 }}></div>
              <div>
                <span>{item.label}</span>
                <span style={{ marginLeft: 10 }}>{item.value}</span>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );

    // 状态数据
    const statusData: StatusItem[] = [
      { color: '#E63F3F', label: '严重', value: 7 },
      { color: '#846BCE', label: '高危', value: 2 },
      { color: '#FEC745', label: '中危', value: 5 },
      { color: '#468DFF', label: '低危', value: 1 },
    ];

    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
        <Row gutter={[12, 6]}/*(列间距，行间距)*/>
          <Col className="gutter-row" md={24}>    
            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                <Col className="gutter-row" md={24}>
                <Card /*title="主机状态分布" 产生分界线*/
                  style={{fontWeight: 'bolder', width: '100%', height:200}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>漏洞概览</h2>
                  </div>
                  <Row gutter={[6, 6]}>
                    <Col className="gutter-row" md={5} style={{ marginLeft: '15px' }}>
                    <div className="container">
                      <Row gutter={24}>
                      <h2 style={{ fontSize: '16px' }}>最近扫描时间（每日自动扫描）</h2>
                      <span className="currentTime" style={{ marginRight: '10px' }}>{currentTime}</span>
                      <button onClick={this.toggleSidebar}>立即检查</button>
                      </Row>
                      <div className={isSidebarOpen ? "overlay open" : "overlay"} onClick={this.toggleSidebar}></div>
                      <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
                        <button onClick={this.toggleSidebar} className="close-btn">&times;</button>
                        <p>侧边栏内容</p>
                      </div>
                    </div>
                    </Col>
                    <Col className="gutter-row" md={8}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '440px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24}>
                                <Statistic title={<span>待处理高可利用漏洞</span>} value={1} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col>
                    <Col className="gutter-row" md={5}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '280px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24}>
                                <Statistic title={<span>累计处理的漏洞</span>} value={0} />
                            </Col>
                            
                        </Row>
                      </Card>
                    </Col>              
                    <Col className="gutter-row" md={5}style={{ marginLeft: '10px' }}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '280px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row>
                            <Col pull={2} span={24}>
                                <Statistic title={<span>累计忽略的漏洞</span>} value={0} />
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
                      <h2 style={{ fontWeight: 'bold', marginLeft: '6px' }}>漏洞内容</h2>
                  </div>
                  <DataDisplayTable
                      apiEndpoint="http://localhost:5000/api/files/vulnerability"
                      columns={vulnerabilityColumns}
                      currentPanel={"vulnerabilityDetect"}
                      selectedRowKeys={this.state.selectedRowKeys}
                      onSelectChange={(keys: any) => this.onSelectChange(keys)}
                  />
                  </Card>
              </div>
          </Col>

        </Row>
      </div>
    );
  }
}




// function Ldlb() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="container">
//       <button onClick={toggleSidebar}>立即检查</button>
//       <div className={isSidebarOpen ? "overlay open" : "overlay"} onClick={toggleSidebar}></div>
//       <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
//         <button onClick={toggleSidebar} className="close-btn">&times;</button>
//         {/* 侧边栏内容 */}
//         <p>侧边栏内容</p>
//       </div>
//     </div>
//   );
// }

export default Ldlb;