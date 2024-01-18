/**
 * Created by hao.cheng on 2017/5/8.
 */
import React from 'react';
import { Statistic,Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker } from 'antd';
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

    selectedRowKeys: React.Key[];
    selectedDateRange: [string | null, string | null];
    activeIndex: any;
    areRowsSelected: boolean;
};
interface DataType {
    key: React.Key;
    hostname: string;
    label: string;
    group: string;
    OStype: string;
    risks: {
        warning1: number;
        warning2: number;
        warning3: number;
    };
    status: string;
    clientUsage: string;
    updateTime: string;
}
// Define an interface for the individual status item

interface AlertColumDataType {
    key: React.Key;
    alarmName: string;        // 告警名称
    affectedAsset: string;    // 影响资产
    alarmType: string;        // 告警类型
    level: string;            // 级别
    status: string;           // 状态
    occurrenceTime: string;   // 发生时间
}

interface StatusItem {
    color: string;
    label: string;
    value: number;
}

// Define an interface for the props expected by the StatusPanel component
// interface StatusPanelProps {
//     statusData: StatusItem[];
//     orientation: 'horizontal' | 'vertical';
//   }
// export const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
//     return (
//         //<div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>      
//         <div style={{ fontFamily: 'YouYuan, sans-serif' }}>
//             {statusData.map((status, index) => (
//                 <div key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ height: '10px', width: '10px', backgroundColor: status.color, borderRadius: '50%', display: 'inline-block', marginRight: '16px' }}></span>
//                     <span style={{ marginRight: 'auto', paddingRight: '8px' }}>{status.label}</span>
//                     <span>{status.value}</span>
//                 </div>
//             ))}
//         </div>//</div>

//     );
// };
// 内核模块表的列定义

interface StatusPanelProps {
    statusData: StatusItem[];
    orientation: 'vertical' | 'horizontal'; // 添加方向属性
  }
  
