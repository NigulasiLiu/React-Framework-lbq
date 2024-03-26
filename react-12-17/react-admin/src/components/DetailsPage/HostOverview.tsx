/**
 * Created by hao.cheng on 2017/5/3.
 */
import React,{useEffect} from 'react';
import { Row, Col, Card, Statistic, Typography ,Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import CustomPieChart from '../AssetsCenter/CustomPieChart';
import { PieChart, Pie, Cell,Label, ResponsiveContainer} from 'recharts';
import { StatusPanel } from '../AssetsCenter/HostInventory';
import { StatusItem } from '../tableUtils';
import { diskColumns,netColumns,pluginColumns } from './DetailsTableColumns';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';
import { DataContext, DataContextType} from '../ContextAPI/DataManager'
import { MetaDataResult } from '../ContextAPI/ExtractOriginData';
import useSearchOriginData from '../ContextAPI/useSearchOriginData';

const { Text } = Typography;


interface HostOverviewProps extends RouteComponentProps {
  // ... other props if there are any
    changePanel: (panelName: string) => void; //切换子panel
}

interface HostOverviewState{
    host:string;
    
    filteredData: any[], // 用于存储过滤后的数据
    activeIndex: any;
} 

class HostOverview extends React.Component<HostOverviewProps,HostOverviewState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: [-1], //一个扇形图
            
            filteredData: [], // 用于存储过滤后的数据
            host:'',
        };
    }
    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const host = queryParams.get('Host');
        this.setState({
            host : host?host:'default',
        });
      }
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
    
    // 修改后的函数，使其能够导航到对应的子面板
    goToPanel = (panelName: string) => {
        // 更新父组件的状态，changePanel 的函数负责这个逻辑
        this.props.changePanel(panelName);
    };
    renderFilteredData = (agentOriginData:any[]) => {
        // 过滤出主机名为'host1'的数据
        const filteredData = agentOriginData.filter(item => item.host_name === this.state.host);
        
        // 返回一个渲染过滤后数据的JSX
        return (
          <div>
            {filteredData.map((data, index) => (
              <div key={index}>
                <p>IP Address: {data.ip_address}</p>
                <p>OS Version: {data.os_version}</p>
                <p>Status: {data.status}</p>
                {/* 更多数据字段 */}
              </div>
            ))}
          </div>
        );
      }
    render() {
          
        return(
            <DataContext.Consumer>
            {(context: DataContextType | undefined) => {
            if (!context) {
                return <div>Loading...</div>; // 或者其他的加载状态显示
            }
            // 从 context 中解构出 topFiveFimData 和 n
            const { topFiveFimData, topFivePortCounts,
                agentOriginData,
                fimMetaData_hostname,
                portMetaData_port_state, portMetaData_port_number,
                processMetaData_userName,topFiveProcessCounts,topFiveUserCounts,
                assetMetaData_service, assetMetaData_product,topFiveServiceCounts,topFiveProductCounts,
                linuxBaseLineCheckMetaData__ip,} = context;
                // useSearchOriginData(agentOriginData, ['host_name'], [this.state.host], ['os_version', 'status'])
                // const { searchResults, searchOriginData } = useSearchOriginData();
                //     // 组件挂载时进行搜索
                // useEffect(() => {
                //     if (this.state.host && agentOriginData) {
                //         searchOriginData(agentOriginData, ['host_name'], [this.state.host], ['os_version', 'status']);
                //     }
                // }, [this.state.host, agentOriginData, searchOriginData]);
                const data = {
                    '主机名称': this.state.host,
                    '主机ID': 'bb141656-d7ed-5e41-b7f5-300...',
                    '操作系统': '',
                    '主机标签': '-',
                    '设备型号': 'VMware, Inc.',
                    '生产商': '-',
                    '系统负载': '1.03/1.13',
                    '公网IPv4': '-',
                    '公网IPv6': '-',
                    '私网IPv4': '172.17.0.2',
                    '私网IPv6': '-',
                    '网络区域': 'private',
                    '操作系统版本': '3.10.0-1160.el7.x86_64',
                    '容器平台': 'VMware Virtual Platform',
                    'CPU信息': '12th Gen Intel(R) Core(TM) i7...',
                    'CPU使用率': '2.69%',
                    '内存大小': '3.68 GB',
                    '内存使用率': '83%',
                    '默认网关': '172.17.0.1',
                    '地域':'default',
                    '内存占用率': '84.24%',
                    '磁盘占用': '0.82/0.56/0.5',
                    '网卡序列': 'F0684D56-4A26-C1B9-CE...',
                    '注册时间': '2023-12-27 04:08:53',
                    '最近活跃时间': '2024-01-12 17:46:01',
                    '更新时间': '2023-12-13 23:18:24',
                    '探测时间': '2023-12-27 04:09:03',
                    'DNS服务器': '192.168.218.2',
                    // ... any other data fields
                    };
                    const alertData2_:StatusItem[] = [
                        { label: '紧急', value: 5, color: '#EA635F' },//RED
                        { label: '高风险', value: 1, color: '#846CCE' },//紫
                        { label: '中风险', value: 1, color: '#FBB12E' },//ORANGE
                        { label: '低风险', value: 1, color: '#468DFF' }//蓝
                    ];
                    
                    const alertData3_:StatusItem[] = [
                        { label: '严重', value: 1, color: '#EA635F' },//RED
                        { label: '高危', value: 1, color: '#846CCE' },//紫
                        { label: '中危', value: 1, color: '#FBB12E' },//ORANGE
                        { label: '低危', value: 1, color: '#468DFF' }//蓝
                    ];
                    
                    const alertData4_:StatusItem[] = [
                        { label: '高危', value: 1, color: '#EA635F' },//RED
                        { label: '中危', value: 1, color: '#FBB12E' },//ORANGE
                        { label: '低危', value: 1, color: '#468DFF' }//蓝
                    ];

                    const agentversion='1.7.0.24';

                return (
                    <div>
                    {/* <div>
                        {this.renderFilteredData(agentOriginData)}
                    </div> */}
                        <Row style={{ width: '95%', margin: '0 auto' }}>
                        <Col className="gutter-row" md={24} style={{ border:'false'}}>{/*maxWidth:1260*/}
                            <Row gutter={[8,16]}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', minHeight:200, backgroundColor: '#ffffff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,paddingBottom:0,fontWeight: 'bold'}}>
                                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>基础信息</h2>
                                    </div>
                                    <Row gutter={[6, 6]}>
                                        <Col className="gutter-row" md={24}>
                                            <Card bordered={false} style={{ fontFamily: 'YouYuan, sans-serif'}}>
                                                <Row gutter={16}>
                                                {Object.entries(data).map(([key, value], index) => (
                                                    <Col key={index} span={8} style={{ fontSize:'12px',marginBottom: '12px' }}>
                                                    <Text strong>{key}:</Text> <Text>{value}</Text>
                                                    </Col>
                                                ))}
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
            
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Col md={8} style={{width:'33%', marginLeft: '0', marginRight: 'auto'}}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', minHeight:200, backgroundColor: '#ffffff' }}>
                                        <Row>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>安全告警</h2>
                                            </div>
                                            <Button style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}>详情</Button>
                                        </Row>
                                    <Row gutter={0}>

                              <Col span={12}>
                              <CustomPieChart
                              data={alertData2_}
                              innerRadius={54}
                              deltaRadius={8}
                              outerRadius={80}
                              cardWidth={200}
                              cardHeight={200}
                              hasDynamicEffect={true}
                              />
                              </Col>
                                        <Col span={2}> </Col>
                                        <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                                        <StatusPanel statusData={alertData2_} orientation="vertical"/>
                                        </div>
                                        </Row>
                                </Card>
                                </Col>
                                <Col md={8}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', minHeight:200, backgroundColor: '#ffffff' }}>
                                        <Row>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>漏洞风险</h2>
                                            </div>
                                            <Button style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}>详情</Button>
                                        </Row>
                                    <Row gutter={0}>
                                        <Col span={12}>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie className="pie-chart-segment"
                                                data={alertData3_}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={54}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                onMouseEnter={(e) => this.handleMouseEnter(e, 1)}
                                                onMouseLeave={this.handleMouseLeave}
                                                outerRadius={this.state.activeIndex[1] === 1 ? 80 : 72} // 如果悬停则扇形半径变大
                                                
                                                >
                                                {alertData3_.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                                <Label value={'未处理告警:'+alertData3_.length+'个'} 
                                                position="center" 
                                                style={{ fontSize: '14px' }}
                                                />
                                                </Pie>
            
                                                {/* <Tooltip content={<CustomTooltip />} /> */}
                                            </PieChart>
                                            </ResponsiveContainer>
            
                                        </Col>
                                        <Col span={2}> </Col>
                                        <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                                        <StatusPanel statusData={alertData3_} orientation="vertical"/>
                                        </div>
                                        </Row>
                                </Card>
                                </Col>
                                <Col md={8} style={{width:'33%', marginLeft: 'auto', marginRight: '0'}}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', minHeight:200, backgroundColor: '#ffffff' }}>
                                        <Row>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>基线风险</h2>
                                            </div>
                                            <Button style={{ border:'false',color: '#1964F5',fontWeight: 'bold',marginLeft: '300px',marginTop: '-55px'}}>详情</Button>
                                        </Row>
                                    <Row gutter={0}>
                                        <Col span={12}>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie className="pie-chart-segment"
                                                data={alertData4_}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={54}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                onMouseEnter={(e) => this.handleMouseEnter(e, 1)}
                                                onMouseLeave={this.handleMouseLeave}
                                                outerRadius={this.state.activeIndex[1] === 1 ? 80 : 72} // 如果悬停则扇形半径变大
                                                
                                                >
                                                {alertData4_.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                                <Label value={'未处理告警:'+alertData4_.length+'个'} 
                                                position="center" 
                                                style={{ fontSize: '14px' }}
                                                />
                                                </Pie>
            
                                                {/* <Tooltip content={<CustomTooltip />} /> */}
                                            </PieChart>
                                            </ResponsiveContainer>
            
                                        </Col>
                                        <Col span={2}> </Col>
                                        <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                                        <StatusPanel statusData={alertData4_} orientation="vertical"/>
                                        </div>
                                        </Row>
                                </Card>
                                </Col>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', minHeight:80, backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>资产指纹</h2>
                                        </div>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                        <Col span={2}>
                                            <Card
                                                bordered={false}
                                                style={{
                                                    height: '75px',
                                                    width: '140px',
                                                    minWidth: 110, // 最小宽度100px
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
                                    </Row>
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>磁盘信息</h2>
                                        </div>
                                    </Row>
                                    <FetchAPIDataTable
                                        apiEndpoint="http://localhost:5000/api/files/diskinfo"
                                        timeColumnIndex={[]}
                                        columns={diskColumns}
                                        currentPanel="hostOverviewdiskinfolist"
                                    />
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>网卡信息</h2>
                                        </div>
                                    </Row>
                                    <FetchAPIDataTable
                                        apiEndpoint="http://localhost:5000/api/files/netinfo"
                                        timeColumnIndex={[]}
                                        columns={netColumns}
                                        currentPanel="hostOverviewnetinfolist"
                                    />
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
                                    <Row>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>插件列表</h2>
                                        </div>
                                    </Row>
                                    <FetchAPIDataTable
                                        apiEndpoint="http://localhost:5000/api/files/plugininfo"
                                        timeColumnIndex={[]}
                                        columns={pluginColumns}
                                        currentPanel="hostOverviewplugininfolist"
                                    />
                                </Card>
                            </Row>
                            <Row gutter={[8,16]}>
                                <Card bordered={false}
                                    style={{fontWeight: 'bolder', width: '100%', minHeight:100, backgroundColor: '#ffffff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,paddingBottom:0,fontWeight: 'bold'}}>
                                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>版本信息</h2>
                                    </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,paddingBottom:0,fontWeight: 'bold'}}>
                                            <h2 style={{ fontSize:'15px',fontWeight: 'bold', marginLeft: '0px' }}>Agent版本 {agentversion}</h2>
                                        </div>
            
                                </Card>
                            </Row>
                        </Col>
                        </Row>
                    </div>
                    );

            }}
            </DataContext.Consumer>
        )
    }
}

export default withRouter(HostOverview);