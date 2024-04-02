import React from 'react';
import { Row, Col, Card, Menu,} from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { RouteComponentProps, withRouter, useLocation} from 'react-router-dom';
import HostOverview from './HostOverview';
import HostDetailsTable from './HostDetailsTable';
import {hostalertColumns, vulnerabilityColumns, baselineDetectColumns, onSelectChange} from '../tableUtils';
import AlertList from '../AlertList';
import VirusScanning from '../VirusScanning/VirusScanning';
import PerformanceMonitor from './PerformanceMonitor';
import { DataType } from './DetailsTableColumns'

// Define an interface for the individual status item
interface StatusItem {
    color: string;
    label: string;
    value: number;
}

// Define an interface for the props expected by the StatusPanel component
interface StatusPanelProps {
    statusData: StatusItem[];
}

interface DetailsPageProps extends RouteComponentProps<{ id: string }> {
    host_name:string;
  }
interface GenericDataItem {
    [key: string]: any;
}
type DetailsPageState = {
    selectedhost_name:string;
    dataSource: any[];
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

    selectedRowKeys: React.Key[];
    activeIndex: any;
    areRowsSelected: boolean;

    animated: boolean;
    animatedOne: number;

    statusData: StatusItem[]; // 初始状态
    currentPanel: string;
    // 新增状态字段，记录每个面板的选中行键
    panelSelectedRowKeys: {
        [panelName: string]: React.Key[];
    };
};


const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
    return (
        //<div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <div style={{ fontFamily: 'YouYuan, sans-serif' }}>
            {statusData.map((status, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: status.color,
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '16px',
                        }}
                    ></span>
                    <span style={{ marginRight: 'auto', paddingRight: '8px' }}>{status.label}</span>
                    <span>{status.value}</span>
                </div>
            ))}
        </div> //</div>
    );
};

