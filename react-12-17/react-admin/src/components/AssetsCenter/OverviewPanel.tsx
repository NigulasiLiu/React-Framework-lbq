import React, { useContext } from 'react';
import { Table, Card, Row, Col, Statistic, Progress, Button, Empty } from 'antd';
import axios from 'axios';
import { RightOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { StatusItem, GenericDataItem, BaseItem, DataItem } from '../tableUtils';
import { StatusPanel } from './HostInventory';
import CustomPieChart from './CustomPieChart';
import {DataContext} from '../ContextAPI/DataManager';
interface OverviewPanelProps extends RouteComponentProps {
    statusData: StatusItem[];
    //currentPanel: string;
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
    tempdata:GenericDataItem[];
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
const findMaxValue = (dataItems: DataItem[]) => {
    return Math.max(...dataItems.map(item => item.value), 0); // 加上0以处理空数组的情况
};

// 找到最大值
const maxValue = [
    findMaxValue(port_data),
    findMaxValue(softerware_data),
    findMaxValue(service_data),
    findMaxValue(progress_data),
    findMaxValue(fim_data),
    findMaxValue(app_data),
    findMaxValue(core_data),
];

// 告警颜色-固定
const colorOrder = baseDataItems.map((item) => item.color); // Keep original color order

const sortDataItems = (dataItems: DataItem[]) => {
    return [...dataItems].sort((a, b) => b.value - a.value);
};
const sortedData = [
    sortDataItems(port_data),
    sortDataItems(softerware_data),
    sortDataItems(service_data),
    sortDataItems(progress_data),
    sortDataItems(fim_data),
    sortDataItems(app_data),
    sortDataItems(core_data),
];


// const generateColumns2 = (tableName: string, tableName_s: string, tableName_list: string[], goToPanel: (panelName: string) => void) => [
//     {
//         title: () => <span style={{ fontWeight: 'bold', cursor: 'pointer' }} 
//         onClick={() => goToPanel(tableName)}>{tableName}</span>,
//         key: 'id',
//         render: (text: any, record: DataItem, index: number) => {
//           const textColor = index < 3 ? 'white' : 'grey';//后两个图标背景为灰色
//           return (
//             <div style={{ cursor: 'pointer' }} 
//             onClick={() => goToPanel(record.id)}>
//               <span
//                 style={{
//                   lineHeight: '15px',
//                   height: '15px',
//                   width: '15px',
//                   backgroundColor: colorOrder[index],
//                   borderRadius: '50%',
//                   display: 'inline-block',
//                   marginRight: '16px',
//                   position: 'relative',
//                   textAlign: 'center',
//                   fontSize: '12px',
//                   color: textColor,
//                 }}
//               >
//                 {index + 1}
//               </span>
//               {record.id}
//             </div>
//           );
//         },
//       },
//     {
//         title: () => <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s}</div>,
//         dataIndex: 'value',
//         key: 'value',
//         render: (value: number) => {
//             const percent = Math.round((value / maxValue[tableName_list.indexOf(tableName)]) * 100); // 计算百分比
//             return (
//                 <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                     <Progress percent={percent} strokeColor="#4086FF" showInfo={false} />
//                     <div style={{ marginLeft: '20px' }}>{value}</div>
//                 </div>
//             );
//         },
//     },
// ];
//显示从接口得到stime数据时，去除进度条
const generateColumns = (tableName: string, tableName_s: string, tableName_list: string[], goToPanel: (panelName: string) => void) => {
    const showProgress = tableName !== '文件完整性校验-最新变更二进制文件 TOP5'; // 判断是否要显示进度条

    return [
        {
            title: () => <span style={{ fontWeight: 'bold', cursor: 'pointer' }} 
            onClick={() => goToPanel(tbName[tableName])}>{tableName}</span>,
            key: 'id',
            render: (text: any, record: DataItem, index: number) => {
                const textColor = index < 3 ? 'white' : 'grey'; // 根据index决定文字颜色 style={{ cursor: 'pointer' }} onClick={() => goToPanel(record.id)}
                return (
                    <div >
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
            title: () => (<div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s}</div>),
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
const tbName:GenericDataItem={
    '开放端口 TOP5':'open-ports',
    '系统软件 TOP5':'system-software',
    '系统服务 TOP5':'system-services',
    '运行进程 TOP5':'running-processes',
    '文件完整性校验-最新变更二进制文件 TOP5':'fim',
    '应用 TOP5':'applications',
    '内核模块 TOP5':'kernel-modules',
    '容器运行状态分布':'container',}
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
// 预定义的模板数组，包含 key 和 color
const templateData: DataItem[] = [
    { key: '1', id: '', value: 0, color: '#F24040' },
    { key: '2', id: '', value: 0, color: '#F77237' },
    { key: '3', id: '', value: 0, color: '#E5BA4A' },
    { key: '4', id: '', value: 0, color: '#F2F3F5' },
    { key: '5', id: '', value: 0, color: '#F2F3F5' },
  ];
  
  // 转换函数
  const convertToDataItems = (topFiveData: GenericDataItem[], propNameI: string, propNameJ: string): DataItem[] => {
    return topFiveData.map((item, index) => ({
      ...templateData[index], // 复制 key 和 color
      id: item[propNameI], // 假设第 i 项属性值替换 id
      value: item[propNameJ], // 假设第 j 项属性值替换 value
    }));
  };

class OverviewPanel extends React.Component<OverviewPanelProps, OverviewPanelState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: [-1], //一个扇形图
            tempdata:[],
        };
    }


    // fetchLatestData = async (api:string) => {
    //     try {
    //         const rawData = await axios.get(api);
    //         if (rawData.data){
    //             const processedData = processData(rawData, timeColumnIndex);
    //             this.setState({tempdata:processedData})
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    //   };






    // 修改后的函数，使其能够导航到对应的子面板
    goToPanel = (panelName: string) => {
        // 更新父组件的状态，changePanel 的函数负责这个逻辑
        this.props.changePanel(panelName);

    };
    goToPanelAndSearch = (panelName: string, param: string) => {
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

        const columns = [
            generateColumns(tableNames[0], tableName_s[0], tableNames, this.goToPanel),
            generateColumns(tableNames[1], tableName_s[0], tableNames, this.goToPanel),
            generateColumns(tableNames[2], tableName_s[0], tableNames, this.goToPanel),
            generateColumns(tableNames[3], tableName_s[0], tableNames, this.goToPanel), 
            generateColumns(tableNames[4], tableName_s[1], tableNames, this.goToPanel),
            generateColumns(tableNames[5], tableName_s[0], tableNames, this.goToPanel),
            generateColumns(tableNames[6], tableName_s[0], tableNames, this.goToPanel),
            generateColumns(tableNames[7], tableName_s[2], tableNames, this.goToPanel),
        ];
        const topFiveData_default: GenericDataItem[] = [
            // 假设这是从某处获取的 topFiveData
            { filename: 'nginx', event_time: 1 },
            { filename: 'bash', event_time: 1 },
            { filename: 'java', event_time: 1 },
            { filename: 'nginx uploader', event_time: 1 },
            { filename: 'prometheus', event_time: 1 },
          ];
        //const topFiveData = this.context;
        //const topFiveFim_data = convertToDataItems(topFiveData, 'filename', 'event_time');
        return(
            <DataContext.Consumer>
            {topFiveFimData => {
              if (!topFiveFimData) return <div>正在加载...</div>;
    
              return (
                <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <Row gutter={[8, 16]}>
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    <Col span={3}>
                    {/* <DataCard
                        title="运行进程"
                        value={13}
                        valueItem={[
                        { value: '13', color: '#F6F7FB' },
                        // Add more additional statistics as needed
                        ]}
                        panelId="running-processes"
                        height="75px"
                        width="110px"
                        backgroundColor="#F6F7FB"
                        navigate={false}
                    /> */}
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    {/* <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                    </Col> */}
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                            }}
                        >
                            <Row>
                                <Col pull={2} span={22}>
                                    <Statistic title={<span>完整性校验</span>} value={0} />
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
                    <Col span={3}>
                        <Card
                            bordered={false}
                            style={{
                                height: '75px',
                                width: '150px',
                                minWidth: 80, // 最小宽度100px
                                maxWidth: 200, // 最大宽度200px
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
                            dataSource={topFiveFimData}
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
                        <Card bordered={false} className="noTopBorderCard" style={{ height: 238 }}>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <CustomPieChart
                                    data={status_data}
                                    innerRadius={54}
                                    deltaRadius={8}
                                    outerRadius={80}
                                    cardWidth={200}
                                    cardHeight={200}
                                    hasDynamicEffect={true}
                                    >
                                    </CustomPieChart>
                                </Col>
                                <Col span={2}> </Col>
                                <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                                    <StatusPanel statusData={status_data} orientation="vertical"/>
                                </div>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                </div>
              );
            }}
          </DataContext.Consumer>
        )
        
    //     return (
    //         <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
    //         <Row gutter={[8, 16]}>
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={0} span={22}>
    //                             <Statistic title={<span>容器</span>} value={2} />
    //                         </Col>
    //                         <Col span={2} style={{ position: 'relative', top: '-3.5px' }}>
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('container')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>开放端口</span>} value={1} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('open-ports')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             <Col span={3}>
    //             {/* <DataCard
    //                 title="运行进程"
    //                 value={13}
    //                 valueItem={[
    //                 { value: '13', color: '#F6F7FB' },
    //                 // Add more additional statistics as needed
    //                 ]}
    //                 panelId="running-processes"
    //                 height="75px"
    //                 width="110px"
    //                 backgroundColor="#F6F7FB"
    //                 navigate={false}
    //             /> */}
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>运行进程</span>} value={13} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('running-processes')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>系统用户</span>} value={3} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('system-users')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>定时任务</span>} value={0} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('scheduled-tasks')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>系统服务</span>} value={0} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('system-services')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             {/* <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>系统软件</span>} value={0} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('system-software')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col> */}
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>完整性校验</span>} value={0} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('fim')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             <Col span={3}>
    //                 <Card
    //                     bordered={false}
    //                     style={{
    //                         height: '75px',
    //                         width: '150px',
    //                         minWidth: 80, // 最小宽度100px
    //                         maxWidth: 200, // 最大宽度200px
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         backgroundColor: '#F6F7FB', // 设置Card的背景颜色
    //                     }}
    //                 >
    //                     <Row>
    //                         <Col pull={2} span={22}>
    //                             <Statistic title={<span>内核模块</span>} value={0} />
    //                         </Col>
    //                         <Col
    //                             pull={0}
    //                             span={2}
    //                             style={{ position: 'relative', top: '-3.5px' }}
    //                         >
    //                             <Button
    //                                 type="link"
    //                                 style={{ color: '#000' }}
    //                                 icon={<RightOutlined />}
    //                                 onClick={() => this.goToPanel('kernel-modules')}
    //                             />
    //                         </Col>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //             {/* ... other statistic cards */}
    //         </Row>
    //         <Row gutter={[8, 16]}>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     dataSource={sortedData[0]}
    //                     columns={columns[0]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     dataSource={sortedData[1]}
    //                     columns={columns[1]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     dataSource={sortedData[2]}
    //                     columns={columns[2]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     dataSource={sortedData[3]}
    //                     columns={columns[3]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     // dataSource={convertToDataItems(
    //                     //     this.props.topData.fim,
    //                     //     'mtime',
    //                     //     baseDataItems
    //                     // )}
    //                     dataSource={topFiveFimData}
    //                     columns={columns[4]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     dataSource={sortedData[5]}
    //                     columns={columns[5]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     dataSource={sortedData[6]}
    //                     columns={columns[6]}
    //                     pagination={false}
    //                     rowKey="id"
    //                 />
    //             </Col>
    //             <Col span={12}>
    //                 <Table<DataItem>
    //                     className="customTable"
    //                     //dataSource={sortedData[7]}
    //                     columns={columns[7]}
    //                     locale={{ emptyText: ' ' }} // 将空文本设置为一个空的React.Fragment
    //                     // pagination={false}
    //                     // rowKey="id"
    //                 />
    //                 <Card bordered={false} className="noTopBorderCard" style={{ height: 238 }}>
    //                     <Row gutter={0}>
    //                         <Col span={12}>
    //                             <CustomPieChart
    //                             data={status_data}
    //                             innerRadius={54}
    //                             deltaRadius={8}
    //                             outerRadius={80}
    //                             cardWidth={200}
    //                             cardHeight={200}
    //                             hasDynamicEffect={true}
    //                             >
    //                             </CustomPieChart>
    //                         </Col>
    //                         <Col span={2}> </Col>
    //                         <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
    //                             <StatusPanel statusData={status_data} orientation="vertical"/>
    //                         </div>
    //                     </Row>
    //                 </Card>
    //             </Col>
    //         </Row>
    //         </div>
    // //         <DataContext.Consumer>
    // //     {(topFiveData) => {
    // //         const topFiveFim_data = convertToDataItems(topFiveData?topFiveData_default:topFiveData, 'filename', 'event_time');
    // //         return (
    // //         );
    // //     }
    // //     }
    // //   </DataContext.Consumer>
    //     );
    }
}

export default withRouter(OverviewPanel);
