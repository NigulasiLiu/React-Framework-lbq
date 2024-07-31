import React from 'react';
import { Row, Col, Card, Button, Statistic, Menu, Modal, Table, Tooltip, message, Descriptions, Input } from 'antd';
import { Link } from 'react-router-dom';
import FileUpload from './FileUpload';
import VirusScanningTaskSidebar from './VirusScanTableSidebar';
import VirusScanProcessSidebar from '../SideBar/ScanProcessSidebar';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import { FilterDropdownProps, StatusItem } from '../Columns';

import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { ExclamationCircleOutlined, LoadingOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { APP_Server_URL, Virus_Data_API, Virus_Scan, Virus_Upload_File } from '../../service/config';
import umbrella from 'umbrella-storage';
import axios from 'axios';
import { blueButton, cancelButton } from '../../style/config';
import moment from 'moment';

interface VirusScanningProps {
    hostuuid: string;
    pageWidth?: number;
};

interface VirusScanningState {
    count: number;
    deleteIndex: number | null;
    currentTime: string;
    activeIndex: any;

    isSidebarOpen: boolean;
    isScanningProcessSidebarOpen: boolean;
    riskItemCount: number;

    sidebarKey: number; // 添加这个状态
    // isLoading: boolean; // 添加 isLoading 状态
    // scanProgress: number; // 添加 scanProgress 状态

    // virusscanningColumns: any[];
    columns: any[];


    ignoredVirus_array: { [md5: string]: string[] }; // 修改为键值对形式存储
    ignoredVirus: any[], // 添加被忽略的 Virus 数组
    showIgnoredModal: boolean; // 新增
    ignoredVirusData: { md5: string; filename: string }[]; // 新增
    showModal: boolean, // 控制模态框显示
    encryptModalVisible: boolean,
    showUpload: boolean,

    currentRecord: any, // 当前选中的记录
    selectedVulnUuid: string;
};


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
              marginRight: '8px',
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

class VirusScanning extends React.Component<VirusScanningProps, VirusScanningState> {
    constructor(props: any) {
        super(props);
        const ignoredVirus_array = JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}');
        this.state = {
            ignoredVirus_array,
            ignoredVirus: [], // 添加被忽略的 Virus 数组
            showIgnoredModal: false, // 新增
            ignoredVirusData: this.getIgnoredVirusData(ignoredVirus_array),
            currentRecord: null, // 当前选中的记录
            selectedVulnUuid: '', // 添加状态来存储当前选中的基线风险项 id
            showModal: false, // 控制模态框显示
            encryptModalVisible: false,

            showUpload: false,

            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1],
            isSidebarOpen: false,
            isScanningProcessSidebarOpen: false,
            currentTime: new Date().toLocaleString(), // 添加用于存储当前时间的状态变量
            riskItemCount: 5, // 初始化风险项的数量
            sidebarKey: 0, // 初始化 sidebarKey


            // virusscanningColumns: [
            //     {
            //         title: 'ID',
            //         dataIndex: 'id',
            //         key: 'id',
            //         Maxwidth: '20px',
            //         hide: true, // 添加隐藏属性
            //     },
            //     {
            //         title: '主机名',
            //         dataIndex: 'uuid',
            //         key: 'uuid',
            //         render: (text: string, record: runningProcessesColumnsType) => (
            //             <div>
            //                 <div>
            //                     <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid || 'defaultUUID')}`} target="_blank">
            //                         <Button style={{
            //                             fontWeight: 'bold',
            //                             border: 'transparent',
            //                             backgroundColor: 'transparent',
            //                             color: '#4086FF',
            //                             padding: '0 0',
            //                         }}>
            //                             <Tooltip title={record.uuid}>
            //                                 <div style={{
            //                                     whiteSpace: 'nowrap',
            //                                     overflow: 'hidden',
            //                                     textOverflow: 'ellipsis',
            //                                     maxWidth: '80px',
            //                                 }}>
            //                                     {record.uuid || '-'}
            //                                 </div>
            //                             </Tooltip>
            //                         </Button>
            //                     </Link>
            //                 </div>
            //                 <div style={{
            //                     fontSize: 'small', // 字体更小
            //                     background: '#f0f0f0', // 灰色背景
            //                     padding: '2px 4px', // 轻微内边距
            //                     borderRadius: '2px', // 圆角边框
            //                     display: 'inline-block', // 使得背景色仅围绕文本
            //                     marginTop: '4px', // 上边距
            //                 }}>
            //                     <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.agentIP}
            //                 </div>
            //             </div>
            //         ),
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>文件名</span>,
            //         dataIndex: 'Virus',
            //         key: 'Virus',
            //         //width: '13%',
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>告警名称</span>,
            //         dataIndex: 'alarmName',
            //         //width: '13%',
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>影响资产</span>,
            //         dataIndex: 'affectedAsset',
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>级别</span>,
            //         dataIndex: 'tz',
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>MD5</span>,
            //         dataIndex: 'level',
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>状态</span>,
            //         dataIndex: 'status',
            //         filters: [
            //             { text: '已处理', value: '已处理' },
            //             { text: '未处理', value: '未处理' },
            //         ],
            //         onFilter: (value: string | number | boolean, record: AlertDataType) => record.status.includes(value as string),
            //     },
            //     {
            //         title: () => <span style={{ fontWeight: 'bold' }}>发生时间</span>,
            //         dataIndex: 'occurrenceTime',
            //     },
            //     {
            //         title: '操作',
            //         dataIndex: 'operation',
            //         render: (text: string, record: any) => (
            //             <div>
            //                 <Button onClick={() => this.toggleModal(record)} className="custom-link-button"
            //                         disabled={
            //                             (JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}')[record.uuid] || [])
            //                                 .includes(record.Virus)
            //                         }
            //                         style={{
            //                             fontWeight: 'bold',
            //                             border: 'transparent',
            //                             backgroundColor: 'transparent',
            //                             color: '#000000',
            //                         }}>忽略</Button>
            //                 <Button onClick={() => this.showEncryptModal(record)}
            //                         disabled={
            //                             (JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}')[record.uuid] || [])
            //                                 .includes(record.Virus)
            //                         }
            //                         style={{
            //                             fontWeight: 'bold',
            //                             border: 'transparent',
            //                             backgroundColor: 'transparent',
            //                             color: '#4086FF',
            //                         }}>隔离</Button>
            //             </div>
            //         ),
            //     },
            // ],
            columns:[
                // {
                //     title: 'ID',
                //     dataIndex: 'id',
                //     key: 'id'
                // },
                {
                    title: '告警',
                    dataIndex: 'alert',
                    key: 'alert'
                },
                {
                    title: '文件名',
                    dataIndex: 'filename',
                    key: 'filename',
                },
                {
                    title: '文件MD5',
                    dataIndex: 'md5',
                    key: 'md5'
                },
                {
                    title: '时刻',
                    dataIndex: 'time',
                    key: 'time',
                    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
                    sorter: (a: any, b: any) => parseFloat(b.time) - parseFloat(a.time),
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (text: string, record: any) => (
                        <div>
                            <Button onClick={() => this.toggleModal(record)} className="custom-link-button"
                                    disabled={
                                        (JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}')[record.md5] || [])
                                            .includes(record.Virus)
                                    }
                                    style={{
                                        fontWeight: 'bold',
                                        border: 'transparent',
                                        backgroundColor: 'transparent',
                                        color: '#000000',
                                    }}>忽略</Button>
                                    {/*<Button onClick={() => this.showEncryptModal(record)}*/}
                                    {/*disabled={*/}
                                    {/*    (JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}')[record.md5] || [])*/}
                                    {/*        .includes(record.filename)*/}
                                    {/*}*/}
                                    {/*style={{*/}
                                    {/*    fontWeight: 'bold',*/}
                                    {/*    border: 'transparent',*/}
                                    {/*    backgroundColor: 'transparent',*/}
                                    {/*    color: '#4086FF',*/}
                                    {/*}}>隔离</Button>*/}
                        </div>
                    ),
                },
            ],

            // isLoading: false, // 初始化 isLoading 为 false
            // scanProgress: 0, // 初始化 scanProgress 为 0
        };
    }

    // 点击立即扫描按钮的处理函数


    toggleProcessSidebar = () => {
        this.setState((prevState) => ({ isScanningProcessSidebarOpen: !prevState.isScanningProcessSidebarOpen }));
        this.setCurrentTime();
    };
    closeProcessSidebar = () => {
        this.setState((prevState) => ({ isScanningProcessSidebarOpen: !prevState.isScanningProcessSidebarOpen }));
    };

    toggleTaskSidebar = () => {
        this.setState(prevState => ({
            isSidebarOpen: !prevState.isSidebarOpen,
            sidebarKey: prevState.sidebarKey + 1, // 更新 sidebarKey
        }));
        this.setCurrentTime();
    };

    closeTaskSidebar = () => {
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

    getIgnoredVirusData = (ignoredVirus_array: { [md5: string]: string[] }) => {
        return Object.keys(ignoredVirus_array).map(md5 => ({
            md5,
            filename: ignoredVirus_array[md5].join(', '),
        }));
    };
    getIgnoredVirusItemCount = (ignoredVirus_array: { [md5: string]: string[] }) => {
        return Object.values(ignoredVirus_array).reduce((count, Virus) => count + Virus.length, 0);
    };
    handleIgnoreVirusButtonClick = async (record: any) => {
        try {
            // message.info("handleIgnoreVirusButtonClick:"+record.uuid);
            const { ignoredVirus_array } = this.state;
            if (!ignoredVirus_array[record.md5]) {
                ignoredVirus_array[record.md5] = [];
            }
            // message.info("record.uuid:"+record.uuid)
            ignoredVirus_array[record.md5].push(record.filename);
            localStorage.setItem('ignoredVirus_array', JSON.stringify(ignoredVirus_array));

            this.setState({
                currentRecord: null,
                ignoredVirus_array,
                ignoredVirusData: this.getIgnoredVirusData(ignoredVirus_array),
            });
        } catch (error) {
            console.error('请求错误:', error);
        }
    };
    showIgnoredVirusModal = () => {
        const ignoredVirus_array = JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}');
        this.setState({
            showIgnoredModal: true,
            ignoredVirusData: this.getIgnoredVirusData(ignoredVirus_array),
        });
    };
    handleRemoveVirusIgnored = (md5: string) => {
        const ignoredVirus_array = JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}');
        delete ignoredVirus_array[md5];
        localStorage.setItem('ignoredVirus_array', JSON.stringify(ignoredVirus_array));
        this.setState({
            ignoredVirus_array,
            ignoredVirusData: this.getIgnoredVirusData(ignoredVirus_array),
        });
    };
    renderVirusIgnoreModal = () => {
        return (
            <div>
                <Modal
                    wrapClassName="vertical-center-modal"
                    visible={this.state.showIgnoredModal}
                    title="忽略的风险项"
                    onCancel={() => this.setState({ showIgnoredModal: false })}
                    footer={null}
                    width={600}
                    style={{ top: 20 }}
                >
                    <Table
                        className="customTable"
                        dataSource={this.state.ignoredVirusData}
                        rowKey="md5"
                        pagination={{ pageSize: 5 }}
                        columns={[
                            {
                                title: 'MD5',
                                dataIndex: 'md5',
                                key: 'md5',
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
                                title: '风险文件',
                                dataIndex: 'filename',
                                key: 'filename',
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
                                        onClick={() => this.handleRemoveVirusIgnored(record.md5)}
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
            await this.handleIgnoreVirusButtonClick(record);
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
                        <Button key="back" onClick={this.handleCancel} {...blueButton}>
                            取消
                        </Button>,
                        <Button key="submit"
                                onClick={this.handleOk}>
                            是
                        </Button>,
                    ]}
                    //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
                >
                    确认忽略选中的危险项?
                </Modal>
            </>
        );
    };

// 隔离Modal，并设置当前行数据
    showEncryptModal = (record: any) => {
        this.setState({
            encryptModalVisible: true,
            currentRecord: record,
        });
    };

// 隐藏Modal
    hideEncryptModal = () => {
        this.setState({
            encryptModalVisible: false,
            currentRecord: {},
        });
    };

// 处理添加隔离提交
    handleEncryptSubmit = async () => {
        const { currentRecord } = this.state;
        // 构建请求体，这里假设currentRecord中含有需要的所有信息
        const postData = {
            uuid: currentRecord.uuid, // 假设agent_ip是表格中的一列
            filename: currentRecord.origin_filename,
            filepath: currentRecord.origin_filepath,
        };

        try {
            const token = localStorage.getItem('jwt_token');
            // 配置axios请求头部，包括JWT
            const config = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined, // 如果存在token则发送，否则不发送Authorization头部
                },
            };
            const response = await axios.post(APP_Server_URL + '/api/isolate/encrypt', postData, config);
            if (response.data.code === 200) {
                message.success('文件隔离成功');
            } else {
                message.error('文件隔离失败: ' + response.data.message);
            }
        } catch (error) {
            console.error('添加隔离请求错误:', error);
            message.error('文件隔离请求发送失败');
        }
        this.hideEncryptModal();
    };
    renderEncryptModal = () => {
        return (
            <Modal
                title="添加隔离文件"
                visible={this.state.encryptModalVisible}
                onOk={this.handleEncryptSubmit}
                onCancel={this.hideEncryptModal}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ style: { backgroundColor: '#1664FF', borderColor: '#1890ff', color: '#fff' } }}
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Agent UUID">{this.state.currentRecord.uuid}</Descriptions.Item>
                    <Descriptions.Item label="文件名称">{this.state.currentRecord.origin_filename}</Descriptions.Item>
                    <Descriptions.Item label="文件路径">{this.state.currentRecord.origin_file_path}</Descriptions.Item>
                </Descriptions>
            </Modal>
        );
    };


    handleOpenUpload = () => {
        this.setState({ showUpload: true });
    };

    handleCloseUpload = () => {
        this.setState({ showUpload: false });
    };
    handleScan = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            const response = await axios.post(Virus_Scan,[],{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            if (response.data.status === 200) {
                console.log('扫描任务创建成功');
            } else {
                console.log(`扫描任务创建失败: ${response.data.message}`);
            }
        } catch (error) {
            console.log(`扫描任务创建失败: ${error.message}`);
        }
    };

    render() {
        const { isSidebarOpen, isScanningProcessSidebarOpen, currentTime } = this.state;

        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    const { virusOriginData} = context;
                    const originDataArray = Array.isArray(virusOriginData) ? virusOriginData : [virusOriginData];

                    let totalCount = 0;
                    let highRiskCount = 0;
                    let mediumRiskCount = 0;
                    let lowRiskCount = 0;
                    if (this.props.hostuuid && this.props.hostuuid !== 'default' && virusOriginData !== undefined) {
                        totalCount = originDataArray.filter(Item => Item.uuid === this.props.hostuuid).length;
                    } else {
                        totalCount = Array.isArray(virusOriginData) ?originDataArray.flat().length:0;
                    }

                    const DataArray = (this.props.hostuuid && this.props.hostuuid !== 'default') ?
                        originDataArray.filter(Item => Item.uuid === this.props.hostuuid) : originDataArray;

                    DataArray.forEach(item => {
                        if (item && Array.isArray(item.vul_detection_exp_result)) {
                            item.vul_detection_exp_result.forEach((result: { type: any; }) => {
                                if (result && typeof result.type === 'number') {
                                    switch (result.type) {
                                        case 0:
                                            highRiskCount++;
                                            break;
                                        case 1:
                                            mediumRiskCount++;
                                            break;
                                        case 2:
                                            lowRiskCount++;
                                            break;
                                        default:
                                            console.warn(`Unexpected risk type: ${result.type}`);
                                            break;
                                    }
                                } else {
                                    console.warn('Invalid result or result.type', result);
                                }
                            });
                        } else {
                            console.warn('Invalid item or item.vul_detection_exp_result', item);
                        }
                    });

                    const virusstatusData: StatusItem[] = [
                        { color: '#EA635F', label: '风险项', value: totalCount },
                        { color: '#846CCE', label: '高风险 ', value: highRiskCount },
                        { color: '#FEC746', label: '中风险 ', value: mediumRiskCount },
                        { color: '#468DFF', label: '低风险 ', value: lowRiskCount },
                    ];
                    const virusScanningData = [
                        {
                            id: 1,
                            uuid: 'host-123',
                            agentIP: '192.168.1.1',
                            Virus: 'file1',
                            alarmName: 'Virus Detected',
                            affectedAsset: 'Server1',
                            tz: '高',
                            level: 'abcd1234',
                            status: '未处理',
                            occurrenceTime: '2023-06-01 12:00:00',
                            operation: '操作项',
                        },
                        {
                            id: 2,
                            uuid: 'host-456',
                            agentIP: '192.168.1.2',
                            Virus: 'file2',
                            alarmName: 'Malware Detected',
                            affectedAsset: 'Server2',
                            tz: '中',
                            level: 'efgh5678',
                            status: '已处理',
                            occurrenceTime: '2023-06-02 15:30:00',
                            operation: '操作项',
                        },
                        // 你可以添加更多的测试数据
                    ];

                    const IgnoredVirusCount = this.getIgnoredVirusItemCount(this.state.ignoredVirus_array);
                    return (
                        <div style={{
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold', width: '100%',
                        }}>
                            {/*{this.renderEncryptModal()}*/}
                            <Row gutter={[12, 6]}/*(列间距，行间距)*/>
                                <Col span={24}>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        {/* 每个 Col 组件占据 6 份，以确保在一行中平均分布 */}
                                        {this.renderModal()}
                                        {this.renderVirusIgnoreModal()}
                                        <FileUpload
                                            uploadUrl={Virus_Upload_File}
                                            scanUrl={Virus_Scan}
                                            visible={this.state.showUpload}
                                            onClose={this.handleCloseUpload}
                                        />
                                        <Col span={24}>
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
                                                    }}>病毒扫描</h2>
                                                </div>
                                                <Row gutter={[6, 6]}>
                                                    <Col span={5} style={{ marginLeft: '15px', marginTop: '10px' }}>
                                                        <div className="container">
                                                            <Row gutter={24}>
                                                                <h2 style={{ fontSize: '16px' }}>最近扫描时间: </h2>
                                                                <span className="currentTime" style={{
                                                                    marginRight: '10px',
                                                                    marginBottom: '8px',
                                                                }}>{currentTime}</span>
                                                                <Row>
                                                                    <Button
                                                                        onClick={this.handleOpenUpload}
                                                                        {...blueButton}>
                                                                        立即扫描
                                                                    </Button>
                                                                    {/*<Link to={"/app/create_virusscan_task"}*/}
                                                                    {/*      target="_blank">*/}
                                                                    {/*    <Button*/}
                                                                    {/*        onClick={this.handleScan}*/}
                                                                    {/*        // onClick={this.handleOpenUpload}*/}
                                                                    {/*        {...blueButton}>*/}
                                                                    {/*        立即扫描</Button>*/}
                                                                    {/*</Link>*/}
                                                                    <Button style={{
                                                                        marginRight: '10px',
                                                                    }}
                                                                            onClick={this.showIgnoredVirusModal}>白名单
                                                                    </Button>
                                                                    {/*<Button */}
                                                                    {/*        onClick={this.toggleTaskSidebar}>扫描记录*/}
                                                                    {/*</Button>*/}
                                                                </Row>
                                                                {/*<Row>*/}
                                                                {/*    <Button*/}
                                                                {/*        style={{*/}
                                                                {/*            marginLeft: '0px',*/}
                                                                {/*            marginTop: '10px',*/}
                                                                {/*        }}*/}
                                                                {/*        onClick={this.handleOpenUpload}*/}
                                                                {/*    >*/}
                                                                {/*        上传并扫描单个文件*/}
                                                                {/*    </Button>*/}
                                                                {/*</Row>*/}
                                                            </Row>
                                                            <div
                                                                className={isScanningProcessSidebarOpen ? 'overlay open' : 'overlay'}
                                                                onClick={this.closeProcessSidebar}></div>
                                                            {/*<div*/}
                                                            {/*    className={isScanningProcessSidebarOpen ? 'smallsidebar open' : 'smallsidebar'}>*/}
                                                            {/*    <button onClick={this.toggleProcessSidebar}*/}
                                                            {/*            className="close-btn">&times;</button>*/}
                                                            {/*    <VirusScanProcessSidebar*/}
                                                            {/*        scanInfo={['病毒扫描', '病毒扫描中，请稍后', '查看详情']}*/}
                                                            {/*        statusData={virusstatusData}*/}
                                                            {/*        hostCount={VirusHostCount}*/}
                                                            {/*        riskItemCount={this.state.riskItemCount} // 传递风险项的数量*/}
                                                            {/*        isSidebarOpen={this.state.isScanningProcessSidebarOpen}*/}
                                                            {/*        toggleSidebar={this.toggleProcessSidebar}*/}
                                                            {/*    />*/}
                                                            {/*</div>*/}

                                                            <div className={isSidebarOpen ? 'overlay open' : 'overlay'}
                                                                 onClick={this.closeTaskSidebar}></div>
                                                            <div className={isSidebarOpen ? 'sidebar open' : 'sidebar'}>
                                                                <button onClick={this.toggleTaskSidebar}
                                                                        className="close-btn">&times;</button>
                                                                <VirusScanningTaskSidebar
                                                                    key={this.state.sidebarKey} // 使用 sidebarKey 作为 key
                                                                    isSidebarOpen={this.state.isSidebarOpen}
                                                                    toggleSidebar={this.toggleTaskSidebar}
                                                                    sidebarWidth={1000}
                                                                />

                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col span={1} />
                                                    <Col span={8}>
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
                                                            <Row style={{
                                                                width: '100%',
                                                                marginTop: '0px',
                                                                paddingRight: '10px',
                                                            }}>
                                                                <Col span={8}
                                                                     style={{
                                                                         paddingTop: '20px',
                                                                         width: '400px',
                                                                         height: '90px',
                                                                     }}>
                                                                    <Statistic title={<span
                                                                        style={{ fontSize: '17px' }}>待处理风险项</span>}
                                                                               value={totalCount-IgnoredVirusCount} />
                                                                </Col>

                                                                <Col span={7}
                                                                     style={{ width: '400px', marginTop: '10px' }}>
                                                                    <CustomPieChart
                                                                        data={virusstatusData}
                                                                        innerRadius={27}
                                                                        deltaRadius={2}
                                                                        outerRadius={33}
                                                                        cardWidth={90}
                                                                        cardHeight={90}
                                                                        hasDynamicEffect={true}
                                                                    />
                                                                </Col>
                                                                {/*<Col span={9} style={{ width: '400px' }}>*/}
                                                                {/*    <CustomPieChart*/}
                                                                {/*        data={virusstatusData}*/}
                                                                {/*        innerRadius={24}*/}
                                                                {/*        outerRadius={30}*/}
                                                                {/*        deltaRadius={2}*/}
                                                                {/*        //cardWidth={200}*/}
                                                                {/*        cardHeight={90}*/}
                                                                {/*        hasDynamicEffect={true}*/}
                                                                {/*    />*/}
                                                                {/*</Col>*/}
                                                                <Col span={7}
                                                                     style={{
                                                                         width: '400px',
                                                                         height: '100px',
                                                                         paddingTop: '5px',
                                                                     }}>
                                                                    <StatusPanel statusData={virusstatusData}
                                                                                 orientation="vertical" />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col span={1} />
                                                    <Col span={5} style={{ marginLeft: '10px' }}>
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
                                                                <Col span={24} style={{
                                                                    marginRight: '100px',
                                                                    transform: 'translateX(-80px)',
                                                                }}>
                                                                    <Statistic title={<span
                                                                        style={{ fontSize: '17px' }}>忽略项</span>}
                                                                               value={IgnoredVirusCount} />
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
                                                }}>扫描结果</h2>
                                            </div>
                                            {/*<DataDisplayTable*/}
                                            {/*    key={'VirusScanning'}*/}
                                            {/*    externalDataSource={virusOriginData}*/}
                                            {/*    apiEndpoint={Virus_Data_API}*/}
                                            {/*    timeColumnIndex={[]}*/}
                                            {/*    columns={this.state.columns}*/}
                                            {/*    currentPanel={'VirusScanning'}*/}
                                            {/*    searchColumns={['uuid']}*/}
                                            {/*/>*/}
                                            <Table
                                                key={'VirusScanning'}
                                                rowKey={'md5'}
                                                className={'customTable'}
                                                dataSource={virusOriginData}
                                                columns={this.state.columns}
                                                rowClassName={(record) => {
                                                    const ignoredVirus_array = JSON.parse(localStorage.getItem('ignoredVirus_array') || '{}');
                                                    const isIgnored = (md5: string, filename: any) => {
                                                        const ignoredViruses = ignoredVirus_array[md5] || [];
                                                        return ignoredViruses.includes(filename);
                                                    };
                                                    return isIgnored(record.md5, record.filename) ? 'ignored-row' : '';
                                                }}
                                            />
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}

export default VirusScanning;