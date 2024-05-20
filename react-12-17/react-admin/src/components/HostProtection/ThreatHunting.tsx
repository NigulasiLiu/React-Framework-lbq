import React from 'react';
import { Col, Button, Modal, Form, Input, message, Row, Card, Tooltip, Menu, Statistic } from 'antd';
import axios from 'axios';
import {
    StatusItem, threatHuntingColumns, threatHuntingColumns_2,
} from '../Columns';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import DataDisplayTable from '../ElkeidTable/DataDisplayTable';
import CustomPieChart from '../CustomAntd/CustomPieChart';
import umbrella from 'umbrella-storage';


interface StatusPanelProps {
    scanPanelData: StatusItem[];
    orientation: 'vertical' | 'horizontal'; // 添加方向属性
}

const StatusPanel: React.FC<StatusPanelProps> = ({ scanPanelData, orientation }) => {
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
            {scanPanelData.map((status, index) => (
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


interface TTP {
    key: string;
    tactic: string;
    technique: string;
    procedure: string;
}

interface ThreatHuntingState {
    columns: any[];
    ttps: TTP[];
    isModalOpen: boolean;
    currentPanel: string;
}

class ThreatHunting extends React.Component<{}, ThreatHuntingState> {
    state: ThreatHuntingState = {
        ttps: [],
        isModalOpen: false,
        columns: [],
        currentPanel: 'brute-force',
    };

    componentDidMount() {
        this.fetchTTPs();
    }


    // 点击Menu.Item时调用的函数
    handleMenuClick = (e: any) => {
        this.setState({ currentPanel: e.key });
    };
    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };
    handleTTPsSubmit = async (values: any) => {
        try {
            const token = umbrella.getLocalStorage('jwt_token');
            // 配置axios请求头部，包括JWT
            const config = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined, // 如果存在token则发送，否则不发送Authorization头部
                }
            };
            // 直接将values作为POST请求的body发送
            const response = await axios.post('/api/getTTPs', values,config);
            console.log(response.data);
            message.success('TTPs添加成功');
            this.closeModal(); // 关闭Modal
        } catch (error) {
            console.error('TTPs添加失败:', error);
            message.error('TTPs添加失败, 请稍后再试');
        }
    };

    fetchTTPs = async () => {
        // 替换成实际的后端API
        try {
            const { data } = await axios.get<TTP[]>('https://yourapi.com/ttps');
            this.setState({ ttps: data });
        } catch (error) {
            message.error('获取TTPs信息失败');
        }
    };

    renderTTPsModal = () => {
        return (
            <Modal
                title="添加TTP信息"
                visible={this.state.isModalOpen}
                onCancel={this.closeModal}
                okText="确认"
                cancelText="取消"
                onOk={() => document.getElementById('ttpInfoForm')?.dispatchEvent(new Event('submit', { cancelable: true }))}
            >
                <Form
                    id="ttpInfoForm"
                    onFinish={this.handleTTPsSubmit}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="战术"
                        name="tactic"
                        rules={[{ required: true, message: '请输入战术名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="技术"
                        name="technique"
                        rules={[{ required: true, message: '请输入技术名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="程序"
                        name="procedure"
                        rules={[{ required: true, message: '请输入程序名称' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

        );
    };

    // 渲染当前激活的子面板
    renderCurrentPanel(
        bruteforceTTPsOriginData: any[],
        privilegeescalationTTPsOriginData: any[],
        defenseavoidanceTTPsOriginData: any[]) {
        const { currentPanel } = this.state;
        console.log('this.state.currentPanel:' + currentPanel);

        // {constRenderTable(bruteforceTTPsOriginData, 'TTPs-暴力破解', [],
        //     threatHuntingColumns, 'threathuntinglist',"http://localhost:5000/api/brute-force/all",
        //     [''],this.openModal,"添加TTPs")}
        //
        // {constRenderTable(bruteforceTTPsOriginData, 'TTPs-权限提升', [],
        //     threatHuntingColumns, 'threathuntinglist',"http://localhost:5000/api/privilege-escalation/all",[''],this.openModal,"添加TTPs")}
        //
        // {constRenderTable(bruteforceTTPsOriginData, 'TTPs-防御规避', [],
        //     threatHuntingColumns, 'threathuntinglist',"http://localhost:5000/api/defense-avoidance/all",[''],this.openModal,"添加TTPs")}

        switch (currentPanel) {
            case 'brute-force':
                return (
                    <DataDisplayTable
                        key={currentPanel}
                        externalDataSource={bruteforceTTPsOriginData}
                        apiEndpoint="http://localhost:5000/api/brute-force/all"
                        timeColumnIndex={[]}
                        columns={threatHuntingColumns}
                        currentPanel={currentPanel}
                        searchColumns={['uuid', 'atk_ip']}
                        additionalButton={this.openModal}
                        additionalButtonTitile={'添加TTPs'}
                    />
                );
            case 'privilege-escalation':
                return (
                    <DataDisplayTable
                        key={currentPanel}
                        externalDataSource={privilegeescalationTTPsOriginData}
                        apiEndpoint="http://localhost:5000/api/privilege-escalation/all"
                        timeColumnIndex={[]}
                        columns={threatHuntingColumns_2}
                        currentPanel={currentPanel}
                        searchColumns={['uuid', 'atk_ip']}
                        additionalButton={this.openModal}
                        additionalButtonTitile={'添加TTPs'}
                    />
                );
            case 'defense-avoidance':
                return (
                    <DataDisplayTable
                        key={currentPanel}
                        externalDataSource={defenseavoidanceTTPsOriginData}
                        apiEndpoint="http://localhost:5000/api/defense-avoidance/all"
                        timeColumnIndex={[]}
                        columns={threatHuntingColumns_2}
                        currentPanel={currentPanel}
                        searchColumns={['uuid', 'atk_ip']}
                        additionalButton={this.openModal}
                        additionalButtonTitile={'添加TTPs'}
                    />
                );
        }
    }

    renderPanelAndPieChart = (OriginData: any[], title: string,
                              panelDataTitle1: string, panelDataTitle2: string, panelDataTitle3: string) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            let totalExpResultCount = 0;
            originDataArray.forEach(item => {
                totalExpResultCount += item.vul_detection_exp_result.length;
            });
            const scanPanelData: StatusItem[] = [
                { color: '#E63F3F', label: panelDataTitle1, value: 1 },
                { color: '#f38b47', label: panelDataTitle2, value: 1 },
                { color: '#468DFF', label: panelDataTitle3, value: 1 }];
            return (
                <Row style={{ width: '100%', marginTop: '20px', paddingRight: '10px' }}>
                    <Col span={7} style={{ paddingTop: '20px', width: '400px', height: '90px', marginLeft: '20px' }}>
                        <Statistic title={<span style={{ fontSize: '16px' }}>{title}</span>}
                                   value={totalExpResultCount} />
                    </Col>
                    <Col span={5} style={{ width: '300px', marginTop: '10px' }}>
                        <CustomPieChart
                            data={scanPanelData}
                            innerRadius={27}
                            deltaRadius={2}
                            outerRadius={33}
                            cardWidth={90}
                            cardHeight={90}
                            hasDynamicEffect={true}
                        />
                    </Col>
                    <Col span={1} style={{ width: '300px', marginTop: '10px' }} />
                    <Col span={8} style={{ width: '450px', height: '100px', paddingTop: '5px', marginTop: '15px' }}>
                        <StatusPanel scanPanelData={scanPanelData} orientation="vertical" />
                    </Col>

                </Row>);
        } else {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Card bordered={true}
                          style={{ backgroundColor: '#ffffff', width: '100%' }}>
                        <LoadingOutlined style={{ fontSize: '3em' }} />
                    </Card>
                </div>);
        }
    };


    render() {
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const {
                        bruteforceTTPsOriginData,
                        privilegeescalationTTPsOriginData,
                        defenseavoidanceTTPsOriginData, vulnOriginData,
                    } = context;
                    const brutCount = bruteforceTTPsOriginData===undefined?0:bruteforceTTPsOriginData.flat().length;
                    const privCount = privilegeescalationTTPsOriginData===undefined?0:privilegeescalationTTPsOriginData.flat().length;
                    const defensCount = defenseavoidanceTTPsOriginData===undefined?0:[defenseavoidanceTTPsOriginData].flat().length;
                    return (
                        <div>
                            {/* <Button onClick={this.openModal}>添加TTPs</Button> */}
                            <Row gutter={[12, 6]} style={{ marginTop: '0px' }}>
                                {this.renderTTPsModal()}
                                <Col md={24}>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        <Col span={24}>
                                            <Card
                                                bordered={false} /*title="主机状态分布" 产生分界线*/
                                                style={{ fontWeight: 'bolder', width: '100%', height: 220 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 16,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                    }}>威胁捕获概览</h2>
                                                </div>
                                                <Row>
                                                    <Col span={9} style={{ marginLeft: '10px' }}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                maxWidth: '470px',
                                                                minWidth: '200px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            {this.renderPanelAndPieChart(vulnOriginData, '已捕获威胁',
                                                                '风险等级1', '风险等级2', '风险等级3')}
                                                        </Card>
                                                    </Col>
                                                    <Col span={5} style={{ marginLeft: '0px' }}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '240px',
                                                                minWidth: '200px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col pull={2} span={24} style={{ marginRight: '50px' }}>
                                                                    <Statistic title={<span style={{fontSize:'16px'}}>暴力破解</span>}
                                                                               value={brutCount}
                                                                    />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col span={5} style={{ marginLeft: '0px' }}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '240px',
                                                                minWidth: '200px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col pull={2} span={24} style={{ marginRight: '50px' }}>
                                                                    <Statistic title={<span style={{fontSize:'16px'}}>权限提升</span>}
                                                                               value={privCount} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                    <Col span={4} style={{ marginLeft: '0px' }}>
                                                        <Card
                                                            bordered={false}
                                                            style={{
                                                                height: '100px',
                                                                width: '240px',
                                                                minWidth: '200px', // 最小宽度300px，而非100px
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col pull={2} span={24} style={{ marginRight: '50px' }}>
                                                                    <Statistic title={<span style={{fontSize:'16px'}}>防御规避</span>}
                                                                               value={defensCount} />
                                                                </Col>

                                                            </Row>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                        <Col span={24}>
                                            <Card bordered={false}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 6,
                                                    fontWeight: 'bold',
                                                }}>
                                                    <h2 style={{
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        marginLeft: '0px',
                                                        // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                    }}>威胁分析</h2>
                                                </div>
                                                <Menu
                                                    onClick={this.handleMenuClick}
                                                    selectedKeys={[this.state.currentPanel]}
                                                    mode="horizontal"
                                                    style={{ display: 'flex', width: '100%' }} // 设置Menu为flex容器
                                                >
                                                    <Menu.Item key="brute-force">TTPs-暴力破解</Menu.Item>
                                                    <Menu.Item key="privilege-escalation">TTPs-权限提升</Menu.Item>
                                                    <Menu.Item key="defense-avoidance">TTPs-防御规避</Menu.Item>
                                                    <div style={{ flexGrow: 1 }}></div>
                                                </Menu>
                                                <Card bordered={false}>{
                                                    this.renderCurrentPanel(bruteforceTTPsOriginData, privilegeescalationTTPsOriginData, defenseavoidanceTTPsOriginData)}
                                                </Card>
                                            </Card>
                                        </Col>
                                    </Row>;
                                </Col>
                            </Row>
                        </div>
                    );
                }}

            </DataContext.Consumer>
        );
    }
}

export default ThreatHunting;
