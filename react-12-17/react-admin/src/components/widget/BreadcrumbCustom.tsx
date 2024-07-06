import React, { ReactNode } from 'react';
import { Alert, Breadcrumb, Button, Card, Col, Row, Statistic } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { determineOS } from '../ContextAPI/DataService';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';

interface BreadcrumbCustomProps {
    breads?: ReactNode[];
}

const BreadcrumbCustom = (props: BreadcrumbCustomProps) => {
    const { breads } = props;
    const location = useLocation();
    // //const queryParams = queryString.parse(location.search);
    // const queryParams = new URLSearchParams(window.location.search);
    // //const host_uuid = queryParams.get('uuid') || 'defaultUUID';

    // // 如果你需要处理queryParams可能不存在的情况（虽然一般情况下不会发生），可以这样做：
    // const host_uuid = queryParams ? queryParams.get('uuid') || 'defaultUUID' : 'defaultUUID';

// 假设当前URL是：http://localhost:3006/#/app/detailspage?uuid=11111111-1111-1111-1111-111111111111

    const hash = window.location.hash; // 获取URL的哈希部分
    const queryParamsString = hash.substring(hash.indexOf('?') + 1); // 提取查询字符串
    // const queryParams = new URLSearchParams(queryParamsString); // 使用查询字符串创建URLSearchParams实例
    // const host_uuid = queryParams.get('uuid') || 'defaultUUID'; // 尝试获取uuid，如果未找到则使用默认值
    const queryParams = queryParamsString ? new URLSearchParams(queryParamsString) : new URLSearchParams();
    const host_uuid = queryParams.get('uuid') || 'defaultUUID'; // 尝试获取uuid，如果未找到则使用默认值

    console.log(host_uuid); // 输出uuid的值或者'defaultUUID'


    const pagesWithoutSiderMenu = [
        '/app/detailspage',
        '/app/create_agent_task',
        '/app/create_virusscan_task',
        '/app/baseline_detail',
        '/app/virusscan_detail',
    ];

    const pagesWithoutRenderUUID = [
        '/app/create_agent_task',
        '/app/create_virusscan_task',
        '/app/baseline_detail',
        '/app/virusscan_detail'];

    const isDetailPage = pagesWithoutSiderMenu.some(page =>
        location.pathname.includes(page),
    );

    const notRendUUID = pagesWithoutRenderUUID.some(page =>
        location.pathname.includes(page),
    );
    const isBLDetailPage = location.pathname.includes('/app/baseline_detail');

    // 检查是否在详情页且存在uuid参数
    //const isDetailPage = location.pathname.includes('/app/detailspage');

    return (
        <DataContext.Consumer>
            {(context: DataContextType | undefined) => {
                if (!context) {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <LoadingOutlined style={{ fontSize: '3em' }} />
                        </div>
                    );
                }
                const { agentOriginData } = context;
                if (agentOriginData !== undefined) {
                    // 确保agentOriginData总是作为数组处理
                    const originDataArray = Array.isArray(agentOriginData) ? agentOriginData : [agentOriginData];
                    if (originDataArray && originDataArray.length > 0) {
                        // const filteredData = originDataArray.find(item => item.uuid === host_uuid);
                        const filteredData = originDataArray.find(item => item.uuid === host_uuid) || {};

                        // const os_version = determineOS(filteredData);
                        const os_version = determineOS(filteredData) || 'Unknown OS Version';

                        return (
                            <div style={{
                                width: '110%', backgroundColor: '#FFFFFF', //height:'40px',
                                marginLeft: '-20px', padding: '12px', borderBottom: '1px solid #F6F7FB',
                            }}>
                                {isDetailPage && (
                                    <div style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>
                                        <Breadcrumb>
                                            {/* {!isDetailPage && (
                                            <Breadcrumb.Item>
                                                <Link to={'/app/Dashboard'}>安全概览</Link>
                                            </Breadcrumb.Item>
                                        )} */}
                                            {isDetailPage &&
                                                (
                                                    <div>
                                                        <Row style={{ fontSize: '14px' }}>
                                                            <Breadcrumb.Item>
                                                                {isBLDetailPage ?
                                                                    (<Link
                                                                        to={'/app/HostProtection/BaselineDetectList'}>基线检查</Link>) :
                                                                    <Link
                                                                        to={'/app/AssetsCenter/HostInventory'}>主机列表</Link>}
                                                            </Breadcrumb.Item>
                                                            <Breadcrumb.Item>详情页</Breadcrumb.Item>
                                                        </Row>
                                                        <Row>
                                                            {!notRendUUID && (
                                                                <span style={{
                                                                    color: '#000',
                                                                    fontSize: '22px',
                                                                    marginLeft: '0px',
                                                                    paddingTop: '18px',
                                                                }}>
                                                                    {host_uuid} : {filteredData?.os_version || 'Unknown OS Version'} ({os_version || 'Unknown Version'})
                                                        </span>)}
                                                        </Row>
                                                    </div>
                                                )
                                            }
                                            {breads?.map((bread, i) => (
                                                <Breadcrumb.Item key={i}>{bread}</Breadcrumb.Item>
                                            ))}
                                        </Breadcrumb>
                                    </div>
                                )}
                            </div>
                        );
                    }
                } else {
                    // return <div>No data available for this host.</div>;
                    return (
                        <div>
                            <Alert message="No data available for this host." type="warning" showIcon />
                            {/* 如果你希望在没有数据时显示空状态（Empty），可以这样使用 */}
                            {/* <Empty description="No data available for this host." /> */}
                        </div>
                    );
                }
            }}
        </DataContext.Consumer>
    );
};
export default BreadcrumbCustom;