const StatusPanel: React.FC<StatusPanelProps> = ({ statusData, orientation }) => {
    const containerStyle: React.CSSProperties = {
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
const hostalertColumns = [
    {
        title: '告警名称',
        dataIndex: 'alertName',
        key: 'alertName',
        render: (text: string, record: AlertColumDataType) => (
            <a
                href={'/login'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1964F5' }}// 添加颜色样式
            >
                {text}
            </a>
        ),
    },
    {
        title: '影响资产',
        dataIndex: 'affectedAssets',
        key: 'affectedAssets',
    },
    {
        title: '告警类型',
        dataIndex: 'alertClass',
        key: 'alertClass',
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
    },
    {
        title: '发生时间',
        dataIndex: 'occurTimestamp',
        key: 'occurTimestamp',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
    },
];

class gjlb extends React.Component<HostInventoryProps, HostInventoryState> {
    constructor(props: any) {
        super(props);
        this.columns = [
            {
                title: () => <span style={{ fontWeight: 'bold' }}>告警名称</span>,
                dataIndex: 'alarmName',
                //width: '13%',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>影响资产</span>,
                dataIndex: 'affectedAsset',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>告警类型</span>,
                dataIndex: 'alarmType',
                filters: [
                    { text: '暴力破解', value: '暴力破解' },
                    { text: '静态检查', value: '静态检查' },
                    { text: '资产探测', value: '资产探测' },
                    { text: '恶意破坏', value: '恶意破坏' },
                ],
                onFilter: (value: string | number | boolean, record: AlertColumDataType) => record.alarmType.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>级别</span>,
                dataIndex: 'level',
                filters: [
                    { text: '紧急', value: '紧急' },
                    { text: '高风险', value: '高风险' },
                    { text: '低风险', value: '低风险' },
                    { text: '中风险', value: '中风险' },
                ],
                onFilter: (value: string | number | boolean, record: AlertColumDataType) => record.level.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
                dataIndex: 'status',
                filters: [
                    { text: '已处理', value: '已处理' },
                    { text: '未处理', value: '未处理' },
                    { text: '误报', value: '误报' },
                ],
                onFilter: (value: string | number | boolean, record: AlertColumDataType) => record.status.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>发生时间</span>,
                dataIndex: 'occurrenceTime',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
                dataIndex: 'operation',
                render: (text: string, record: AlertColumDataType) => (
                    <a
                        href={'/login'}
                        target="_blank"
                        rel="noopener noreferrer"
                    //style={{ color: 'blue' }} // 添加颜色样式
                    >
                        查看详情
                    </a>
                ),
            },

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
                // {
                //     key: '0',
                //     hostname: 'CPU使用率过高',
                //     label: '-',
                //     group: 'default',
                //     OStype: 'Windows',
                //     risks: {
                //         warning1: 0,
                //         warning2: 1,
                //         warning3: 2
                //     },
                //     status: '离线',
                //     clientUsage: '32',
                //     updateTime: '18:00, 2023 12 16',
                // },  
                {
                    key: '2',
                    alarmName: '硬盘使用率过高',
                    affectedAsset: '服务器Y',
                    alarmType: '暴力破解',
                    level: '中风险',
                    status: '未处理',
                    occurrenceTime: '2023-12-28 09:15:00',
                    action: '查看详情'
                },
                {
                    key: '3',
                    alarmName: '应用程序崩溃',
                    affectedAsset: '应用服务器Z',
                    alarmType: '恶意破坏',
                    level: '紧急',
                    status: '已处理',
                    occurrenceTime: '2023-12-28 10:30:00',
                    action: '查看详情'
                }
            ],
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            selectedDateRange: [null,null]
        };
    }
    columns: any;
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
        const selectedData = dataSource.filter((row: AlertColumDataType) => selectedRowKeys.includes(row.key));

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

    convertToCSV = (data: AlertColumDataType[]) => {
        // 假设您希望导出的CSV中包括所有字段
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((row: AlertColumDataType) => {
            return `${row.key},${row.alarmName},${row.affectedAsset},${row.alarmType},${row.level},${row.status},${row.occurrenceTime}`;
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
        const { dataSource, selectedRowKeys, selectedDateRange } = this.state;
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


        const statusData: StatusItem[] = [
        { color: '#EA635F', label: '紧急 ', value: 7 },
        { color: '#FEC746', label: '中风险 ', value: 2 },
        { color: '#846CCE', label: '高风险 ', value: 5 },
        { color: '#468DFF', label: '低风险 ', value: 1 },
        ];

        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                {/* <BreadcrumbCustom breads={['主机和容器防护', '告警列表']} /> */}
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col className="gutter-row" md={24}>
                    <Card /*title="主机状态分布" 产生分界线*/
                        style={{fontWeight: 'bolder', width: '100%', height:200}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>告警概览</h2>
                        </div>
                        <Row gutter={[6, 6]}>
                            <Col className="gutter-row" md={10}>
                                <Card
                                    bordered={false}
                                    style={{
                                        height: '100px',
                                        width: '570px',
                                        minWidth: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#F6F7FB',
                                    }}
                                >
                                    <Row style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Col style={{ marginRight: '350px'}} span={12}>
                                            <Statistic title={<span>待处理告警</span>} value={1} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col className="gutter-row" md={7}>
                            <Card
                                bordered={false}
                                style={{
                                    height: '100px',
                                    width: '400px',
                                    minWidth: '200px', // 最小宽度300px，而非100px
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                }}
                                >
                                <Row>
                                    <Col style={{ marginRight: '250px' }} span={24}>
                                        <Statistic title={<span>集群</span>} value={0} />
                                    </Col>
                                    
                                </Row>
                            </Card>
                            </Col>            
                            <Col className="gutter-row" md={7}>
                            <Card
                                bordered={false}
                                style={{
                                    height: '100px',
                                    width: '400px',
                                    minWidth: '200px', // 最小宽度300px，而非100px
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                }}
                                >
                                <Row>
                                    <Col style={{ marginRight: '250px' }} span={24}>
                                        <Statistic title={<span>容器</span>} value={0} />
                                    </Col>
                                    
                                </Row>
                            </Card>
                            </Col>              
                        </Row>

                    </Card>
                    </Col>
                </Row>
                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '0px' }}> 
                    <Col md={24}>
                        <div className="gutter-box">
                        <Card bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontWeight: 'bold', marginLeft: '6px' }}>告警内容</h2>
                                <button onClick={this.handleAdd} style={{ padding: '5px 15px', fontWeight: 'bold' }}>
                                添加告警
                            </button>
                            </div>
                            <DataDisplayTable
                                apiEndpoint="http://localhost:5000/api/files/hostalertlist"
                                externalDataSource={dataSource}
                                columns={hostalertColumns}
                                currentPanel={"hostAlertlist"}
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

export default gjlb;
