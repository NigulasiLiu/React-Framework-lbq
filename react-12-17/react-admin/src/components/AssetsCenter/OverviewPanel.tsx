import React, { useContext } from 'react';
import { Table, Card, Row, Col, Statistic, Progress, Button, Empty, Tooltip } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { StatusItem, GenericDataItem, BaseItem, DataItem } from '../Columns';
import { DataContext, DataContextType } from '../ContextAPI/DataManager'
import moment from 'moment/moment';
interface OverviewPanelProps extends RouteComponentProps {
    currentPanel: string;
    statusData: StatusItem[];
    //currentPanel: string;
    changePanel: (panelName: string) => void; //切换子panel
}

type OverviewPanelState = {
    activeIndex: any;
    tempdata: GenericDataItem[];
};
const baseDataItems: BaseItem[] = [
    { key: '1', color: '#F24040' },
    { key: '2', color: '#F77237' },
    { key: '3', color: '#E5BA4A' },
    { key: '4', color: '#F2F3F5' },
    { key: '5', color: '#F2F3F5' },
    // ... other port_data items
];


const findMaxValue = (dataItems: DataItem[]) => {
    return Math.max(...dataItems.map(item => item.value), 0); // 加上0以处理空数组的情况
};
const colorOrder = baseDataItems.map((item) => item.color); // Keep original color order


//显示从接口得到stime数据时，去除进度条
const generateColumns = (divValue: number, tableName: string, tbName_Right: string, tableName_list: string[], goToPanel: (panelName: string) => void) => {
    const showProgress = tableName !== '文件完整性校验-最新变更二进制文件 TOP5'; // 判断是否要显示进度条
    return [
        {
            title: () => <div>
                <Button
                    style={{
                        fontWeight: 'bold', padding: '0 0',
                        border: 'none',
                        backgroundColor: 'transparent', // 设置背景为透明
                        boxShadow: 'none', // 去除阴影
                        // color: record.status === 'Online' ? '#4086FF' : 'rgba(64, 134, 255, 0.5)', // 动态改变颜色
                        // cursor: record.status === 'Online' ? 'pointer' : 'default' // 当按钮被禁用时，更改鼠标样式
                    }}
                    onClick={()=>goToPanel(tbName[tableName])}
                >
                    {tableName}
                </Button>
            </div>,
            key: 'id',
            render: (text: any, record: DataItem, index: number) => {
                const textColor = index < 3 ? 'white' : 'grey'; // 根据index决定文字颜色 style={{ cursor: 'pointer' }} onClick={() => goToPanel(record.id)}
                return (
                    <Row>
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
                                transform: 'translateY(4px)',
                            }}
                        >
                            {index + 1} {/* 在圆形中显示index + 1 */}
                        </span>

                        <Tooltip title={record.id || 'Unknown id'}>
                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '330px',
                            }}>
                                {record.id || '-'}
                            </div>
                        </Tooltip>
                    </Row>
                );
            },
        },
        {
            title: () => (<div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tbName_Right}</div>),
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => {
                if (showProgress) {
                    const percent_real = parseFloat(value.toString()) / parseFloat(divValue.toString()) * 100;
                    return (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Progress percent={percent_real} strokeColor="#4086FF" showInfo={false} />
                            <div style={{ marginLeft: '20px' }}>{value}</div>
                        </div>
                    );
                } else {
                    return <div style={{ textAlign: 'right' }}>{moment.unix(value).format('YYYY-MM-DD HH:mm:ss')}</div>;
                }
            },
        },
    ];
};
const tbName: GenericDataItem = {
    '开放端口 TOP5': 'open_ports',
    '系统软件 TOP5': 'system_software',
    '系统服务 TOP5': 'system_services',
    '运行进程 TOP5': 'running_processes',
    '文件完整性校验-最新变更二进制文件 TOP5': 'fim',
    '应用 TOP5': 'applications',
}
const tbNameList = [
    '开放端口 TOP5',
    '系统用户 TOP5',
    '系统服务 TOP5',
    '运行进程 TOP5',
    '文件完整性校验-最新变更二进制文件 TOP5',
    '应用 TOP5',
];
const tbName_Right = ['指纹数', '变更时间', ''];
// 预定义的模板数组，包含 key 和 color