const fimColumns = [
    {
        title: '文件名',
        dataIndex: 'filename',
        key: 'filename',
        onHeaderCell: () => ({
            style: {
              minWidth: 100, // 最小宽度100px
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: 'MD5哈希值',
        dataIndex: 'content_md5',
        key: 'content_md5',
    },
    {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '修改时间',
        dataIndex: 'mtime',
        key: 'mtime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
        sorter: (a: any, b: any) => b.mtime - a.mtime,
        //sorter: (a: any, b: any) => new Date(a.mtime).getTime() - new Date(b.mtime).getTime(),
    },
    {
        title: '访问时间',
        dataIndex: 'atime',
        key: 'atime',
        onHeaderCell: () => ({
            style: {
              minWidth: 170, // 最小宽度100px
              maxWidth: 170, // 最大宽度200px
            },
          }),
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',                
        filters: [],
        onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
        onHeaderCell: () => ({
            style: {
              minWidth: 100, // 最小宽度100px
              maxWidth: 200, // 最大宽度200px
            },
          }),
    },
    {
        title: '文件名哈希值',
        dataIndex: 'filename_md5',
        key: 'filename_md5',
    },
];


class DetailsPage extends React.Component<DetailsPageProps, DetailsPageState> {
    constructor(props: any) {
        super(props);
        this.columns = [];
        this.state = {
            selectedhost_name: '-1',
            statusData: [], // 初始状态
            animated: false,
            animatedOne: -1,
            dataSource: [],
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

            currentPanel: 'HostOverview', // 默认选中的面板
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            panelSelectedRowKeys: {
                HostOverview: [],
                'hostalertlist': [],
                'vulnerabilityalertlist': [],
                'baselineDetectalertlist': [],
                'runningalertlist': [],
                'virusscanning': [],
                'assetfingerprint': [],
                // 根据您的应用添加或删除面板
            },
        };
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ selectedhost_name: id });

        const queryParams = new URLSearchParams(this.props.location.search);
        const host = queryParams.get('Host'); // 假设你是通过 ?Host=someValue 传递的参数
    
        console.log("Host:", host);
        // 你可以在这里根据 host 参数进行更多操作，比如发起 API 请求获取详细信息

    }
    // 父组件中
    handleDataReceived = (data: any[]) => {
        // 处理从子组件接收到的数据
        console.log('Received data from child:', data);
    };
    changePanel = (panelName: string) => {
        this.setState({ currentPanel: panelName });
    };
    //为不同panel的勾选框设置状态
    onSelectChange = (selectedKeys: React.Key[], panel: string) => {
        // 根据panel来设置对应的选中行keys
        this.setState((prevState) => ({
            panelSelectedRowKeys: {
                ...prevState.panelSelectedRowKeys,
                [panel]: selectedKeys,
            },
        }));
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


    // Define the rowSelection object inside the render method
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
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [newData, ...dataSource],
            count: count + 1,
        });
    };
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
    handleExport = () => {
        const { dataSource, selectedRowKeys } = this.state;

        // 过滤出已选中的行数据
        const selectedData = dataSource.filter((row: DataType) =>
            selectedRowKeys.includes(row.key)
        );

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
    convertToCSV = (data: DataType[]) => {
        // 假设您希望导出的CSV中包括所有字段
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((row: DataType) => {
            const riskValues = Object.values(row.risks).join(',');
            return `${row.key},${row.host_name},${row.label},${row.group},${row.OStype},${riskValues},${row.status},${row.clientUsage},${row.updateTime}`;
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

    renderCurrentPanel() {
        const { currentPanel } = this.state;
    
        switch (currentPanel) {
            case 'HostOverview':
                return (
                    <HostOverview
                        changePanel={this.changePanel}
                    />
                );      
            case 'hostalertlist':
                return (
                    <div style={{marginTop:'-20px'}}>
                    <AlertList
                        apiEndpoint={"http://localhost:5000/api/files/logs/hostalertlist/host_1"}
                        columns={hostalertColumns}
                        currentPanel='hostalertlist'
                    />
                    </div>
                );
            case 'vulnerabilityalertlist':
                return (
                        <HostDetailsTable
                            apiEndpoint="http://localhost:5000/api/vulndetetion/query?host_ip="
                            columns={vulnerabilityColumns}
                            currentPanel={currentPanel}
                            titleName="漏洞概览"
                            selectedRowKeys={this.state.panelSelectedRowKeys.vulnerabilityalertlist}
                            onSelectChange={(keys: any) => this.onSelectChange(keys, 'vulnerabilityalertlist')}
                        />
                );
            case 'baselineDetectalertlist':
                return (
                        <HostDetailsTable
                            apiEndpoint="http://localhost:5000/api/vulndetetion/query?host_ip="
                            columns={baselineDetectColumns}
                            currentPanel={currentPanel}
                            titleName="基线概览"
                            selectedRowKeys={this.state.panelSelectedRowKeys.baselineDetectalertlist}
                            onSelectChange={(keys: any) => this.onSelectChange(keys, 'baselineDetectalertlist')}
                        />
                );
            case 'runningalertlist':
                return (
                    <div style={{marginTop:'-20px'}}>
                        <AlertList
                            apiEndpoint={"http://localhost:5000/api/vulndetetion/query?host_ip="}
                            columns={hostalertColumns}
                            currentPanel='runningalertlist'
                        />
                    </div>
                );
            case 'virusscanning':
                return (
                    <div style={{marginTop:'-20px'}}>
                        <VirusScanning
                            hostID=""
                            pageWidth={1320}
                        />
                    </div>
                );
            case 'performancemonitor':
                return (
                    <div style={{marginTop:'-20px'}}>
                        <PerformanceMonitor />
                    </div>
                );
            case 'assetfingerprint':
                return (
                        <HostDetailsTable
                            apiEndpoint="http://localhost:5000/api/vulndetetion/query?host_ip="
                            columns={fimColumns}
                            currentPanel={currentPanel}
                            titleName="资产指纹"
                            selectedRowKeys={this.state.panelSelectedRowKeys.assetfingerprint}
                            onSelectChange={(keys: any) => this.onSelectChange(keys, 'assetfingerprint')}
                        />
                );
            default:
                return (
                        <HostOverview
                            changePanel={this.changePanel}
                        />
                );
        }
    }
    
    render() {
        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <BreadcrumbCustom breads={['主机列表', '详情页']} />
                <span>
                    {this.props.host_name}
                </span>
                <div>
                    <Row gutter={[12, 6]} style={{ marginTop: '10px',width: '100%', margin: '0 auto' }}>
                        <Col md={24}>
                            <Menu
                                onClick={this.handleMenuClick}
                                selectedKeys={[this.state.currentPanel]}
                                mode="horizontal"
                                style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                            >
                                <Menu.Item key="hostoverview">主机概览</Menu.Item>
                                <Menu.Item key="hostalertlist">安全告警（AlarmTotal）</Menu.Item>
                                <Menu.Item key="vulnerabilityalertlist">漏洞风险（VulnTotal）</Menu.Item>
                                <Menu.Item key="baselineDetectalertlist">基线风险（BaselineTotal）</Menu.Item>
                                {/* <Menu.Item key="runningalertlist">运行时安全告警（RaspAlarmTotal）</Menu.Item> */}
                                <Menu.Item key="virusscanning">病毒查杀（VirusTotal）</Menu.Item>
                                <Menu.Item key="performancemonitor">性能监控</Menu.Item>
                                {/* <Menu.Item key="assetfingerprint">资产指纹</Menu.Item> */}
                                {/* 可以根据需要添加更多的Menu.Item */}
                                {/* 使用透明div作为flex占位符 */}
                                <div style={{ flexGrow: 1 }}></div>
                                
                            </Menu>
                            {/* 渲染当前激活的子面板 */}
                            <Card bordered={false} style={{backgroundColor: '#F6F7FB', margin:'0 auto',width:'90%' }}>
                                {this.renderCurrentPanel()}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default withRouter(DetailsPage);
