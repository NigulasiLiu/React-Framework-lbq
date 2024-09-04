import React from 'react';
import { Col, Row, Modal, Form, Input, Select, Table, Tooltip, Button, Tag, Card, message, Radio } from 'antd';
import { constRenderTable, Honeypotcolumns, threatBookC2Data, threatBookDGAData } from '../Columns';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ThreatBookColumns = [
    {
        title: '域名',
        dataIndex: 'domain',
        key: 'domain',
        render: (text: string, record: any) => (
            <div>
                <div>
                    <Link
                        to={`/app/domaindetails?domain=${encodeURIComponent(
                            record.domain || 'defaultdomain'
                        )}`}
                        target="_blank"
                    >
                        <Button
                            style={{
                                fontWeight: 'bold',
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                color: '#4086FF',
                                padding: '0 0',
                            }}
                        >
                            <Tooltip title={record.domain || 'Unknown Domain'}>
                                <div
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '150px',
                                    }}
                                >
                                    {record.domain || '-'}
                                </div>
                            </Tooltip>
                        </Button>
                    </Link>
                </div>
                <div
                    style={{
                        fontSize: 'small',
                        background: '#f0f0f0',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        display: 'inline-block',
                        marginTop: '4px',
                    }}
                >
                    <span style={{ fontWeight: 'bold' }}>解析IP数:</span> {record.resolvedIPCount || '-'}
                </div>
            </div>
        ),
    },
    {
        title: '恶意类型',
        dataIndex: 'maliciousType',
        key: 'maliciousType',
    },
    {
        title: '威胁等级',
        dataIndex: 'threatLevel',
        key: 'threatLevel',
        render: (text: string) => {
            let color = '';
            if (text === '高') {
                color = 'red';
            } else if (text === '中') {
                color = 'orange';
            } else if (text === '低') {
                color = 'green';
            }
            return <Tag color={color}>{text}</Tag>;
        },
    },
    {
        title: '检测时间',
        dataIndex: 'detectionTime',
        key: 'detectionTime',
        sorter: (a: { detectionTime: string }, b: { detectionTime: string }) => new Date(a.detectionTime).getTime() - new Date(b.detectionTime).getTime(),
    },
    {
        title: '解析IP数',
        dataIndex: 'resolvedIPCount',
        key: 'resolvedIPCount',
        sorter: (a: { resolvedIPCount: number; }, b: { resolvedIPCount: number; }) => a.resolvedIPCount - b.resolvedIPCount,
    },
    {
        title: '相关样本',
        dataIndex: 'relatedSamples',
        key: 'relatedSamples',
        sorter: (a: { relatedSamples: string; }, b: { relatedSamples: string; }) => parseInt(a.relatedSamples) - parseInt(b.relatedSamples),
    },
    {
        title: '子域名数',
        dataIndex: 'subdomainCount',
        key: 'subdomainCount',
        sorter: (a: { subdomainCount: number; }, b: { subdomainCount: number; }) => a.subdomainCount - b.subdomainCount,
    },
    {
        title: '域名服务商',
        dataIndex: 'domainRegistrar',
        key: 'domainRegistrar',
    },
    {
        title: '注册/过期时间',
        dataIndex: 'registrationTime',
        key: 'registrationTime',
        render: (text: string, record: any) => (
            <div>
                <div>{record.registrationTime}</div>
                <div>{record.expirationTime}</div>
            </div>
        ),
        sorter: (a: { registrationTime: string }, b: { registrationTime: string }) => new Date(a.registrationTime).getTime() - new Date(b.registrationTime).getTime(),
    }
];

interface ThreatBookStates {
    modalVisible: boolean,
    monitoringType: string, // 新增状态来记录当前选择的监测类型
    lastUpdated:string,
    currentTableType: string,
};

class ThreatBook extends React.Component<{}, ThreatBookStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            lastUpdated: '',
            modalVisible: false,
            monitoringType: 'DGA', // 默认显示DGA域名列表
            currentTableType: 'DGA', // 用于记录当前Table类型
        };
    }
    componentDidMount() {
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        });
    }
    handleUpdateTime(){
      this.setState({ lastUpdated: new Date().toLocaleString(), });
    }

    // 切换监测类型和表格内容
    handleMonitoringTypeChange = (e: any) => {
        this.setState({ monitoringType: e.target.value });
    };

    // 切换Table类型
    handleTableTypeChange = (e: any) => {
        this.setState({ currentTableType: e.target.value });
    };

    render() {
        const { monitoringType } = this.state;

        const dataSource = monitoringType === 'DGA' ? threatBookDGAData : threatBookC2Data;

        return (
            <div style={{ fontFamily: '宋体, sans-serif', fontWeight: 'bold' }}>

                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col md={24}>
                        <div style={{ fontWeight: 'bolder', width: '100%' }}>
                            <Card bordered={true} style={{ backgroundColor: '#ffffff', height: '600px' }}>
                                <Row>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: 8,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                marginLeft: '0px',
                                            }}
                                        >
                                            {"域名信息列表"}
                                        </h2>
                                    </div>
                                </Row>

                                <Row gutter={[12, 6]} style={{ marginTop: '-10px' }}>
                                    <Col md={24}>
                                        <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                                            <div style={{ marginBottom: '16px' }}>
                                                <Row gutter={[2, 2]}>
                                                    <Col flex="auto"
                                                         style={{
                                                             textAlign: 'left',
                                                             marginLeft: 10,
                                                             marginTop: '5px'
                                                         }}>
                                                        <span>最近更新时间: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                                    </Col>
                                                    <Col flex="auto"
                                                         style={{
                                                             textAlign: 'left',
                                                             marginLeft: 10,
                                                             marginTop: '5px'
                                                         }}>
                                                        <Radio.Group
                                                            onChange={this.handleMonitoringTypeChange}
                                                            value={monitoringType}
                                                            style={{ marginBottom: '0px',
                                                                transform: 'translateX(-305px) translateY(-5px)', }}
                                                        >
                                                            <Radio.Button value="DGA">DGA域名监测</Radio.Button>
                                                            <Radio.Button value="C2">C2恶意域名监测</Radio.Button>
                                                        </Radio.Group>
                                                    </Col>
                                                    <Col style={{
                                                        textAlign: 'left',
                                                        marginLeft: 10,
                                                        marginRight: '0px'
                                                    }}>
                                                        <Button icon={<ReloadOutlined />}
                                                                onClick={this.handleUpdateTime}
                                                        >刷新</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <Table
                                                className={"customTable"}
                                                dataSource={dataSource}
                                                columns={ThreatBookColumns}
                                                pagination={{
                                                    showQuickJumper: true,
                                                }}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ThreatBook;