class OverviewPanel extends React.Component<OverviewPanelProps, OverviewPanelState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: [-1], //一个扇形图
            tempdata: [],
        };
    }

    goToPanel = (panelName: string) => {
        // 更新父组件的状态，changePanel 的函数负责这个逻辑
        // if(['系统用户 TOP5','应用 TOP5'].includes(panelName))
        this.props.changePanel(panelName);

    };

    render() {

        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return <div>Loading...</div>; // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const {
                        fimMetaData_hostname,
                        portMetaData_port_state,
                        processMetaData_userName, assetMetaData_service,

                        topFiveFimData, topFivePortCounts, topFiveProcessCounts, topFiveUserCounts, topFiveServiceCounts, topFiveProductCounts,
                    } = context;


                    const columns = [
                        generateColumns(findMaxValue(topFivePortCounts), tbNameList[0], tbName_Right[0], tbNameList, this.goToPanel),//开放端口
                        generateColumns(findMaxValue(topFiveUserCounts), tbNameList[1], tbName_Right[0], tbNameList, ()=>{}),//系统用户
                        generateColumns(findMaxValue(topFiveServiceCounts), tbNameList[2], tbName_Right[0], tbNameList, this.goToPanel),//系统服务
                        generateColumns(findMaxValue(topFiveProcessCounts), tbNameList[3], tbName_Right[0], tbNameList, this.goToPanel), //运行进程
                        generateColumns(findMaxValue(topFiveFimData), tbNameList[4], tbName_Right[1], tbNameList, this.goToPanel),//fim
                        generateColumns(findMaxValue(topFiveProductCounts), tbNameList[5], tbName_Right[0], tbNameList, ()=>{}),//系统应用
                        // generateColumns(tbNameList[6], tbName_Right[0], tbNameList, this.goToPanel),
                        // generateColumns(tbNameList[7], tbName_Right[2], tbNameList, this.goToPanel),
                    ];

                    return (
                        <div style={{
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold' }}>
                            <Row gutter={[8, 16]}>
                                <Col span={3}>

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
                                                <Statistic title={<span>开放端口</span>} value={portMetaData_port_state.typeCount.get('open')} />
                                            </Col>
                                            <Col
                                                pull={0}
                                                span={2}
                                                style={{ position: 'relative', top: '-3.5px' }}
                                            >
                                                <Button
                                                    type="link"
                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                    icon={<RightOutlined />}
                                                    onClick={() => this.goToPanel('open_ports')}
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
                                                <Statistic title={<span>运行进程</span>} value={processMetaData_userName.tupleCount} />
                                            </Col>
                                            <Col
                                                pull={0}
                                                span={2}
                                                style={{ position: 'relative', top: '-3.5px' }}
                                            >
                                                <Button
                                                    type="link"
                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                    icon={<RightOutlined />}
                                                    onClick={() => this.goToPanel('running_processes')}
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
                                                <Statistic title={<span>系统服务</span>} value={assetMetaData_service.tupleCount} />
                                            </Col>
                                            <Col
                                                pull={0}
                                                span={2}
                                                style={{ position: 'relative', top: '-3.5px' }}
                                            >
                                                <Button
                                                    type="link"
                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                    icon={<RightOutlined />}
                                                    onClick={() => this.goToPanel('system_services')}
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
                                                <Statistic title={<span>系统用户</span>} value={processMetaData_userName.typeCount.size} />
                                            </Col>
                                            <Col
                                                pull={0}
                                                span={2}
                                                style={{ position: 'relative', top: '-3.5px' }}
                                            >
                                                <Button
                                                    type="link"
                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                    icon={<RightOutlined />}
                                                    onClick={() => this.goToPanel('running_processes')}
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                        }}
                                    >
                                        <Row>
                                            <Col pull={2} span={22}>
                                                <Statistic title={<span>完整性检验</span>} value={fimMetaData_hostname.tupleCount} />
                                            </Col>
                                            <Col
                                                pull={0}
                                                span={2}
                                                style={{ position: 'relative', top: '-3.5px' }}
                                            >
                                                <Button
                                                    type="link"
                                                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                                                    icon={<RightOutlined />}
                                                    onClick={() => this.goToPanel('fim')}
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
                                        dataSource={topFivePortCounts}//开放端口
                                        columns={columns[0]}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Table<DataItem>
                                        className="customTable"
                                        dataSource={topFiveUserCounts}//系统用户
                                        columns={columns[1]}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Table<DataItem>
                                        className="customTable"
                                        dataSource={topFiveServiceCounts}//系统服务
                                        columns={columns[2]}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Table<DataItem>
                                        className="customTable"
                                        dataSource={topFiveProcessCounts}//运行进程
                                        columns={columns[3]}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Table<DataItem>
                                        className="customTable"
                                        dataSource={topFiveFimData}//fim
                                        columns={columns[4]}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Col>
                                <Col span={12}>
                                    <Table<DataItem>
                                        className="customTable"
                                        dataSource={topFiveProductCounts}//系统应用
                                        columns={columns[5]}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Col>
                            </Row>
                            {/* <MetaDataDisplay
            metadata={assetMetaData_service}
            /> */}
                        </div>
                    );
                }}
            </DataContext.Consumer>
        )
    }
}

export default withRouter(OverviewPanel);
