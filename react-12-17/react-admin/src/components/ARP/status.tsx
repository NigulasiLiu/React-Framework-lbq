/**
 * Created by hao.cheng on 2017/5/8.
 */
import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import moment, { Moment } from 'moment';
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

interface DataType1 {
    key: React.Key;
    hostName: string;          // 主机名称
    commandLine: string;       // 进程命令行
    processId: string;         // 进程ID
    runtimeType: string;       // 运行时类型
    status: string;            // 状态
    lastOccurrenceTime: string; // 最后出现时间
    protectionEffectiveTime: string; // 保护生效时间
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


class status extends React.Component<HostInventoryProps, HostInventoryState> {
    constructor(props: any) {
        super(props);
        this.columns = [
            {
                title: () => <span style={{ fontWeight: 'bold' }}>主机名称</span>,
                dataIndex: 'hostName', // 对应接口中的 hostName
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>进程命令行</span>,
                dataIndex: 'commandLine', // 对应接口中的 commandLine
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>进程ID</span>,
                dataIndex: 'processId', // 对应接口中的 processId
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>运行时类型</span>,
                dataIndex: 'runtimeType', // 对应接口中的 runtimeType
                filters: [
                    { text: 'Java', value: 'Java' },
                    { text: 'Golang', value: 'Golang' },
                    { text: 'PHP', value: 'PHP' },
                  ],
                onFilter: (value: string | number | boolean, record: DataType1) => record.runtimeType.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
                dataIndex: 'status', // 对应接口中的 status
                filters: [
                    { text: '已被RASP识别', value: '已被RASP识别' },
                    { text: '已注入', value: '已注入' },
                    { text: '等待注入', value: '等待注入' },
                    { text: '进程已消失', value: '进程已消失' },
                    { text: '等待RASP识别', value: '等待RASP识别' },
                  ],
                onFilter: (value: string | number | boolean, record: DataType1) => record.status.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>最后出现时间</span>,
                dataIndex: 'lastOccurrenceTime', // 对应接口中的 lastOccurrenceTime
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>保护生效时间</span>,
                dataIndex: 'protectionEffectiveTime', // 对应接口中的 protectionEffectiveTime
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
                { 'key': '1', 'hostName': '主机1', 'commandLine': '命令行1', 'processId': '6467', 'runtimeType': 'Java', 'status': '已注入', 'lastOccurrenceTime': '2023-08-10 12:29:13', 'protectionEffectiveTime': '2023-02-14 12:47:44' },
                { 'key': '2', 'hostName': '主机2', 'commandLine': '命令行2', 'processId': '6898', 'runtimeType': 'PHP', 'status': '等待注入', 'lastOccurrenceTime': '2023-06-17 12:17:56', 'protectionEffectiveTime': '2023-03-11 12:41:57' },
            ],
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            selectedDateRange: [null, null]
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
            return `${row.key},${row.hostName},${row.commandLine},${row.processId},${row.runtimeType},${row.status},${row.lastOccurrenceTime},${row.protectionEffectiveTime}`;
;
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
            { color: '#E63F3F', label: '等待注入', value: 7 },
            { color: '#846BCE', label: '已注入', value: 2 },
            { color: '#FEC745', label: '已被RASP识别', value: 5 },
            { color: '#468DFF', label: '等待RASP识别', value: 1 },
            { color: '#44d5a9', label: '进程已消失', value: 1 },
        ];
        const statusData1: StatusItem[] = [
            { color: '#E63F3F', label: 'Python', value: 7 },
            { color: '#846BCE', label: 'Java', value: 2 },
            { color: '#FEC745', label: 'NodeJs', value: 5 },
            { color: '#468DFF', label: 'Golang', value: 1 },
            { color: '#44d5a9', label: 'PHP', value: 1 },
        ];

        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <BreadcrumbCustom breads={['应用运行时防护', '告警列表']} />
                <Row gutter={[12, 6]}/*(列间距，行间距)*/>
                    <Col span={24}>
                        <Card title='RASP概览' bordered={false}>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Card style={{ fontWeight: 'bolder', height: 130, backgroundColor: '#F6F7FB' }}>
                                        <Row gutter={0} style={{ height: '100%' }}>
                                            <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', fontWeight: 'bold', paddingLeft: '20px' }}>
                                                <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>RASP状态分布</h2>
                                                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>1</h2>
                                            </Col>
                                            <Col span={12} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <StatusPanel statusData={statusData} />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card style={{ fontWeight: 'bolder', height: 130, backgroundColor: '#F6F7FB' }}>
                                        <Row gutter={0} style={{ height: '100%' }}>
                                            <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', fontWeight: 'bold', paddingLeft: '20px' }}>
                                                <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>运行时统计</h2>
                                                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>1</h2>
                                            </Col>
                                            <Col span={12} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <StatusPanel statusData={statusData1} />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>

                            </Row>
                        </Card>
                    </Col>

                    <Col md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                    <h2 style={{ fontWeight: 'bold' }}>RASP进程列表</h2>

                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <Search placeholder="请选择筛选条件并搜索" onSearch={this.handleAdd} style={{ width: '100%' }} />
                                </div>
                                <div className="table-container">
                                    <Table rowSelection={{ selectedRowKeys, onChange: this.onSelectChange }} bordered dataSource={filteredDataSource} columns={this.columns} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default status;
