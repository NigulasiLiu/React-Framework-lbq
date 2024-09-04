import React from 'react';
import { Row, Col, Card, Tag, Tooltip, Button, Table } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';


const DomainDetails: React.FC = () => {
    const domainInfo = {
        domain: "fget-career.com",
        reportDate: "2022-12-20",
        // threatLevel: "恶意软件",
        tags: ["恶意软件", "安全机构接管C2", "njRAT远控", "Sinkhole", "Ramnit蠕虫"],
        relatedURLCount: 0,
        relatedSampleCount: 1000,
        resolvedIPCount: 21,
        registrationDate: "2016-06-07 13:50:07",
        expirationDate: "2025-06-07 13:50:07",
        registrar: "Dynadot Inc",
        icpRecord: "-",
        securityAnalysis: "判定fget-career.com为恶意域名。它存在恶意软件行为，并与njRAT远控,Sinkhole,Ramnit蠕虫有关。该域名已被安全机构接管，因此无法产生进一步危害。根据情报局掌握的信息，域名在2016年06月07日注册，在2025年06月07日过期，服务商为Dynadot Inc，服务器为NS1.CSOF.NET|NS2.CSOF.NET|NS3.CSOF.NET|NS4.CSOF.NET。有1000+个样本与该域名有通信行为，关联样本主要涉及Farfli,FlyStudio,Ramnit恶意样本家族，恶意类型为病毒,木马。此外有215篇文献提及了此域名为恶意软件，此外有15篇文章提及了此域名。\n" +
            "\n" +
            "分析洞察：资产测绘信息显示该域名存在数字证书，可能用于与恶意样本的加密通讯，以躲避安全产品检测。",
    };

    const tagColors: Record<string, string> = {
        "恶意软件": "red",
        "安全机构接管C2": "orange",
        "njRAT远控": "volcano",
        "Sinkhole": "blue",
        "Ramnit蠕虫": "magenta"
    };

    // 表格数据和列定义
    const dataSource = [
        {
            key: '1',
            firstSeen: '2016-08-10 10:15:30',
            lastSeen: '2022-12-20 14:22:45',
            info: ['远控', 'njRAT远控'],
            status: '有效',
        },
        {
            key: '2',
            firstSeen: '2018-06-08 11:30:00',
            lastSeen: '2022-12-20 13:18:10',
            info: ['远控', 'Ramnit蠕虫'],
            status: '有效',
        },
        {
            key: '3',
            firstSeen: '2022-11-08 09:45:50',
            lastSeen: '2022-12-20 15:33:20',
            info: ['恶意软件'],
            status: '有效',
        },
        {
            key: '4',
            firstSeen: '2021-03-25 08:22:15',
            lastSeen: '2022-12-20 12:27:05',
            info: ['恶意软件', 'Ramnit蠕虫'],
            status: '有效',
        },
        {
            key: '5',
            firstSeen: '2017-08-17 16:10:40',
            lastSeen: '2022-12-20 17:19:55',
            info: ['安全机构接管C2', 'Sinkhole'],
            status: '有效',
        },
    ];

    const columns = [
        {
            title: '首次发现时间',
            dataIndex: 'firstSeen',
            key: 'firstSeen',
            render: (text: string) => <span>{text}</span>,
            sorter: (a: { firstSeen: string }, b: { firstSeen: string }) => new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime(),
        },
        {
            title: '末次更新时间',
            dataIndex: 'lastSeen',
            key: 'lastSeen',
            render: (text: string) => <span>{text}</span>,
            sorter: (a: { lastSeen: string }, b: { lastSeen: string }) => new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime(),
        },
        {
            title: '情报内容',
            dataIndex: 'info',
            key: 'info',
            render: (info: string[]) => (
                <>
                    {info.map(tag => (
                        <Tag color={tagColors[tag] || 'default'} key={tag} style={{ marginBottom: '4px' }}>
                            {tag}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: '有效', value: '有效' },
                { text: '无效', value: '无效' },
            ],
            onFilter: (value: string | number | boolean, record: { status: string }) => record.status.includes(value as string),
            render: (text: string) => <span style={{ color: 'green' }}>{text}</span>,
        },
    ];
    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5',fontFamily:'宋体' }}>
            <Card bordered={false} style={{ backgroundColor: '#ffffff' }}>
                <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
                    <Col span={3} style={{ textAlign: 'left' }}>
                        <img
                            src="https://x.threatbook.com/public/public/img/8b74c36e.judge_malicious.svg"
                            alt="Malware Icon"
                            style={{ width: '100px',transform:'translateX(20px)' }}
                        />
                    </Col>
                    <Col span={21} style={{ textAlign: 'left' ,transform:'translateY(-20px)' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px'}}>{domainInfo.domain}</h1>
                        <p>{domainInfo.reportDate} 情报更新</p>
                        <div style={{ marginBottom: '8px' }}>
                            <Tooltip title="点击查看历史排名">
                                <span style={{ marginLeft: '8px', fontSize: '14px', color: '#555' }}>Umbrella 548185</span>
                            </Tooltip>
                            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#555' }}>• Alexa 100w+ •</span>
                            <Tooltip title="查看历史排名">
                                <span style={{ marginLeft: '8px', fontSize: '14px', color: '#555' }}>查看历史排名</span>
                            </Tooltip>
                        </div>
                        <div>
                            {domainInfo.tags.map(tag => (
                                <Tag color={tagColors[tag] || 'default'} key={tag} style={{ fontSize: '16px', marginBottom: '4px' }}>{tag}</Tag>
                            ))}
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 4]} style={{ marginTop: '-6px', paddingLeft: '16px', paddingRight: '16px' }}>
                    <Col span={6}>
                        <p>相关URL: {domainInfo.relatedURLCount}</p>
                    </Col>
                    <Col span={6}>
                        <p>解析IP数: {domainInfo.resolvedIPCount}</p>
                    </Col>
                    <Col span={6}>
                        <p>相关样本: {domainInfo.relatedSampleCount}+</p>
                    </Col>
                    <Col span={6}>
                        <p>子域名数: {domainInfo.relatedSampleCount}+</p>
                    </Col>
                    <Col span={6}>
                        <p>注册时间: {domainInfo.registrationDate}</p>
                    </Col>
                    <Col span={6}>
                        <p>过期时间: {domainInfo.expirationDate}</p>
                    </Col>
                    <Col span={6}>
                        <p>域名服务商: {domainInfo.registrar}</p>
                    </Col>
                    <Col span={6}>
                        <p>ICP备案: {domainInfo.icpRecord}</p>
                    </Col>
                </Row>
                <Row>
                    <Card bordered={false} style={{ backgroundColor: '#F6F7FB', marginTop: '10px' }}>
                        <h3 style={{ fontWeight: 'bold' }}>情报分析
                            <Tag color="blue" style={{ marginLeft: '8px' }}>beta</Tag>
                        </h3>
                        <p>{domainInfo.securityAnalysis}</p></Card>
                </Row>
            </Card>
            <Card bordered={false} style={{ backgroundColor: '#ffffff', marginTop: '24px' }}>
                <h3 style={{ fontWeight: 'bold',marginBottom:'10px' }}>情报
                    <Tag color="blue" style={{ marginLeft: '8px' }}>beta</Tag>
                </h3>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    rowClassName={() => 'table-row'}
                    bordered
                    style={{ backgroundColor: '#fffbe6' }}
                />
            </Card>
        </div>
    );
};

export default DomainDetails;
