import React from 'react';
import { Row, Col, Card, Menu } from 'antd';

import OverviewPanel from './OverviewPanel';
import {
    fimColumns,
    openPortsColumns,
    runningProcessesColumns, systemServicesColumns,
    GenericDataItem, StatusItem,
    constRenderTable, monitoredColumns,
} from '../Columns';
import DataDisplayTable from '../OWLTable/DataDisplayTable';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import { Assets_Data_API, Fim_Data_API, Monitor_Data_API, Port_Data_API, Process_Data_API } from '../../service/config';


type AssetFingerprintProps = {};
type AssetFingerprintState = {

    count: number;
    deleteIndex: number | null;

    activeIndex: any;

    statusData: StatusItem[]; // 初始状态
    currentPanel: string;


    sortedData: GenericDataItem[];
    triggerUpdated:number;
};


class AssetFingerprint extends React.Component<AssetFingerprintProps, AssetFingerprintState> {
    constructor(props: any) {
        super(props);
        this.columns = [];
        this.state = {
            statusData: [], // 初始状态
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图

            currentPanel: 'overview', // 默认选中的面板

            sortedData: [],
            triggerUpdated:0,
        };
    }

    setSortedData = (data: GenericDataItem[]) => {
        this.setState({ sortedData: data });
    };

    changePanel = (panelName: string) => {
        this.setState({ currentPanel: panelName });
    };


    columns: any;
    // 点击Menu.Item时调用的函数
    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };

    setStatusData() {
        // 本地定义的StatusItem数据
        const localStatusData: StatusItem[] = [
            { label: 'Created', value: 7, color: '#22BC44' }, //GREEN
            { label: 'Running', value: 2, color: '#FBB12E' }, //ORANGE
            { label: 'Exited', value: 5, color: '#EA635F' }, //RED
            { label: 'Unknown', value: 1, color: '#E5E8EF' }, //GREY
        ];

        // 更新状态
        this.setState({ statusData: localStatusData });
    }

    // 渲染当前激活的子面板
    renderCurrentPanel(monitoredOriginData:any[],fimOriginData:any[],assetOriginData:any[],
                       processOriginData:any[],portOriginData:any[],) {
        const { currentPanel } = this.state;
        console.log('this.state.currentPanel:' + currentPanel);
        switch (currentPanel) {
            case 'overview':
                return (
                    <OverviewPanel
                        changePanel={this.changePanel}
                        //topData={this.state.topData}
                        statusData={this.state.statusData}
                        currentPanel={currentPanel}
                    />
                );
            case 'fim':
                return (
                    <DataDisplayTable
                        key={currentPanel}
                        externalDataSource={fimOriginData}
                        apiEndpoint={Fim_Data_API}
                        timeColumnIndex={['event_time']}
                        columns={fimColumns}
                        currentPanel={currentPanel}
                        searchColumns={['uuid', 'filename']}
                    />
                );
            case 'monitored':
                return (
                    <DataDisplayTable
                        key={currentPanel}
                        externalDataSource={monitoredOriginData}
                        apiEndpoint={Monitor_Data_API}
                        timeColumnIndex={['timestamp']}
                        columns={monitoredColumns}
                        currentPanel={currentPanel}
                        searchColumns={['uuid', 'file_path']}
                    />
                );
            case 'open_ports':
                return (
                    <DataDisplayTable
                        key={currentPanel}
                        externalDataSource={portOriginData}
                        apiEndpoint={Port_Data_API}
                        timeColumnIndex={[]}
                        columns={openPortsColumns}
                        currentPanel={currentPanel}
                        searchColumns={['uuid', 'port_number', 'port_name']}
                    />
                );
            case 'running_processes':
                return (
                <DataDisplayTable
                    key={currentPanel}
                    externalDataSource={processOriginData}
                    apiEndpoint={Process_Data_API}
                    timeColumnIndex={['createTime']}
                    columns={runningProcessesColumns}
                    currentPanel={currentPanel}
                    searchColumns={['uuid', 'name']}
                />
                );
            case 'system_services':
                return (
                <DataDisplayTable
                    key={currentPanel}
                    externalDataSource={assetOriginData}
                    apiEndpoint={Assets_Data_API}
                    timeColumnIndex={[]}
                    columns={systemServicesColumns}
                    currentPanel={currentPanel}
                    searchColumns={['uuid', 'service', 'product', 'ostype']}
                />
                );

        }
    }


    render() {

        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const { monitoredOriginData,fimOriginData,assetOriginData,
                        processOriginData,portOriginData } = context;
                    // 将函数绑定到类组件的实例上

                    return (
                        <div style={{ fontFamily: 'YouYuan, sans-serif', fontWeight: 'bold' }}>
                            <div>
                                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                    <Col md={24}>
                                        <div className="gutter-box">
                                            <Card bordered={false}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 6,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>资产指纹</h2>
                                                </div>
                                                <Menu
                                                    onClick={this.handleMenuClick}
                                                    selectedKeys={[this.state.currentPanel]}
                                                    mode="horizontal"
                                                    style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                                >
                                                    <Menu.Item key="overview">总览</Menu.Item>
                                                    <Menu.Item key="open_ports">开放端口</Menu.Item>
                                                    <Menu.Item key="running_processes">运行进程</Menu.Item>
                                                    <Menu.Item key="system_services">系统服务</Menu.Item>
                                                    <Menu.Item key="fim">文件完整性检验</Menu.Item>
                                                    <Menu.Item key="monitored">文件监控</Menu.Item>
                                                    {/* <Menu.Item key="container">容器</Menu.Item> */}
                                                    {/* <Menu.Item key="system-users">系统用户</Menu.Item> */}
                                                    {/* <Menu.Item key="scheduled-tasks">定时任务</Menu.Item>
                                    <Menu.Item key="system-software">系统软件</Menu.Item>
                                    <Menu.Item key="applications">应用</Menu.Item> */}
                                                    {/* <Menu.Item key="kernel-modules">内核模块</Menu.Item> */}
                                                    {/* 可以根据需要添加更多的Menu.Item */}
                                                    {/* 使用透明div作为flex占位符 */}
                                                    <div style={{ flexGrow: 1 }}></div>

                                                </Menu>
                                                    <Card bordered={false}>{
                                                        this.renderCurrentPanel(monitoredOriginData,fimOriginData,assetOriginData,
                                                        processOriginData,portOriginData)}
                                                    </Card>
                                                </Card>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        )
    }
}

export default AssetFingerprint;
