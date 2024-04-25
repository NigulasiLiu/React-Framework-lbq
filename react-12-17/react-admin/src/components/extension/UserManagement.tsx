// UserManagement.tsx

import React from 'react';
import { Card, Col, Button, Row, Modal, Form, Input } from 'antd'
import { Link } from 'react-router-dom';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';


class UserManagement extends React.Component<{}> {

    userManagementColumns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '角色',
            dataIndex: 'character',
            key: 'character',
        },
        {
            title: '权限',
            dataIndex: 'authority',
            key: 'authority',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text: string, record: any) => (
                // 在 render 方法中返回包含按钮的元素
                <Link to="/app/detailspage" target="_blank">
                    <Button type="link" className='custom-link-button'>{text}</Button>
                </Link>)
        }
    ];

    render() {
        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>用户管理</h2>
                                </div>
                                <FetchDataForElkeidTable
                                    apiEndpoint="http://localhost:5000/api/usermanagement"
                                    timeColumnIndex={[]}
                                    columns={this.userManagementColumns}
                                    currentPanel={"UserManagementlist"}
                                />
                            </Card>
                        </div>
                    </Col>

                </Row>
            </div>
        );
    }
}

export default UserManagement;
