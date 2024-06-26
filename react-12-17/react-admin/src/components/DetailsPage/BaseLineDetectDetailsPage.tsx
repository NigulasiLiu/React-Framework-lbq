import React from 'react';
import { Menu, Row, Col, Card, Statistic, Typography, Button } from 'antd';
import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { RouteComponentProps, withRouter } from 'react-router-dom';


const { Text } = Typography;
interface StatusItem {
    color: string;
    label: string;
    value: number;
}

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
                        marginRight: '8px'
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

interface BaseLineDetectDetailsPageProps extends RouteComponentProps {

}
interface BaseLineDetectDetailsPageStates {
    activeIndex: any;
    currentPanel: string;
    host_uuid: string;
}


//扇形图数据
const RASPdata_1: StatusItem[] = [
    { label: '未通过主机', value: 0, color: '#EA635F' },
    { label: '通过主机', value: 1, color: '#E5E8EF' },
];
const RASPdata_3: StatusItem[] = [...RASPdata_1,];

const RASPdata_11: StatusItem[] = [
    { label: '风险项', value: 0, color: '#4086FF' },
    { label: '通过项', value: 1, color: '#E5E8EF' },
];
const RASPdata_31: StatusItem[] = [...RASPdata_11,];



const vulnerName = '系统登录弱口令检测';

const data = {
    '描述': '检查登陆系统是否为弱口令',
    '加固建议': '更改系统登陆所使用的口令，建议使用大小写加特殊字符的密码',
};

class BaseLineDetectDetailsPage extends React.Component<BaseLineDetectDetailsPageProps, BaseLineDetectDetailsPageStates> {

    constructor(props: any) {
        super(props);
        this.state = {
            activeIndex: [-1, -1, -1, -1],
            currentPanel: 'checkedItem',
            host_uuid: '',
        };
    }

    componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const host_uuid = queryParams.get('uuid');
        if(host_uuid){
            this.setState({
                host_uuid: host_uuid,
            });
        }
        else{
            this.setState({
                host_uuid: 'default',
            });
        }
    }
    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };

    // 渲染当前激活的子面板
    renderCurrentPanel() {
        const { currentPanel } = this.state;
        switch (currentPanel) {
            case 'checkedItem':
                return (
                    <Row style={{ width: '100%', margin: '0 auto' }}>
                        <Col md={12}>
                            <div className="gutter-box">
                                <Card >
                                    {/*<FetchDataForElkeidTable*/}
                                    {/*    timeColumnIndex={[]}*/}
                                    {/*    apiEndpoint="http://localhost:5000/api/FileIntegrityInfo1"*/}
                                    {/*    columns={baseLineDetectCheckedItemColumns}*/}
                                    {/*    currentPanel='baseLineDetectDetailsCheckedItem'*/}
                                    {/*/>*/}
                                </Card>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="gutter-box">
                                <Card>
                                    <Row >
                                        <div style={{ fontSize: 18 }}>
                                            {vulnerName}
                                        </div>
                                    </Row>
                                    <Row style={{ width: '100%', }}>
                                        <Row style={{ fontSize: 14, marginTop: '13px', marginBottom: '13px', }}>
                                            {Object.entries(data).map(([key, value], index) => (
                                                <Col key={index} span={12} style={{ fontSize: '12px', marginBottom: '8px' }}>
                                                    <Row>
                                                        <Text style={{ color: 'grey', marginTop: '3px', marginBottom: '3px', }} strong>{key}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text style={{ marginTop: '3px', marginBottom: '3px', }}>{value}</Text>
                                                    </Row>
                                                </Col>
                                            ))}
                                            <Text>
                                                <Col span={24} style={{ fontSize: '12px', marginBottom: '8px' }}>
                                                    <Row>
                                                        <Text style={{ color: 'grey', marginTop: '3px', marginBottom: '13px', }} strong>{'影响的主机'}</Text>
                                                    </Row>
                                                </Col>
                                            </Text>
                                        </Row>
                                        <Row style={{ width: '100%', margin: '0 auto' }}>
                                            {/*<FetchDataForElkeidTable*/}
                                            {/*    apiEndpoint="http://localhost:5000/api/vulnerdetailpage1"*/}
                                            {/*    timeColumnIndex={[]}*/}
                                            {/*    columns={baseLineDetectScanResult1Columns}*/}
                                            {/*    currentPanel="baseLineDetectScanResult1"*/}
                                            {/*/>*/}
                                        </Row>
                                    </Row>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                );
            case 'checkedHost':
                return (
                    <Row style={{ width: '100%', margin: '0 auto' }}>
                        <Col md={12}>
                            <div className="gutter-box">
                                <Card bordered={false}>
                                    {/*<FetchDataForElkeidTable*/}
                                    {/*    apiEndpoint="http://localhost:5000/api/FileIntegrityInfo1"*/}
                                    {/*    timeColumnIndex={[]}*/}
                                    {/*    columns={baseLineDetectHostItemColumns}*/}
                                    {/*    currentPanel='baseLinedetectdetailsHostItem'*/}
                                    {/*/>*/}
                                </Card>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="gutter-box">
                                <Card bordered={false}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontWeight: 'bold' }}>
                                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>检查结果</h2>
                                    </div>
                                    {/*<FetchDataForElkeidTable*/}
                                    {/*    timeColumnIndex={[]}*/}
                                    {/*    apiEndpoint="http://localhost:5000/api/FileIntegrityInfo1"*/}
                                    {/*    columns={baseLineDetectScanResult2Columns}*/}
                                    {/*    currentPanel='baseLineDetectScanResult2'*/}
                                    {/*/>*/}
                                </Card>
                            </div>
                        </Col>
                    </Row>
                );
            default:
                return (
                    <Row style={{ width: '100%', margin: '0 auto' }}>
                        <Col md={12}>
                            <div className="gutter-box">
                                <Card >
                                    {/*<FetchDataForElkeidTable*/}
                                    {/*    timeColumnIndex={[]}*/}
                                    {/*    apiEndpoint="http://localhost:5000/api/FileIntegrityInfo1"*/}
                                    {/*    columns={baseLineDetectCheckedItemColumns}*/}
                                    {/*    currentPanel='baseLinedetectdetailsCheckedItem'*/}
                                    {/*/>*/}
                                </Card>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="gutter-box">
                                <Card>
                                    <Row >
                                        <div style={{ fontSize: 18 }}>
                                            {vulnerName}
                                        </div>
                                    </Row>
                                    <Row style={{ width: '100%', }}>
                                        <Row style={{ fontSize: 14, marginTop: '13px', marginBottom: '13px', }}>
                                            {Object.entries(data).map(([key, value], index) => (
                                                <Col key={index} span={12} style={{ fontSize: '12px', marginBottom: '8px' }}>
                                                    <Row>
                                                        <Text style={{ color: 'grey', marginTop: '3px', marginBottom: '3px', }} strong>{key}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text style={{ marginTop: '3px', marginBottom: '3px', }}>{value}</Text>
                                                    </Row>
                                                </Col>
                                            ))}
                                            <Text>
                                                <Col span={24} style={{ fontSize: '12px', marginBottom: '8px' }}>
                                                    <Row>
                                                        <Text style={{ color: 'grey', marginTop: '3px', marginBottom: '13px', }} strong>{'影响的主机'}</Text>
                                                    </Row>
                                                </Col>
                                            </Text>
                                        </Row>
                                        <Row style={{ width: '100%', margin: '0 auto' }}>
                                            {/*<FetchDataForElkeidTable*/}
                                            {/*    apiEndpoint="http://localhost:5000/api/vulnerdetailpage1"*/}
                                            {/*    timeColumnIndex={[]}*/}
                                            {/*    columns={baseLineDetectScanResult1Columns}*/}
                                            {/*    currentPanel="baseLineDetectScanResult1"*/}
                                            {/*/>*/}
                                        </Row>
                                    </Row>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                );
        }
    }

    render() {

        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return <div>Loading...</div>; // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const { linuxBaseLineCheckMetaData_uuid, blLinuxNeedAdjustmentItemCount,
                        blWindowsNeedAdjustmentItemCount,
                        blWindowsCheckNameCount, blLinuxCheckNameCount } = context;



                    //const hostCheckedPassedCount = linuxBaseLineCheckMetaData_status.typeCount.get('TRUE');//检查通过数量
                    const hostCheckedCount = linuxBaseLineCheckMetaData_uuid.tupleCount;//检查项数量
                    const hostCheckedPassedRate = 1 - ((blLinuxNeedAdjustmentItemCount || 0) + (blWindowsNeedAdjustmentItemCount || 0)) / (blWindowsCheckNameCount + blLinuxCheckNameCount);

                    return (
                        <div style={{
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold' }}>
                            <BreadcrumbCustom />
                            <Row style={{
                                width: '110%', height: '80px', backgroundColor: '#FFFFFF', //height:'40px',
                                marginLeft: '-20px', padding: '12px', borderBottom: '1px solid #F6F7FB'
                            }}>
                                <div style={{ margin: 'auto 10px' }}>
                                    <Button
                                        type="link"
                                        style={{
                                            width: '40px', height: '40px', fontWeight: 'bold', border: 'transparent',
                                            backgroundColor: '#F6F7FB', color: '#88878C'
                                        }}
                                        icon={<LeftOutlined />}
                                        onClick={() => {
                                            window.close();
                                        }}
                                    />
                                    <span style={{ fontSize: '20px', marginLeft: '20px' }}>
                                        基线检查详情
                                    </span>
                                </div>
                            </Row>
                            <div>
                                <Row gutter={[12, 6]} style={{ marginTop: '10px', width: '100%', margin: '0 auto' }}>
                                    <Col md={24}>
                                        <div style={{
                                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                            fontWeight: 'bold' }}>
                                            <Col className="gutter-row" md={24}>
                                                <Row gutter={[12, 6]} style={{ width: '100%', margin: '0 auto' }}>
                                                    <Col className="gutter-row" md={24}>
                                                        <Card bordered={false}
                                                            style={{ fontWeight: 'bolder', marginTop: '10px', height: 200 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '0px' }}>告警概览</h2>
                                                            </div>
                                                            <Row gutter={[6, 6]}>
                                                                <Col md={2}>
                                                                </Col>
                                                                <Col className="gutter-row" md={8}>
                                                                    <Card
                                                                        bordered={false}
                                                                        style={{
                                                                            height: '100px',
                                                                            // width: '520px',
                                                                            width: '100%',
                                                                            minWidth: '150px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            backgroundColor: '#F6F7FB',
                                                                        }}
                                                                    >
                                                                        <Row style={{ width: '100%', marginBottom: '-130px' }}>
                                                                            <Col span={12} style={{ height: '100px', marginRight: '40px', marginBottom: '-170px', paddingTop: '10px' }}>
                                                                                <Statistic title={<span>最近检查通过率</span>} value='100%' />
                                                                            </Col>
                                                                            <Col span={12} style={{ height: '90px', marginLeft: '250px', marginRight: '150px', marginBottom: '130px' }}>
                                                                                {/* <StatusPanel statusData={statusData} orientation="vertical" /> */}
                                                                            </Col>
                                                                        </Row>
                                                                    </Card>
                                                                </Col>
                                                                <Col md={2}>
                                                                </Col>
                                                                {/* <Col className="gutter-row" md={8}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            height: '100px',
                                            // width: '620px',
                                                width:'100%',
                                            minWidth: '150px', // 最小宽度300px，而非100px
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                        }}
                                        >
                            <Row style={{ width: '100%',marginTop: '0px',paddingRight: '10px' }}>
                                <Col span={5} style={{ paddingTop:'20px',width:'200px',height:'90px'}}>
                                    <Statistic title={<span>检查主机数</span>} value={1} />
                                </Col>
                                <Col span={7} style={{ width:'100px',alignItems:'center',justifyContent:'center'}}>
                                <CustomPieChart
                                data={RASPdata_3}
                                innerRadius={24}
                                deltaRadius={2}
                                outerRadius={30}
                                cardWidth={130}
                                cardHeight={90}
                                hasDynamicEffect={true}
                                />
                                </Col>
                                <Col span={9} style={{ paddingTop:'15px',width:'440px',height:'100px'}}>
                                    <StatusPanel statusData={RASPdata_1} orientation="vertical" />
                                </Col>
                                <Col span={3} style={{ paddingTop:'25px',paddingLeft:'20px',width:'440px',height:'100px'}}>
                                </Col>
                            </Row>
                                    </Card>
                                    </Col>    */}
                                                                <Col className="gutter-row" md={8}>
                                                                    <Card
                                                                        bordered={false}
                                                                        style={{
                                                                            height: '100px',
                                                                            // width: '620px',
                                                                            width: '100%',
                                                                            minWidth: '150px', // 最小宽度300px，而非100px
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                                        }}
                                                                    >
                                                                        <Row style={{ width: '100%', marginTop: '0px', paddingRight: '10px' }}>
                                                                            <Col span={3} style={{ paddingTop: '25px', paddingLeft: '20px', width: '440px', height: '100px' }}>
                                                                                {/* <StatusPanel statusData={RASPdata_2} orientation="vertical" /> */}
                                                                            </Col>
                                                                            <Col span={5} style={{ paddingTop: '20px', width: '200px', height: '90px' }}>
                                                                                <Statistic title={<span>检查项</span>} value={1} />
                                                                            </Col>
                                                                            <Col span={7} style={{ width: '100px', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <CustomPieChart
                                                                                    data={RASPdata_31}
                                                                                    innerRadius={24}
                                                                                    deltaRadius={2}
                                                                                    outerRadius={30}
                                                                                    cardWidth={130}
                                                                                    cardHeight={90}
                                                                                    hasDynamicEffect={true}
                                                                                />
                                                                            </Col>
                                                                            <Col span={8} style={{ paddingTop: '15px', width: '440px', height: '100px' }}>
                                                                                <StatusPanel statusData={RASPdata_11} orientation="vertical" />
                                                                            </Col>
                                                                        </Row>
                                                                    </Card>
                                                                </Col>
                                                            </Row>

                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ width: '100%', margin: '0 auto' }}>
                                                    <Col md={24}>
                                                        <div className="gutter-box">
                                                            <Card bordered={false}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                                                    <h2 style={{ fontWeight: 'bold', marginLeft: '0px' }}>检查详情</h2>
                                                                </div>
                                                                <Menu
                                                                    onClick={this.handleMenuClick}
                                                                    selectedKeys={[this.state.currentPanel]}
                                                                    mode="horizontal"
                                                                    style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                                                >
                                                                    <Menu.Item key="checkedItem">检查项视角</Menu.Item>
                                                                    <Menu.Item key="checkedHost">主机视角</Menu.Item>
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
                                            </Col>
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

export default withRouter(BaseLineDetectDetailsPage);
