import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker, Statistic } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import moment, { Moment } from 'moment';
import DataDisplayTable from '../ContextAPI/DataDisplayTable'
import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts';
import { RASPProcessColums } from '../AssetsCenter/tableUtils';

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
  riskItemCount: number;
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

class RASPStatus extends React.Component<HostInventoryProps, HostInventoryState> {
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
    ];
    this.state = {
      dataSource: [
      ],
      count: 2,
      deleteIndex: -1,
      activeIndex:[-1,-1,-1,-1],
      selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
      areRowsSelected: false,
      selectedDateRange: [null, null],
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


    // 状态数据
    const statusData: StatusItem[] = [
      { color: '#E63F3F', label: '严重', value: 7 },
      { color: '#846BCE', label: '高危', value: 2 },
      { color: '#FEC745', label: '中危', value: 5 },
      { color: '#468DFF', label: '低危', value: 1 },
    ];
    const scanResult: StatusItem[] = [
      { color: 'green', label: '通过项', value: 7 },
      { color: '#E53F3F', label: '严重风险项', value: 2 },
      { color: '#846BCE', label: '高危风险项', value: 5 },
      { color: '#FEC745', label: '中危风险项', value: 1 },
      { color: '#468DFF', label: '低危风险项', value: 1 },
    ];
        //扇形图数据
        const RASPdata_1: StatusItem[] = [
          { label: '已被RASP识别', value: 7, color: '#F8C95F' },//橙色
          { label: '等待注入', value: 2, color: '#8C6D58' },//土色
          { label: '等待RASP识别', value: 5, color: '#5595F7' },//暗蓝色
        ];
        //扇形图数据
        const RASPdata_2: StatusItem[] = [
        { label: '已注入', value: 5, color: '#8C75C3' },//紫色
        { label: '进程已消失', value: 1, color: '#40DBA9' }//浅绿色
        ];
        const RASPdata_3: StatusItem[] = [...RASPdata_1, ...RASPdata_2];

        const runningStatusData_1: StatusItem[] = [
            { label: 'Python', value: 7, color: '#F8C95F' },//橙色
            { label: 'Java', value: 2, color: '#8C6D58' },//土色
            { label: 'NodeJS', value: 5, color: '#5595F7' },//暗蓝色
        ];
        //扇形图数据
        const runningStatusData_2: StatusItem[] = [
        { label: 'PHP', value: 5, color: '#8C75C3' },//紫色
        { label: 'Golang', value: 1, color: '#40DBA9' }//浅绿色
        ];  
        const runningStatusData_3: StatusItem[] = [...runningStatusData_1, ...runningStatusData_2];

    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
        <Row gutter={[12, 6]}/*(列间距，行间距)*/>
          <Col className="gutter-row" span={24}>    
            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                <Col className="gutter-row" span={24} >
                <Card /*title="主机状态分布" 产生分界线*/
                  style={{fontWeight: 'bolder', width: '100%', height:220}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>RASP概览</h2>
                  </div>
                  <Row gutter={[6, 6]}>
                    <Col className="gutter-row" span={12}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '620px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row style={{ width: '100%',marginTop: '0px',paddingRight: '10px' }}>
                            <Col span={4} style={{ paddingTop:'20px',width:'200px',height:'90px'}}>
                                <Statistic title={<span>RASP状态分布</span>} value={0} />
                            </Col>
                            <Col span={6} style={{ width:'100px'}}>
                            <ResponsiveContainer width="100%" height={90}>
                            <PieChart >
                                <Pie 
                                data={RASPdata_3}
                                cx="50%"
                                cy="50%"
                                innerRadius={24}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                onMouseEnter={(e) => this.handleMouseEnter(e, 0)}//0代表第一个扇形图
                                onMouseLeave={this.handleMouseLeave}
                                outerRadius={this.state.activeIndex[0] === 0 ? 30 : 28} // 0代表第一个扇形图，如果悬停则扇形半径变大
                                className={this.state.activeIndex === 0 ? 'pie-hovered' : 'pie-normal'}
                                >
                                {RASPdata_3.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                </Pie>
                                {/* <Tooltip content={<CustomTooltip />} /> */}
                            </PieChart>
                            </ResponsiveContainer> 
                            </Col>
                            <Col span={7} style={{ paddingTop:'15px',width:'440px',height:'100px'}}>
                                <StatusPanel statusData={RASPdata_1} orientation="vertical" />
                            </Col>
                            <Col span={7} style={{ paddingTop:'25px',paddingLeft:'20px',width:'440px',height:'100px'}}>
                                <StatusPanel statusData={RASPdata_2} orientation="vertical" />
                            </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Card
                        bordered={false}
                        style={{
                            height: '100px',
                            width: '620px',
                            minWidth: '200px', // 最小宽度300px，而非100px
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                        }}
                        >
                        <Row style={{ width: '100%',marginTop: '0px',paddingRight: '10px' }}>
                            <Col span={4} style={{ paddingTop:'20px',width:'200px',height:'90px'}}>
                                <Statistic title={<span>运行时统计</span>} value={0} />
                            </Col>
                            <Col span={6} style={{ width:'100px'}}>
                            <ResponsiveContainer width="100%" height={90}>
                            <PieChart >
                                <Pie 
                                data={RASPdata_3}
                                cx="50%"
                                cy="50%"
                                innerRadius={24}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                onMouseEnter={(e) => this.handleMouseEnter(e, 0)}//0代表第一个扇形图
                                onMouseLeave={this.handleMouseLeave}
                                outerRadius={this.state.activeIndex[0] === 0 ? 30 : 28} // 0代表第一个扇形图，如果悬停则扇形半径变大
                                className={this.state.activeIndex === 0 ? 'pie-hovered' : 'pie-normal'}
                                >
                                {RASPdata_3.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                </Pie>
                                {/* <Tooltip content={<CustomTooltip />} /> */}
                            </PieChart>
                            </ResponsiveContainer> 
                            </Col>
                            <Col span={7} style={{ paddingTop:'15px',width:'440px',height:'100px'}}>
                                <StatusPanel statusData={runningStatusData_1} orientation="vertical" />
                            </Col>
                            <Col span={7} style={{ paddingTop:'25px',paddingLeft:'20px',width:'440px',height:'100px'}}>
                                <StatusPanel statusData={runningStatusData_2} orientation="vertical" />
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
                      <h2 style={{ fontWeight: 'bold', marginLeft: '0px' }}>RASP进程列表</h2>
                  </div>
                  <DataDisplayTable
                      apiEndpoint="http://localhost:5000/api/files/RASPProcess"
                      columns={RASPProcessColums}
                      currentPanel={"RASPProcess"}
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


export default RASPStatus;