import React from 'react';
import { Col, Row, Table, Tooltip, Button, Tag, Card, Radio, message } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../../Style.css'

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
    // {
    //     title: '域名服务商',
    //     dataIndex: 'domainRegistrar',
    //     key: 'domainRegistrar',
    // },
    // {
    //     title: '注册/过期时间',
    //     dataIndex: 'registrationTime',
    //     key: 'registrationTime',
    //     render: (text: string, record: any) => (
    //         <div>
    //             <div>{record.registrationTime}</div>
    //             <div>{record.expirationTime}</div>
    //         </div>
    //     ),
    //     sorter: (a: { registrationTime: string }, b: { registrationTime: string }) => new Date(a.registrationTime).getTime() - new Date(b.registrationTime).getTime(),
    // }
];

export const ExampleData = [
    {
        domain: 'ehzwq.shop',
        maliciousType: 'Azorult',
        threatLevel: '中',
        detectionTime: '2024-09-05 08:20',
        resolvedIPCount: 1,
        relatedSamples: 'AZORult',
        subdomainCount: 1,
        domainRegistrar: 'abuse_ch',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '47.121.215.116:80',
        maliciousType: 'Cobalt Strike',
        threatLevel: '高',
        detectionTime: '2024-09-04 12:00',
        resolvedIPCount: 1,
        relatedSamples: 'ALIBABA-CN-NET AS37963 c2 censys CobaltStrike cs-watermark-987654321',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '93.123.85.199:47925',
        maliciousType: 'MooBot',
        threatLevel: '中',
        detectionTime: '2024-09-04 12:01',
        resolvedIPCount: 1,
        relatedSamples: 'AS216240 c2 censys moobot MORTALSOFT',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '93.157.106.238:1111',
        maliciousType: 'Bashlite',
        threatLevel: '中',
        detectionTime: '2024-09-05 08:18',
        resolvedIPCount: 1,
        relatedSamples: 'Gafgyt GhOul',
        subdomainCount: 0,
        domainRegistrar: 'NDA0E',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '104.194.158.61:80',
        maliciousType: 'Unknown malware',
        threatLevel: '中',
        detectionTime: '2024-09-05 08:01',
        resolvedIPCount: 1,
        relatedSamples: 'AS14956 c2 censys Fletchen panel ROUTERHOSTING stealer',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '35.79.171.237:80',
        maliciousType: 'Brute Ratel C4',
        threatLevel: '高',
        detectionTime: '2024-09-05 08:01',
        resolvedIPCount: 1,
        relatedSamples: 'AMAZON-02 AS16509 c2 censys',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '143.198.143.45:80',
        maliciousType: 'Havoc',
        threatLevel: '高',
        detectionTime: '2024-09-05 08:01',
        resolvedIPCount: 1,
        relatedSamples: 'AS14061 c2 censys DIGITALOCEAN-ASN',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '137.184.244.10:80',
        maliciousType: 'Havoc',
        threatLevel: '高',
        detectionTime: '2024-09-05 08:01',
        resolvedIPCount: 1,
        relatedSamples: 'AS14061 c2 censys DIGITALOCEAN-ASN',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '223.155.16.34:23333',
        maliciousType: 'Quasar RAT',
        threatLevel: '高',
        detectionTime: '2024-09-05 08:01',
        resolvedIPCount: 1,
        relatedSamples: 'AS4134 c2 censys CHINANET-BACKBONE RAT',
        subdomainCount: 0,
        domainRegistrar: 'DonPasci',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: '154.216.20.211:6902',
        maliciousType: 'Remcos',
        threatLevel: '高',
        detectionTime: '2024-09-04 10:55',
        resolvedIPCount: 1,
        relatedSamples: 'remcos',
        subdomainCount: 0,
        domainRegistrar: 'abuse_ch',
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
];
export const ExampleData1 = [
    {
        domain: "www2024.ethergases.org",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.xwdvawwwwwwwebmail.ethergases.org",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 6,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.suxlswwwapi.ethergases.app",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wwsssl.ethergases.app",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 7,
        relatedSamples: "4",
        subdomainCount: 3,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wcnlenwwwofficevpn.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.cloud.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 6,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.analytic.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 4,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.acceso.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 4,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wp.ethergases.org",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 5,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wp.ethergases.app",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 5,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.webmail.ethergases.org",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 6,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "zp3mvmzab.top",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:31",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "yshrirambook.online",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:31",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "yrinvisible.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:31",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "wwwmobileconnect.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 6,
        relatedSamples: "2",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wapp.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wadmin.ethergases.app",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.waccess.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www1.ethergases.org",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 6,
        relatedSamples: "2",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.tthvgatewaycitrix.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
    {
        domain: "www.wremote.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
        registrationTime: 'N/A',
        expirationTime: 'N/A',
    },
];
export const threatBookDGAData = [
    {
        domain: 'bankofamerica.secure-auth.com',
        maliciousType: '恶意软件',
        threatLevel: '高',
        detectionTime: '2023-08-01 12:00:00',
        resolvedIPCount: 35,
        relatedSamples: '1200+',
        subdomainCount: 850,
        domainRegistrar: 'GoDaddy',
        registrationTime: '2021-01-01 13:50:07',
        expirationTime: '2025-01-01 13:50:07',
    },
    {
        domain: 'paypal-security-login.com',
        maliciousType: '木马',
        threatLevel: '中',
        detectionTime: '2023-08-10 14:30:00',
        resolvedIPCount: 20,
        relatedSamples: '950+',
        subdomainCount: 400,
        domainRegistrar: 'Namecheap',
        registrationTime: '2022-02-15 09:20:00',
        expirationTime: '2026-02-15 09:20:00',
    },
    {
        domain: 'apple-id-verify.com',
        maliciousType: '勒索软件',
        threatLevel: '低',
        detectionTime: '2023-08-15 10:45:00',
        resolvedIPCount: 28,
        relatedSamples: '700+',
        subdomainCount: 300,
        domainRegistrar: 'Tucows',
        registrationTime: '2021-05-10 11:15:00',
        expirationTime: '2026-05-10 11:15:00',
    },
    {
        domain: 'google-account-secure.com',
        maliciousType: '蠕虫病毒',
        threatLevel: '高',
        detectionTime: '2023-08-20 09:00:00',
        resolvedIPCount: 40,
        relatedSamples: '1400+',
        subdomainCount: 1200,
        domainRegistrar: 'Bluehost',
        registrationTime: '2020-06-01 15:30:00',
        expirationTime: '2024-06-01 15:30:00',
    },
    {
        domain: 'facebook-security-check.com',
        maliciousType: '恶意广告',
        threatLevel: '中',
        detectionTime: '2023-08-25 16:45:00',
        resolvedIPCount: 15,
        relatedSamples: '600+',
        subdomainCount: 500,
        domainRegistrar: 'Enom',
        registrationTime: '2019-09-25 08:15:00',
        expirationTime: '2023-09-25 08:15:00',
    },
    {
        domain: 'microsoft-update-security.com',
        maliciousType: '木马下载器',
        threatLevel: '高',
        detectionTime: '2023-09-01 11:30:00',
        resolvedIPCount: 50,
        relatedSamples: '1500+',
        subdomainCount: 1400,
        domainRegistrar: 'NameSilo',
        registrationTime: '2021-12-01 10:45:00',
        expirationTime: '2026-12-01 10:45:00',
    },
    {
        domain: 'amazon-login-secure.com',
        maliciousType: '数据盗窃',
        threatLevel: '中',
        detectionTime: '2023-09-05 13:00:00',
        resolvedIPCount: 22,
        relatedSamples: '800+',
        subdomainCount: 750,
        domainRegistrar: 'Hover',
        registrationTime: '2020-03-10 09:00:00',
        expirationTime: '2024-03-10 09:00:00',
    },
    {
        domain: 'netflix-account-update.com',
        maliciousType: '间谍软件',
        threatLevel: '低',
        detectionTime: '2023-09-10 17:30:00',
        resolvedIPCount: 10,
        relatedSamples: '500+',
        subdomainCount: 400,
        domainRegistrar: 'Google Domains',
        registrationTime: '2019-11-15 12:00:00',
        expirationTime: '2023-11-15 12:00:00',
    },
    {
        domain: 'github-security-warning.com',
        maliciousType: '网络钓鱼',
        threatLevel: '高',
        detectionTime: '2023-09-15 19:00:00',
        resolvedIPCount: 30,
        relatedSamples: '1000+',
        subdomainCount: 900,
        domainRegistrar: 'Dynadot',
        registrationTime: '2022-04-20 14:30:00',
        expirationTime: '2026-04-20 14:30:00',
    },
    {
        domain: 'twitter-security-check.com',
        maliciousType: '广告劫持',
        threatLevel: '中',
        detectionTime: '2023-09-20 20:00:00',
        resolvedIPCount: 18,
        relatedSamples: '650+',
        subdomainCount: 500,
        domainRegistrar: 'HostGator',
        registrationTime: '2020-07-05 18:45:00',
        expirationTime: '2024-07-05 18:45:00',
    }
];
export const threatBookC2Data = [
    {
        domain: 'malicious-command-control.com',
        maliciousType: 'C2命令控制',
        threatLevel: '高',
        detectionTime: '2023-07-15 08:00:00',
        resolvedIPCount: 60,
        relatedSamples: '2000+',
        subdomainCount: 3200,
        domainRegistrar: 'GoDaddy',
        registrationTime: '2020-11-20 16:00:00',
        expirationTime: '2025-11-20 16:00:00',
    },
    {
        domain: 'c2-server.com',
        maliciousType: 'C2命令控制',
        threatLevel: '低',
        detectionTime: '2023-07-20 09:30:00',
        resolvedIPCount: 10,
        relatedSamples: '600+',
        subdomainCount: 700,
        domainRegistrar: 'Namecheap',
        registrationTime: '2019-08-08 12:45:00',
        expirationTime: '2024-08-08 12:45:00',
    },
    {
        domain: 'control-panel-malicious.com',
        maliciousType: 'C2命令控制',
        threatLevel: '中',
        detectionTime: '2023-08-05 07:15:00',
        resolvedIPCount: 25,
        relatedSamples: '900+',
        subdomainCount: 1500,
        domainRegistrar: 'Tucows',
        registrationTime: '2021-07-18 18:30:00',
        expirationTime: '2026-07-18 18:30:00',
    },
    {
        domain: 'secure-access-malware.com',
        maliciousType: 'C2命令控制',
        threatLevel: '高',
        detectionTime: '2023-08-10 06:45:00',
        resolvedIPCount: 50,
        relatedSamples: '1200+',
        subdomainCount: 2200,
        domainRegistrar: 'Bluehost',
        registrationTime: '2020-12-05 17:15:00',
        expirationTime: '2025-12-05 17:15:00',
    },
    {
        domain: 'c2-dynamic.com',
        maliciousType: 'C2命令控制',
        threatLevel: '中',
        detectionTime: '2023-08-15 08:30:00',
        resolvedIPCount: 20,
        relatedSamples: '700+',
        subdomainCount: 1100,
        domainRegistrar: 'Enom',
        registrationTime: '2021-03-22 14:45:00',
        expirationTime: '2026-03-22 14:45:00',
    },
    {
        domain: 'malicious-access.net',
        maliciousType: 'C2命令控制',
        threatLevel: '低',
        detectionTime: '2023-08-20 10:00:00',
        resolvedIPCount: 15,
        relatedSamples: '500+',
        subdomainCount: 900,
        domainRegistrar: 'NameSilo',
        registrationTime: '2019-06-25 16:30:00',
        expirationTime: '2024-06-25 16:30:00',
    },
    {
        domain: 'malicious-operations.com',
        maliciousType: 'C2命令控制',
        threatLevel: '高',
        detectionTime: '2023-08-25 12:15:00',
        resolvedIPCount: 40,
        relatedSamples: '1500+',
        subdomainCount: 2400,
        domainRegistrar: 'Hover',
        registrationTime: '2020-05-10 11:00:00',
        expirationTime: '2025-05-10 11:00:00',
    },
    {
        domain: 'secure-command.net',
        maliciousType: 'C2命令控制',
        threatLevel: '中',
        detectionTime: '2023-08-30 14:00:00',
        resolvedIPCount: 22,
        relatedSamples: '750+',
        subdomainCount: 1400,
        domainRegistrar: 'Google Domains',
        registrationTime: '2021-08-15 13:30:00',
        expirationTime: '2026-08-15 13:30:00',
    },
    {
        domain: 'remote-access-secure.com',
        maliciousType: 'C2命令控制',
        threatLevel: '高',
        detectionTime: '2023-09-05 15:30:00',
        resolvedIPCount: 30,
        relatedSamples: '1000+',
        subdomainCount: 1600,
        domainRegistrar: 'Dynadot',
        registrationTime: '2020-10-05 09:15:00',
        expirationTime: '2025-10-05 09:15:00',
    },
    {
        domain: 'c2-operations.com',
        maliciousType: 'C2命令控制',
        threatLevel: '低',
        detectionTime: '2023-09-10 16:45:00',
        resolvedIPCount: 12,
        relatedSamples: '450+',
        subdomainCount: 1100,
        domainRegistrar: 'HostGator',
        registrationTime: '2019-02-20 17:00:00',
        expirationTime: '2024-02-20 17:00:00',
    }
];
export const ExampleData3 = [
    {
        domain: "moneymoj.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "SmartApeSG",
    },
    {
        domain: "mondalhardware.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "messageflowpro.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "mail.ethergases.app",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 6,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
    },
    {
        domain: "libidotechnexus.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 5,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "launchpads-metis.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "AS57724",
    },
    {
        domain: "labvirtual.pythr.net",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 4,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
    },
    {
        domain: "ki.xxx9.info",
        maliciousType: "Unknown malware",
        threatLevel: "高",
        detectionTime: "2024-09-09 04:02",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "AS24940",
    },
    {
        domain: "jurassicworldtheexhibition.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "sevenv7pn.top",
        maliciousType: "CryptBot",
        threatLevel: "高",
        detectionTime: "2024-09-09 18:55",
        resolvedIPCount: 5,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "saratu.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "quickresource.xyz",
        maliciousType: "ClearFake",
        threatLevel: "中",
        detectionTime: "2024-09-09 16:31",
        resolvedIPCount: 3,
        relatedSamples: "1",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "quickresource.lol",
        maliciousType: "ClearFake",
        threatLevel: "中",
        detectionTime: "2024-09-09 16:31",
        resolvedIPCount: 3,
        relatedSamples: "1",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "pwrhicevgwwwsowgoowa.ethergases.app",
        maliciousType: "HookBot",
        threatLevel: "中",
        detectionTime: "2024-09-09 20:02",
        resolvedIPCount: 4,
        relatedSamples: "3",
        subdomainCount: 2,
        domainRegistrar: "AS57724",
    },
    {
        domain: "proxy-pol.depo.com.ru",
        maliciousType: "Unknown malware",
        threatLevel: "高",
        detectionTime: "2024-09-10 00:02",
        resolvedIPCount: 5,
        relatedSamples: "3",
        subdomainCount: 1,
        domainRegistrar: "AS9123",
    },
    {
        domain: "penisowners.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "osiria-agency.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "optifitme.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "oldbrooklynbrewingcompany.com",
        maliciousType: "FAKEUPDATES",
        threatLevel: "高",
        detectionTime: "2024-09-09 16:32",
        resolvedIPCount: 4,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
    {
        domain: "neinv9sb.top",
        maliciousType: "CryptBot",
        threatLevel: "高",
        detectionTime: "2024-09-09 18:55",
        resolvedIPCount: 5,
        relatedSamples: "2",
        subdomainCount: 1,
        domainRegistrar: "Unknown",
    },
];
export const logData = [
    {
        id: 1,
        uuid: '0820bffa8ecf4a059cb87b33be46c313',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:10:42',
        atk_type: 3,
    },
    {
        id: 2,
        uuid: '62803374c3744b21bb2debe3cd53d77d',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:10:50',
        atk_type: 2,
    },
    {
        id: 3,
        uuid: '52a997b682954741a328eb73920fbb60',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:06',
        atk_type: 3,
    },
    {
        id: 4,
        uuid: 'd15e0c78b6ab45c5b101b32d39c07521',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:13',
        atk_type: 1,
    },
    {
        id: 5,
        uuid: 'eaa57a5695ac4bb5bd69e150afce41fa',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:16',
        atk_type: 3,
    },
    {
        id: 6,
        uuid: 'd888ac536f954871b1a82c99a38b7d87',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:22',
        atk_type: 2,
    },
    {
        id: 7,
        uuid: '9c07f45fc68b4a6eb7ddbecc8111fb5a',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:48',
        atk_type: 1,
    },
    {
        id: 8,
        uuid: 'd3cd150b0e7a48a5bb6ec75dc12f0a10',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:12:07',
        atk_type: 3,
    },
    {
        id: 9,
        uuid: '26f87afb51af4335b2b2dd8e3c1cd275',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:13:29',
        atk_type: 1,
    },
    {
        id: 10,
        uuid: 'c03d00a89243486fbf005ab7c136e8d5',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:14:03',
        atk_type: 2,
    },
];
export const logData1 = [
    {
        id: 1,
        uuid: 'd15e0c78b6ab45c5b101b32d39c07521',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:13',
        atk_type: 1,
    },
    {
        id: 2,
        uuid: '9c07f45fc68b4a6eb7ddbecc8111fb5a',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:48',
        atk_type: 1,
    },
    {
        id: 3,
        uuid: '26f87afb51af4335b2b2dd8e3c1cd275',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:13:29',
        atk_type: 1,
    },
];
export const logData2 = [
    {
        id: 1,
        uuid: '62803374c3744b21bb2debe3cd53d77d',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:10:50',
        atk_type: 2,
    },
    {
        id: 2,
        uuid: 'd888ac536f954871b1a82c99a38b7d87',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:22',
        atk_type: 2,
    },
    {
        id: 3,
        uuid: 'c03d00a89243486fbf005ab7c136e8d5',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:14:03',
        atk_type: 2,
    },
];
export const logData3 = [
    {
        id: 1,
        uuid: '0820bffa8ecf4a059cb87b33be46c313',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:10:42',
        atk_type: 3,
    },
    {
        id: 2,
        uuid: '52a997b682954741a328eb73920fbb60',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:06',
        atk_type: 3,
    },
    {
        id: 2,
        uuid: 'eaa57a5695ac4bb5bd69e150afce41fa',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:11:16',
        atk_type: 3,
    },
    {
        id: 3,
        uuid: 'd3cd150b0e7a48a5bb6ec75dc12f0a10',
        agent_ip: '192.168.88.1',
        atk_ip: '36.148.125.205',
        scan_time: '2024-09-10 20:12:07',
        atk_type: 3,
    },
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

    // 点击按钮时更新lastUpdated并弹出消息
    handleUpdateTime = () => {
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        });
        message.success('最新情报获取成功，时延:41.83s');
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

        const dataSource = monitoringType === 'DGA' ? ExampleData1 : ExampleData3;

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
                                                        <Button icon={<GlobalOutlined />}
                                                                onClick={this.handleUpdateTime}
                                                        >获取最新情报</Button>
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
