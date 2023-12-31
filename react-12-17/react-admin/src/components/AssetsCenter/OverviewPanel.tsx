import React from 'react';
import { Table, Card, Row, Col, Statistic, Progress, Button, Empty } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { StatusItem } from './Interfaces';
import { StatusPanel } from './HostInventory';

type DataItem = {
    key: string;
    id: string;
    value: number;
    color: string; // 添加 color 属性
};
type BaseItem = {
    key: string;
    color: string; // 添加 color 属性
};
const baseDataItems: BaseItem[] = [
    { key: '1', color: '#F24040' },
    { key: '2', color: '#F77237' },
    { key: '3', color: '#E5BA4A' },
    { key: '4', color: '#F2F3F5' },
    { key: '5', color: '#F2F3F5' },
    // ... other port_data items
];
const port_data: DataItem[] = [
    { key: '1', id: '9984', value: 1, color: '#F24040' },
    { key: '2', id: '9090', value: 1, color: '#F77237' },
    { key: '3', id: '9993', value: 1, color: '#E5BA4A' },
    { key: '4', id: '9982', value: 1, color: '#F2F3F5' },
    { key: '5', id: '8082', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];
const softerware_data: DataItem[] = [
    // ... other port_data items
];
//除了第一个表中的数据，其余数据都没有排序
const service_data: DataItem[] = [
    { key: '1', id: 'systemd-initctl.service', value: 1, color: '#F24040' },
    { key: '2', id: 'systemd-tmpfles-clean.service', value: 3, color: '#F77237' },
    { key: '3', id: 'dbus.service', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'systemd-journald.service', value: 4, color: '#F2F3F5' },
    { key: '5', id: 'elkeid_kafka_exporter.service', value: 2, color: '#F2F3F5' },
    // ... other port_data items
];
const progress_data: DataItem[] = [
    { key: '1', id: 'nginx', value: 1, color: '#F24040' },
    { key: '2', id: 'bash', value: 1, color: '#F77237' },
    { key: '3', id: 'java', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'nginx uploader', value: 1, color: '#F2F3F5' },
    { key: '5', id: 'prometheus', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];

const fim_data: DataItem[] = [
    // ... other port_data items
];

const app_data: DataItem[] = [
    { key: '1', id: 'prometheus', value: 1, color: '#F24040' },
    { key: '2', id: 'grafana', value: 1, color: '#F77237' },
    { key: '3', id: 'mongodb', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'redis', value: 1, color: '#F2F3F5' },
    { key: '5', id: 'nginx', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];
const core_data: DataItem[] = [
    { key: '1', id: 'snd rawmidi', value: 1, color: '#F24040' },
    { key: '2', id: 'ata generic', value: 1, color: '#F77237' },
    { key: '3', id: 'serio raw', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'ablk helper', value: 1, color: '#F2F3F5' },
    { key: '5', id: 'bridge', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];
const status_data: StatusItem[] = [
    { label: 'Created', value: 7, color: '#22BC44' }, //GREEN
    { label: 'Running', value: 2, color: '#FBB12E' }, //ORANGE
    { label: 'Exited', value: 5, color: '#EA635F' }, //RED
    { label: 'Unknown', value: 1, color: '#E5E8EF' }, //GREY
];

// 找到最大值
const maxValue = [
    Math.max(...port_data.map((item) => item.value)),
    Math.max(...softerware_data.map((item) => item.value)),
    Math.max(...service_data.map((item) => item.value)),
    Math.max(...progress_data.map((item) => item.value)),
    Math.max(...fim_data.map((item) => item.value)),
    Math.max(...app_data.map((item) => item.value)),
    Math.max(...core_data.map((item) => item.value)),
];
// 告警颜色-固定
const colorOrder = port_data.map((item) => item.color); // Keep original color order

const sortedData = [
    [...port_data].sort((a, b) => b.value - a.value),
    [...softerware_data].sort((a, b) => b.value - a.value),
    [...service_data].sort((a, b) => b.value - a.value),
    [...progress_data].sort((a, b) => b.value - a.value),
    [...fim_data].sort((a, b) => b.value - a.value),
    [...app_data].sort((a, b) => b.value - a.value),
    [...core_data].sort((a, b) => b.value - a.value),
];

const generateColumns = (tableName: string, tableName_s: string, tableName_list: string[]) => [
    {
        title: () => <span style={{ fontWeight: 'bold' }}>{tableName}</span>,
        key: 'id',
        render: (text: any, record: DataItem, index: number) => {
            const textColor = index < 3 ? 'white' : 'grey'; // 根据index决定文字颜色
            return (
                <div>
                    <span
                        style={{
                            lineHeight: '15px',
                            height: '15px',
                            width: '15px',
                            backgroundColor: colorOrder[index], // 使用record.color作为背景色
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '16px',
                            position: 'relative',
                            textAlign: 'center',
                            fontSize: '12px',
                            color: textColor,
                        }}
                    >
                        {index + 1} {/* 在圆形中显示index + 1 */}
                    </span>
                    {record.id}
                </div>
            );
        },
    },
    {
        title: () => <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s}</div>,
        dataIndex: 'value',
        key: 'value',
        render: (value: number) => {
            const percent = Math.round((value / maxValue[tableName_list.indexOf(tableName)]) * 100); // 计算百分比
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Progress percent={percent} strokeColor="#4086FF" showInfo={false} />
                    <div style={{ marginLeft: '20px' }}>{value}</div>
                </div>
            );
        },
    },
];
const generateColumns1 = (tableName: string, tableName_s: string, tableName_list: string[]) => {
    const showProgress = tableName !== '文件完整性校验-最新变更二进制文件 TOP5'; // 判断是否要显示进度条

    return [
        {
            title: () => <span style={{ fontWeight: 'bold' }}>{tableName}</span>,
            key: 'id',
            render: (text: any, record: DataItem, index: number) => {
                const textColor = index < 3 ? 'white' : 'grey'; // 根据index决定文字颜色
                return (
                    <div>
                        <span
                            style={{
                                lineHeight: '15px',
                                height: '15px',
                                width: '15px',
                                backgroundColor: colorOrder[index], // 使用record.color作为背景色
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '16px',
                                position: 'relative',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: textColor,
                            }}
                        >
                            {index + 1} {/* 在圆形中显示index + 1 */}
                        </span>
                        {record.id}
                    </div>
                );
            },
        },
        {
            title: () => (
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s}</div>
            ),
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => {
                if (showProgress) {
                    const percent = Math.round(
                        (value / maxValue[tableName_list.indexOf(tableName)]) * 100
                    ); // 计算百分比
                    return (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Progress percent={percent} strokeColor="#4086FF" showInfo={false} />
                            <div style={{ marginLeft: '20px' }}>{value}</div>
                        </div>
                    );
                } else {
                    return <div style={{ textAlign: 'right' }}>{value}</div>;
                }
            },
        },
    ];
};

const tableNames = [
    '开放端口 TOP5',
    '系统软件 TOP5',
    '系统服务 TOP5',
    '运行进程 TOP5',
    '文件完整性校验-最新变更二进制文件 TOP5',
    '应用 TOP5',
    '内核模块 TOP5',
    '容器运行状态分布',
];
const tableName_s = ['指纹数', '变更时间', ''];
const columns = [
    generateColumns(tableNames[0], tableName_s[0], tableNames),
    generateColumns(tableNames[1], tableName_s[0], tableNames),
    generateColumns(tableNames[2], tableName_s[0], tableNames),
    generateColumns(tableNames[3], tableName_s[0], tableNames),
    generateColumns1(tableNames[4], tableName_s[1], tableNames),
    generateColumns(tableNames[5], tableName_s[0], tableNames),
    generateColumns(tableNames[6], tableName_s[0], tableNames),
    generateColumns(tableNames[7], tableName_s[2], tableNames),
];
interface GenericDataItem {
    [key: string]: any;
}
interface OverviewPanelProps extends RouteComponentProps {
    statusData: StatusItem[];
    changePanel: (panelName: string) => void; //切换子panel
    topData: {
        fim: GenericDataItem[];
        container: GenericDataItem[];
        openPorts: GenericDataItem[];
        runningProcesses: GenericDataItem[];
        systemUsers: GenericDataItem[];
        scheduledTasks: GenericDataItem[];
        systemServices: GenericDataItem[];
        systemSoftware: GenericDataItem[];
        applications: GenericDataItem[];
        kernelModules: GenericDataItem[];
    };
}

type OverviewPanelState = {
    activeIndex: any;
};
class OverviewPanel extends React.Component<OverviewPanelProps, OverviewPanelState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: [-1], //一个扇形图
        };
    }

    // 修改后的函数，使其能够导航到对应的子面板
    goToPanel = (panelName: string) => {
        // 更新父组件的状态，changePanel 的函数负责这个逻辑
        this.props.changePanel(panelName);
    };

    renderEmpty = () => {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Empty description="暂无数据" />
            </div>
        );
    };
    //扇形图动态效果实现
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

    render() {
        // 自定义的边框样式
        const borderStyle = {
            border: '1px solid #d9d9d9', // 例如，使用浅灰色作为边框颜色
            padding: '4px', // 根据需要添加一些内边距
            borderRadius: '4px', // 如果需要圆角边框
        };
        // 将GenericDataItem[]转换为DataItem[]，根据rankLabel字段进行排序和转换
        function convertToDataItems(
            genericDataItems: GenericDataItem[],
            rankLabel: string,
            baseDataItems: BaseItem[]
        ) {
            return genericDataItems.map((item, index) => {
                return {
                    key: baseDataItems[index].key,
                    id: item.id || 'N/A',
                    value: item[rankLabel] || 0,
                    color: baseDataItems[index].color,
                };
            });
        }
        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <Row gutter={[8, 16]}>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={0} span={22}>
                                    <Statistic title={<span>容器</span>} value={2} />
                                </Col>
                                <Col span={2} style={{ position: 'relative', top: '-3.5px' }}>
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('container')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>开放端口</span>} value={1} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('open-ports')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>运行进程</span>} value={13} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('running-processes')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>系统用户</span>} value={3} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('system-users')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>定时任务</span>} value={0} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('scheduled-tasks')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>系统服务</span>} value={0} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('system-services')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>系统软件</span>} value={0} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('system-software')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '160px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>文件完整性校验</span>} value={0} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('fim')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={2}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '110px',
                                minWidth: 110, // 最小宽度100px
                                maxWidth: 110, // 最大宽度200px
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>内核模块</span>} value={0} />
                                </Col>
                                <Col
                                    pull={0}
                                    span={2}
                                    style={{ position: 'relative', top: '-3.5px' }}
                                >
                                    <Button
                                        type="link"
                                        style={{ color: '#000' }}
                                        icon={<RightOutlined />}
                                        onClick={() => this.goToPanel('kernel-modules')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    {/* ... other statistic cards */}
                </Row>
                <Row gutter={[8, 16]}>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={sortedData[0]}
                            columns={columns[0]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={sortedData[1]}
                            columns={columns[1]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={sortedData[2]}
                            columns={columns[2]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={sortedData[3]}
                            columns={columns[3]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={convertToDataItems(
                                this.props.topData.fim,
                                'mtime',
                                baseDataItems
                            )}
                            columns={columns[4]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={sortedData[5]}
                            columns={columns[5]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            dataSource={sortedData[6]}
                            columns={columns[6]}
                            pagination={false}
                            rowKey="id"
                        />
                    </Col>
                    <Col span={12}>
                        <Table<DataItem>
                            className="customTable"
                            //dataSource={sortedData[7]}
                            columns={columns[7]}
                            locale={{ emptyText: ' ' }} // 将空文本设置为一个空的React.Fragment
                            // pagination={false}
                            // rowKey="id"
                        />
                        <Card className="noTopBorderCard" style={{ height: 238 }}>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={status_data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={54}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                onMouseEnter={(e) => this.handleMouseEnter(e, 0)} //0代表第一个扇形图
                                                onMouseLeave={this.handleMouseLeave}
                                                outerRadius={
                                                    this.state.activeIndex[0] === 0 ? 80 : 72
                                                } // 0代表第一个扇形图，如果悬停则扇形半径变大
                                                className={
                                                    this.state.activeIndex === 0
                                                        ? 'pie-hovered'
                                                        : 'pie-normal'
                                                }
                                            >
                                                {status_data.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            {/* <Tooltip content={<CustomTooltip />} /> */}
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Col>
                                <Col span={2}> </Col>
                                <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                                    <StatusPanel statusData={status_data} />
                                </div>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(OverviewPanel);
