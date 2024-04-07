import React from 'react';
import { Row, Col, Card, Menu, } from 'antd';
import FetchAPIDataTable from './FetchAPIDataTable';
import OverviewPanel from './OverviewPanel';
import MetaDataDisplay from './MetaDataDisplay';
import { fimColumns,
    openPortsColumns,
    runningProcessesColumns,systemServicesColumns,
    GenericDataItem, StatusItem } from '../tableUtils';


type AssetFingerprintProps = {};
type AssetFingerprintState = {
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

    count: number;
    deleteIndex: number | null;

    activeIndex: any;


    statusData: StatusItem[]; // 初始状态
    currentPanel: string;

    
    sortedData: GenericDataItem[];
};


class AssetFingerprint extends React.Component<AssetFingerprintProps, AssetFingerprintState> {
    constructor(props: any) {
        super(props);
        this.columns = [];
        this.state = {
            statusData: [], // 初始状态
            topData: {
                fim: [],
                container: [],
                openPorts: [],
                runningProcesses: [],
                systemUsers: [],
                scheduledTasks: [],
                systemServices: [],
                systemSoftware: [],
                kernelModules: [],
                applications: [],
                // 其他panel的初始化
            },
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图

            currentPanel: 'overview', // 默认选中的面板
            
            sortedData: [],
        };
    }
    setSortedData = (data:GenericDataItem[]) => {
        this.setState({ sortedData: data });
    };

    changePanel = (panelName: string) => {
        this.setState({ currentPanel: panelName });
    };

    //用于OverviewPanel筛选top5数据
    onTopDataChange = (panelName: string, data: GenericDataItem[]) => {
        this.setState((prevState) => ({
            topData: {
                ...prevState.topData,
                [panelName]: data,
            },
        }));
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
    renderCurrentPanel() {
        const {currentPanel} = this.state;
        console.log('this.state.currentPanel:'+currentPanel)
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
                    <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/api/FileIntegrityInfo/all"
                    timeColumnIndex={['event_time']}
                    columns={fimColumns}
                    currentPanel={currentPanel}
                    />
                );
            case 'open-ports':
                return (
                    <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/api/portinfo/all"
                    timeColumnIndex={[]}
                    columns={openPortsColumns}
                    currentPanel={currentPanel}
                    />
                );
            case 'running-processes':
                return (
                    <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/api/process/all"
                    timeColumnIndex={['createTime']}
                    columns={runningProcessesColumns}
                    currentPanel={currentPanel}
                    />
                );
                case 'system-services':
                    return (
                        <FetchAPIDataTable
                        apiEndpoint="http://localhost:5000/api/asset_mapping/all"
                        timeColumnIndex={[]}
                        columns={systemServicesColumns}
                        currentPanel={currentPanel}
                        />
                    );
            // case 'system-users':
            //     return (
            //         <FetchAPIDataTable
            //         apiEndpoint="http://localhost:5000/api/files/system-users"
            //         timeColumnIndex={[]}
            //         columns={systemUsersColumns}
            //         currentPanel={currentPanel}
            //         />
            //     );
            // case 'scheduled-tasks':
            //     return (
            //         <FetchAPIDataTable
            //         apiEndpoint="http://localhost:5000/api/files/scheduled-tasks"
            //         timeColumnIndex={[]}
            //         columns={scheduledTasksColumns}
            //         currentPanel={currentPanel}
            //         />
            //     );
            // case 'system-software':
            //     return (
            //         <FetchAPIDataTable
            //         apiEndpoint="http://localhost:5000/api/files/system-software"
            //         timeColumnIndex={[]}
            //         columns={systemSoftwareColumns}
            //         currentPanel={currentPanel}
            //         />
            //     );
            // case 'applications':
            //     return (
            //         <FetchAPIDataTable
            //         apiEndpoint="http://localhost:5000/api/files/applications"
            //         timeColumnIndex={[]}
            //         columns={applicationsColumns}
            //         currentPanel={currentPanel}
            //         />
            //     );
            // case 'kernel-modules':
            //     return (
            //         <FetchAPIDataTable
            //         apiEndpoint="http://localhost:5000/api/files/kernel-modules"
            //         timeColumnIndex={[]}
            //         columns={kernelModulesColumns}
            //         currentPanel={currentPanel}
            //         />
            //     );
                // case 'container':
                //     return (
                //         <FetchAPIDataTable
                //         apiEndpoint="http://localhost:5000/api/files/container"
                //         timeColumnIndex={[]}
                //         columns={containerColumns}
                //         currentPanel={currentPanel}
                //         />
                //     );

            // default:
            //     return (
            //         <OverviewPanel
            //             changePanel={this.changePanel}
            //             //topData={this.state.topData}
            //             statusData={this.state.statusData}
            //             currentPanel={'overview'}
            //         />
            //     );
        }
    }


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

        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <div>
                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                            <Col md={24}>
                                <div className="gutter-box">
                                <Card bordered={false}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 ,fontWeight: 'bold'}}>
                                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>资产指纹</h2>
                                    </div>
                                <Menu
                                    onClick={this.handleMenuClick}
                                    selectedKeys={[this.state.currentPanel]}
                                    mode="horizontal"
                                    style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                >
                                    <Menu.Item key="overview">总览</Menu.Item>
                                    <Menu.Item key="fim">文件完整性检验</Menu.Item>
                                    <Menu.Item key="open-ports">开放端口</Menu.Item>
                                    <Menu.Item key="running-processes">运行进程</Menu.Item>
                                    <Menu.Item key="system-services">系统服务</Menu.Item>
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
                                {/* 渲染当前激活的子面板 */}
                                <Card bordered={false}>{this.renderCurrentPanel()}</Card>
                                </Card>
                                </div>
                            </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default AssetFingerprint;
