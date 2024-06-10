import zhCN from 'antd/es/locale/zh_CN';
import { Link } from 'react-router-dom';
import React from 'react';
import { Row, Col, Card, Input, Button, Statistic, Menu, Modal, Table, Tooltip } from 'antd';
import BaseLineDetectScanSidebar from '../SideBar/ScanProcessSidebar';
import { StatusItem } from '../Columns';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import { APP_Server_URL, BaseLine_linux_Data_API, BaseLine_windows_Data_API, Vul_Data_API } from '../../service/config';
import DataDisplayTable from '../OWLTable/DataDisplayTable';

type RangeValue<T> = [T | null, T | null] | null;
const { Search } = Input;

type BaselineDetectListProps = {};
type BaselineDetectListState = {
    count: number;
    deleteIndex: number | null;
    currentTime: string;
    selectedRowKeys: React.Key[];
    selectedDateRange: [string | null, string | null];
    activeIndex: any;
    areRowsSelected: boolean;
    isSidebarOpen: boolean;
    riskItemCount: number;
    currentPanel: string;


    ignoredBLCheckItem_array: { [uuid: string]: string[] }; // 修改为键值对形式存储
    ignoredBLCheckItem: any[], // 添加被忽略的 check_name 数组
    showIgnoredModal: boolean; // 新增
    ignoredBLCheckItemData: { uuid: string; BLCheckItem: string }[]; // 新增
    showModal: boolean, // 控制模态框显示

    currentRecord: any, // 当前选中的记录
    selectedVulnUuid: string;
    baselineDetectColumns:any[];
};


