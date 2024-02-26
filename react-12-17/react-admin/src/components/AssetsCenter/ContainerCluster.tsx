// ContainerCluster.tsx

import React from 'react';
import axios from 'axios';
import {Card, Col, Row } from 'antd';
import FetchAPIDataTable from './FetchAPIDataTable';

interface FimProps {
}


class ContainerCluster extends React.Component<{}> {
    // Define your table columns based on the DataItem interface
    containerColumns = [
    {
        title: '集群',
        dataIndex: 'cluster',
        key: 'cluster',
    },
    {
        title: '集群版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '节点数',
        dataIndex: 'nodeNumber',
        key: 'nodeNumber',
    },
    {
        title: '安全组件状态',
        dataIndex: 'componentStatus',
        key: 'componentStatus',
    },
    {
        title: '风险',
        dataIndex: 'risk',
        key: 'risk',
    },
    {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
    },
    ];
    
    
    
    render() {
        return (
        <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col md={24}>
                        <div className="gutter-box">
                        <Card bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>容器集群</h2>
                            </div>
                            <FetchAPIDataTable
                            apiEndpoint="http://localhost:5000/api/files/hostinventory"
                            timeColumnIndex={[]}
                            columns={this.containerColumns}
                            currentPanel={"containerClusterlist"}
                            />
                            </Card>
                        </div>
                    </Col>

        </Row>
        </div>
        );
      }
}

export default ContainerCluster;
