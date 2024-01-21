
import './YourComponent.css'; // 确保引入了CSS文件
import zhCN from 'antd/es/locale/zh_CN';
import DataDisplayTable from '../AssetsCenter/DataDisplayTable'
import { Tooltip } from 'antd';
import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker, ConfigProvider,Statistic } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import moment, { Moment } from 'moment';
import MySidebar from './MySidebar';

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
  riskItemCount:number;
};


interface DataType1 {
  key: React.Key;
  ip: string;                // IP
  check_name: string;        // 基线名称
  details: string;           // 检查详情
  adjustment_requirement: string;  // 调整建议
  status: string;            // 状态
  last_checked: string;      // 最新扫描时间
  instruction: string;       // 指令
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
const baselineDetectColumns = [
  {
    title: () => <span style={{ fontWeight: 'bold' }}>IP</span>,
    dataIndex: 'ip',
    //width: '13%',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>基线名称</span>,
    dataIndex: 'check_name',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>检查详情</span>,
    dataIndex: 'details',
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>调整建议</span>,
    dataIndex: 'adjustment_requirement',
    render: (text: string, record: DataType1) => (
      <Tooltip title={record.instruction}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
    dataIndex: 'status',
    filters: [
    ],
    onFilter: (value: string | number | boolean, record: DataType1) => record.status.includes(value as string),
  },
  {
    title: () => <span style={{ fontWeight: 'bold' }}>最新扫描时间</span>,
    dataIndex: 'last_checked',
    sorter: (a: { occurrenceTime: string | number | Date; }, b: { occurrenceTime: string | number | Date; }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
    sortDirections: ['ascend', 'descend'],
  },
  // {
  //   title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
  //   dataIndex: 'operation',
  // },
];

class BaselineDetectList extends React.Component<HostInventoryProps, HostInventoryState> {
  constructor(props: any) {
    super(props);
    this.columns = [
      {
        title: () => <span style={{ fontWeight: 'bold' }}>基线名称</span>,
        dataIndex: 'alarmName',
        //width: '13%',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>影响主机数</span>,
        dataIndex: 'affectedAsset',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>检查项</span>,
        dataIndex: 'jcx',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>风险项</span>,
        dataIndex: 'fxx',
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>风险状态</span>,
        dataIndex: 'status',
        filters: [
          { text: '有风险', value: '有风险' },
          { text: '无风险', value: '无风险' },
        ],
        onFilter: (value: string | number | boolean, record: DataType1) => record.status.includes(value as string),
      },
      {
        title: () => <span style={{ fontWeight: 'bold' }}>最新扫描时间</span>,
        dataIndex: 'occurrenceTime',
        sorter: (a: { occurrenceTime: string | number | Date; }, b: { occurrenceTime: string | number | Date; }) => new Date(a.occurrenceTime).getTime() - new Date(b.occurrenceTime).getTime(),
        sortDirections: ['ascend', 'descend'],
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

        { "key": "1", "alarmName": "基线名称1", "affectedAsset": "58", "jcx": "12", "fxx": "11", "status": "有风险", "occurrenceTime": "2023-08-27 12:08:56" },
        { "key": "2", "alarmName": "基线名称2", "affectedAsset": "26", "jcx": "22", "fxx": "0", "status": "无风险", "occurrenceTime": "2023-04-30 16:15:27" },
        { "key": "3", "alarmName": "基线名称3", "affectedAsset": "68", "jcx": "13", "fxx": "13", "status": "有风险", "occurrenceTime": "2023-07-07 20:58:14" },
        { "key": "4", "alarmName": "基线名称4", "affectedAsset": "76", "jcx": "4", "fxx": "0", "status": "无风险", "occurrenceTime": "2023-02-14 14:19:23" },
        { "key": "5", "alarmName": "基线名称5", "affectedAsset": "10", "jcx": "25", "fxx": "12", "status": "有风险", "occurrenceTime": "2023-01-24 07:53:40" },
      ],
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
      return `${row.key},${row.ip},${row.check_name},${row.details},${row.adjustment_requirement},${row.status},${row.last_checked},${row.instruction}`;
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
                <Card /*title="主机状态分布" 产生分界线*/
                  style={{fontWeight: 'bolder', width: '100%', height:220}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>基线概览</h2>
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
                      <button onClick={this.toggleSidebar}>立即检查</button>
                      </Row>
                      <div className={isSidebarOpen ? "overlay open" : "overlay"} onClick={this.toggleSidebar}></div>
                      <div className={isSidebarOpen ? "sidebar open" : "sidebar"}>
                      <button onClick={this.toggleSidebar} className="close-btn">&times;</button>
                          <MySidebar
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
                      <h2 style={{ fontWeight: 'bold', marginLeft: '6px' }}>基线内容</h2>
                  </div>
                  <DataDisplayTable
                      apiEndpoint="http://localhost:5000/api/files/log"
                      sqlTableName='windows_security_checks'
                      columns={baselineDetectColumns}
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





export default BaselineDetectList;