class BaselineDetectList extends React.Component<BaselineDetectListProps, BaselineDetectListState> {
    constructor(props: any) {
        super(props);
        const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
        this.state = {
            ignoredBLCheckItem_array,
            ignoredBLCheckItem: [], // 添加被忽略的 check_name 数组
            showIgnoredModal: false, // 新增
            ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array),
            currentRecord: null, // 当前选中的记录
            selectedVulnUuid: '', // 添加状态来存储当前选中的基线检查项 id
            showModal: false, // 控制模态框显示

            count: 0,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            selectedDateRange: [null, null],
            isSidebarOpen: false,
            currentTime: new Date().toLocaleString(), // 添加用于存储当前时间的状态变量
            riskItemCount: 5,
            currentPanel: 'linux',
            baselineDetectColumns : [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    Maxwidth: '15px',
                },
                {
                    title: '主机名',
                    dataIndex: 'uuid',
                    key: 'uuid',
                    render: (text: string, record: any) => (
                        <div>
                            <div>
                                <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                                    <Button style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#4086FF',
                                        padding: '0 0',
                                    }}>
                                        <Tooltip title={record.uuid}>
                                            <div style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '80px',
                                            }}>
                                                {record.uuid || '-'}
                                            </div>
                                        </Tooltip>
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
                    title: '基线名称',
                    dataIndex: 'check_name',
                    render: (text: string, record: any) => (
                        <Tooltip title={record.check_name}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                {record.check_name}
                            </div>
                        </Tooltip>
                    ),
                },
                {
                    title: '检查详情',
                    dataIndex: 'details',
                    render: (text: string, record: any) => (
                        <Tooltip title={record.details}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                {record.details}
                            </div>
                        </Tooltip>
                    ),
                },
                {
                    title: '调整建议',
                    dataIndex: 'adjustment_requirement',
                    filters: [
                        { text: '建议调整', value: '建议调整' }, { text: '自行判断', value: '自行判断' },
                    ],
                    onFilter: (value: string | number | boolean, record: any) => record.adjustment_requirement.includes(value as string),
                    render: (text: string, record: any) => (
                        <Tooltip title={record.instruction}>
                            {text}
                        </Tooltip>
                    ),
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    filters: [{ text: 'true', value: 'true' }, { text: 'fail', value: 'fail' },
                    ],
                    onFilter: (value: string | number | boolean, record: any) => record.status.includes(value as string),
                },
                {
                    title: '最新扫描时间',
                    dataIndex: 'last_checked',
                    // sorter: (a: any, b: any) => parseFloat(b.last_checked) - parseFloat(a.last_checked),
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (text: string, record: any) => (
                        <Button onClick={() => this.toggleModal(record)} className="custom-link-button"
                                disabled={
                            (JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}')[record.uuid] || [])
                                .includes(record.check_name)
                        }
                                style={{
                                    fontWeight: 'bold',
                                    border: 'transparent',
                                    backgroundColor: 'transparent',
                                    color: '#4086FF',
                                }}>忽略</Button>
                    ),
                },
            ],
        };

    }

    getIgnoredBLCheckItemData = (ignoredBLCheckItem_array: { [uuid: string]: string[] }) => {
        return Object.keys(ignoredBLCheckItem_array).map(uuid => ({
            uuid,
            BLCheckItem: ignoredBLCheckItem_array[uuid].join(', '),
        }));
    };
    getIgnoredBLItemCount = (ignoredBLCheckItem_array: { [uuid: string]: string[] }) => {
        return Object.values(ignoredBLCheckItem_array).reduce((count, BLCheckItem) => count + BLCheckItem.length, 0);
    };
    handleIgnoreBLButtonClick = async (record: any) => {
        try {
            // message.info("handleIgnoreBLButtonClick:"+record.uuid);
            const { ignoredBLCheckItem_array } = this.state;
            if (!ignoredBLCheckItem_array[record.uuid]) {
                ignoredBLCheckItem_array[record.uuid] = [];
            }
            // message.info("record.uuid:"+record.uuid)
            ignoredBLCheckItem_array[record.uuid].push(record.check_name);
            localStorage.setItem('ignoredBLCheckItem_array', JSON.stringify(ignoredBLCheckItem_array));

            this.setState({
                currentRecord: null,
                ignoredBLCheckItem_array,
                ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array),
            });
        } catch (error) {
            console.error('请求错误:', error);
        }
    };
    showIgnoredBLCheckItemsModal = () => {
        const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
        this.setState({
            showIgnoredModal: true,
            ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array),
        });
    };
    handleRemoveBLIgnored = (uuid: string) => {
        const ignoredBLCheckItem_array = JSON.parse(localStorage.getItem('ignoredBLCheckItem_array') || '{}');
        delete ignoredBLCheckItem_array[uuid];
        localStorage.setItem('ignoredBLCheckItem_array', JSON.stringify(ignoredBLCheckItem_array));
        this.setState({
            ignoredBLCheckItem_array,
            ignoredBLCheckItemData: this.getIgnoredBLCheckItemData(ignoredBLCheckItem_array),
        });
    };
    renderBLIgnoreModal = () => {
        return (
            <div>
                <Modal
                    wrapClassName="vertical-center-modal"
                    visible={this.state.showIgnoredModal}
                    title="忽略的检查项"
                    onCancel={() => this.setState({ showIgnoredModal: false })}
                    footer={null}
                    width={600}
                    style={{ top: 20 }}
                >
                    <Table
                        className="customTable"
                        dataSource={this.state.ignoredBLCheckItemData}
                        rowKey="uuid"
                        pagination={{ pageSize: 5 }}
                        columns={[
                            {
                                title: 'UUID',
                                dataIndex: 'uuid',
                                key: 'uuid',
                                render: (text: string, record: any) => (
                                    <div>
                                        <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                                            <Button
                                                style={{
                                                    fontWeight: 'bold',
                                                    border: 'transparent',
                                                    backgroundColor: 'transparent',
                                                    color: '#4086FF',
                                                    padding: '0 0',
                                                }}
                                            >
                                                <Tooltip title={record.uuid}>
                                                    <div
                                                        style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '150px', // 调整最大宽度
                                                        }}
                                                    >
                                                        {record.uuid || '-'}
                                                    </div>
                                                </Tooltip>
                                            </Button>
                                        </Link>
                                    </div>
                                ),
                            },
                            {
                                title: '检查项名称',
                                dataIndex: 'BLCheckItem',
                                key: 'BLCheckItem',
                                render: (text: string) => (
                                    <div>
                                        <Tooltip title={text}>
                                            <div
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '150px', // 调整最大宽度
                                                }}
                                            >
                                                {text || '-'}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: '操作',
                                key: 'action',
                                render: (_, record) => (
                                    <Button
                                        style={{
                                            fontWeight: 'bold',
                                            padding: '0 0',
                                            border: 'transparent',
                                            backgroundColor: 'transparent',
                                            color: '#4086FF',
                                        }}
                                        onClick={() => this.handleRemoveBLIgnored(record.uuid)}
                                    >
                                        移出白名单
                                    </Button>
                                ),
                            },
                        ]}

                        scroll={{ y: 240 }}
                    />
                </Modal>
            </div>
        );
    };

    toggleModal = (record = null) => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            currentRecord: record, // 设置当前记录，以便后续操作
        }));
    };
    handleOk = async () => {
        // 处理忽略操作
        const record = this.state.currentRecord;
        if (record) {
            // 调用API
            // 假设API调用的逻辑是放在handleIgnoreBLButtonClick方法中实现的
            await this.handleIgnoreBLButtonClick(record);
        }
        this.toggleModal(); // 关闭模态框
    };
    handleCancel = () => {
        this.toggleModal(); // 关闭模态框
    };
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
                        <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }}
                                onClick={this.handleOk}>
                            是
                        </Button>,
                    ]}
                    //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
                >
                    确认忽略选中的基线基线检查项?
                </Modal>
            </>
        );
    };

    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };
    toggleSidebar = () => {
        this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
        this.setCurrentTime();
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

    renderCurrentPanel(linuxBaseLineCheckOriginData: any[], windowsBaseLineCheckOriginData: any[]) {
        if(linuxBaseLineCheckOriginData===undefined||windowsBaseLineCheckOriginData===undefined){
            return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LoadingOutlined style={{ fontSize: '3em' }} />
            </div>
            );
        }
        else{
            const { currentPanel } = this.state;
            const data = currentPanel==="windows"?windowsBaseLineCheckOriginData:linuxBaseLineCheckOriginData
            const originDataArray = Array.isArray(data) ? data : [data];
            const api = currentPanel==="windows"?BaseLine_windows_Data_API:BaseLine_linux_Data_API;
            return (
                <div>
                    <DataDisplayTable
                        key={currentPanel+this.state.count}
                        externalDataSource={originDataArray}
                        apiEndpoint={api}
                        timeColumnIndex={['last_checked']}
                        columns={this.state.baselineDetectColumns}
                        currentPanel={currentPanel === 'windows' ? 'baseLine_check_windows' : 'baseLine_check_linux'}
                        searchColumns={['uuid', 'check_name']}
                    />
                </div>
            );
                // <Row style={{ width: '100%' }}>
                    {/*<FetchDataForElkeidTable*/}
                    {/*    key={currentPanel+this.state.count}*/}
                    {/*    apiEndpoint={APP_Server_URL+'/api/baseline_check/' + currentPanel + '/all'}*/}
                    {/*    timeColumnIndex={['last_checked']}*/}
                    {/*    columns={this.state.baselineDetectColumns}*/}
                    {/*    currentPanel={currentPanel === 'windows' ? 'baseLine_check_windows' : 'baseLine_check_linux'}*/}
                    {/*    search={['uuid', 'check_name']}*/}
                    {/*    handleReload={this.handleReload}*/}
                    {/*/>*/}
                {/*</Row>*/}
        }
    }


    render() {
        const { isSidebarOpen, selectedDateRange, currentTime } = this.state;
        // Conditional button style

        const IgnoredBLItemCount = this.getIgnoredBLItemCount(this.state.ignoredBLCheckItem_array);
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return <div>Loading...</div>; // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const {
                        linuxBaseLineCheckOriginData,
                        windowsBaseLineCheckOriginData,
                        blLinuxHostCount,
                        blWindowsHostCount,
                        blLinuxNeedAdjustmentItemCount,
                        blWindowsNeedAdjustmentItemCount,
                        blWindowsCheckNameCount,
                        blLinuxCheckNameCount,
                    } = context;


                    //const hostCheckedPassedCount = linuxBaseLineCheckMetaData_status.typeCount.get('TRUE');//检查通过数量
                    const hostCheckedPassedRate = 1 - ((blLinuxNeedAdjustmentItemCount || 0) + (blWindowsNeedAdjustmentItemCount || 0)) / (blWindowsCheckNameCount + blLinuxCheckNameCount);

                    const scanResult: StatusItem[] = [
                        {
                            color: '#E53F3F',
                            label: '严重风险项',
                            value: blWindowsCheckNameCount + blLinuxCheckNameCount-(blLinuxNeedAdjustmentItemCount || 0) + (blWindowsNeedAdjustmentItemCount || 0)
                        },
                        // { color: '#846BCE', label: '高危风险项', value: 5 },
                        // { color: '#FEC745', label: '中危风险项', value: 1 },
                        // { color: '#468DFF', label: '低危风险项', value: 1 },
                        { color: 'green', label: '通过项', value: (blLinuxNeedAdjustmentItemCount || 0) + (blWindowsNeedAdjustmentItemCount || 0) },
                    ];

                    return (
                        <div style={{ fontFamily: 'YouYuan, sans-serif', fontWeight: 'bold' }}>
                            {this.renderBLIgnoreModal()}
                            {this.renderModal()}
                            <Row gutter={[12, 6]}/*(列间距，行间距)*/>
                                <Col md={24}>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                                        <Col md={24}>
                                            <Card bordered={false} /*title="主机状态分布" 产生分界线*/
                                                  style={{ fontWeight: 'bolder', width: '100%', height: 220 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>基线概览</h2>
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col md={6} style={{ marginLeft: '15px', marginTop: '10px' }}>
                                                        <div className="container" style={{
                                                            // borderTop: '2px solid #E5E6EB',
                                                            // borderBottom: '2px solid #E5E6EB',
                                                            // borderLeft: '2px solid #E5E6EB',
                                                            borderRight: '2px solid #E5E6EB',
                                                        }}>
                                                            <Row gutter={24}>
                                                                <Row>
                                                                    <h2 style={{ fontSize: '16px' }}>最近扫描时间: </h2>
                                                                </Row>
                                                                <Row>
                                                                <span className="currentTime"
                                                                      style={{ marginRight: '10px' }}>{currentTime}
                                                                </span>
                                                                </Row>
                                                                    <Row>
                                                                        <Button
                                                                            style={{
                                                                                backgroundColor: '#1664FF',
                                                                                color: 'white',
                                                                                marginRight: '10px',
                                                                                transition: 'opacity 0.3s', // 添加过渡效果
                                                                                opacity: 1, // 初始透明度
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.opacity = 0.7;
                                                                            }} // 鼠标进入时将透明度设置为0.5
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.opacity = 1;
                                                                            }} // 鼠标离开时恢复透明度为1
                                                                            onClick={this.toggleSidebar}>立即扫描</Button>
                                                                        <Button
                                                                            onClick={this.showIgnoredBLCheckItemsModal}>白名单</Button>
                                                                    </Row>
                                                            </Row>
                                                                    <div
                                                                        className={isSidebarOpen ? 'overlay open' : 'overlay'}
                                                                        onClick={this.closeSidebar} />
                                                                    <div
                                                                        className={isSidebarOpen ? 'smallsidebar open' : 'smallsidebar'}>
                                                                        <button onClick={this.toggleSidebar}
                                                                                className="close-btn">&times;</button>
                                                                        <BaseLineDetectScanSidebar
                                                                            scanInfo={['基线检查', '基线扫描中，请稍后', '返回基线列表，查看详情']}
                                                                            statusData={scanResult}
                                                                            hostCount={blLinuxHostCount+blWindowsHostCount}
                                                                            riskItemCount={(blLinuxNeedAdjustmentItemCount || 0) + (blWindowsNeedAdjustmentItemCount || 0)} // 传递风险项的数量
                                                                            isSidebarOpen={this.state.isSidebarOpen}
                                                                            toggleSidebar={this.toggleSidebar}
                                                                        />
                                                                    </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
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
                                                                    <Statistic title={<span style={{fontSize:'18px'}}>最近检查通过率</span>}
                                                                               value={(hostCheckedPassedRate * 100).toString().slice(0, 4) + '%'} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col md={4}>
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
                                                                    <Statistic title={<span style={{fontSize:'18px'}}>检查主机数</span>}
                                                                               value={blLinuxHostCount + blWindowsHostCount} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col md={4}>
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
                                                                    <Statistic title={<span style={{fontSize:'18px'}}>检查项</span>}
                                                                               value={blWindowsCheckNameCount + blLinuxCheckNameCount} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col md={4}>
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
                                                                    <Statistic title={<span style={{fontSize:'18px'}}>忽略项</span>}
                                                                               value={IgnoredBLItemCount} />
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
                                    <Card bordered={false}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 16,
                                                fontWeight: 'bold',
                                            }}>
                                                <h2 style={{
                                                    fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                    fontWeight: 'bold', marginLeft: '0px',fontSize:'18px' }}>基线内容</h2>
                                            </div>
                                            <Menu
                                                onClick={this.handleMenuClick}
                                                selectedKeys={[this.state.currentPanel]}
                                                mode="horizontal"
                                                style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                            >
                                                <Menu.Item key="linux">Linux基线检查</Menu.Item>
                                                <Menu.Item key="windows">Windows基线检查</Menu.Item>
                                                {/* 可以根据需要添加更多的Menu.Item */}
                                                {/* 使用透明div作为flex占位符 */}
                                                <div style={{ flexGrow: 1 }}></div>

                                            </Menu>
                                            {/*<Card bordered={false}>*/}
                                            {/*    {this.renderCurrentPanel(linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData)}*/}
                                            {/*</Card>*/}
                                            <div style={{ marginTop: '20px' }}>
                                                {this.renderCurrentPanel(linuxBaseLineCheckOriginData, windowsBaseLineCheckOriginData)}
                                            </div>
                                        </Card>
                                </Col>
                                {/*<Link to="/app/baseline_detail" target="_blank">*/}
                                {/*    <Button type="link" className="custom-link-button">基线检查详情</Button>*/}
                                {/*</Link>*/}
                            </Row>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        );

    }
}


export default BaselineDetectList;