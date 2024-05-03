// UserManagement.tsx

import React from 'react';
import { Card, Col, Button, Row, Modal, Form, Input, Select } from 'antd'
import { Link } from 'react-router-dom';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import { constRenderTable } from '../tableUtils';



const { Option } = Select;
interface UserManagementProps {
   
}

interface UserManagementState {
  
    showModal: boolean;
    user_character: string;
}

class UserManagement extends React.Component<UserManagementProps, UserManagementState> {
    constructor(props: UserManagementProps) {
        super(props);
        this.state = {
            showModal: false,
            user_character: 'admin',
        };
    }
    userManagementColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            Maxwidth: '15px',
        },
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

    showModal = () => {
        this.setState({
            showModal: true,
        });
    };
    toggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
        }));
    };

    handleFormCharaterFieldChange = (value: string) => {
        this.setState({
            user_character: value,
        });
    };
    handleOk = () => {
        this.setState({
            showModal: false,
        });
        // 这里处理确认操作
    };

    handleCancel = () => {
        this.setState({
            showModal: false,
        });
    };
    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };


    renderModal = () => {
        return (
            <>
                {/* <Button type="primary" onClick={this.showModal}>
              新建 SHA256 任务
            </Button> */}
                <Modal
                    style={{ fontWeight: 'bolder' }}
                    title="新增用户"
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button style={{ backgroundColor: 'white', color: 'black' }} key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button style={{ backgroundColor: '#1664FF', color: 'white' }} key="submit" type="primary" onClick={this.handleOk}>
                            提交任务
                        </Button>,
                    ]}
                >
                    <Form {...this.formItemLayout}
                        name="new_user_info"
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '用户名支持中英文和数字，不少于四个字符' }]}
                        >
                            <Input placeholder="用户名支持中英文和数字，不少于四个字符" />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '密码长度不少于4个字符' }]}
                        >
                            <Input placeholder="密码长度不少于4个字符" />
                        </Form.Item>
                        <Form.Item
                            label="确认密码"
                            name="password"
                            rules={[{ required: true, message: '请再次输入密码' }]}
                        >
                            <Input placeholder="请再次输入密码" />
                        </Form.Item>
                        <Form.Item
                            label="用户角色"
                            name="cycle"
                            rules={[{ required: true, message: '请选择用户角色' }]}
                        >
                            <Select placeholder="用户角色" defaultValue="admin" onChange={this.handleFormCharaterFieldChange}>
                                <Option value="admin">管理员</Option>
                                <Option value="user">普通用户</Option>
                                {/* 更多选项... */}
                            </Select>
                        </Form.Item>

                        {this.state.user_character === 'admin' && (
                            <>
                                <Form.Item label="说明"
                                    name="description">
                                    <p style={{
                                        margin: '0px auto',
                                        display: 'flex',
                                        //justifyContent: 'center', // 水平居中
                                        alignItems: 'center', // 垂直居中
                                    }}> 拥有全部功能的读写权限
                                    </p>
                                </Form.Item>
                                <Form.Item label="用户权限"
                                    name="auth">
                                    <p style={{
                                        margin: '0px auto',
                                        display: 'flex',
                                        //justifyContent: 'center', // 水平居中
                                        alignItems: 'center', // 垂直居中
                                    }}> 读写
                                    </p>
                                </Form.Item>
                            </>)}
                        {this.state.user_character === 'user' && (
                            <>
                                <Form.Item label="说明"
                                    name="description">
                                    <p style={{
                                        margin: '0px auto',
                                        display: 'flex',
                                        //justifyContent: 'center', // 水平居中
                                        alignItems: 'center', // 垂直居中
                                    }}> 拥有全部功能的只读权限
                                    </p>
                                </Form.Item>
                                <Form.Item label="用户权限"
                                    name="auth">
                                    <p style={{
                                        margin: '0px auto',
                                        display: 'flex',
                                        //justifyContent: 'center', // 水平居中
                                        alignItems: 'center', // 垂直居中
                                    }}> 只读
                                    </p>
                                </Form.Item>
                            </>)}
                    </Form>
                </Modal>
            </>
        );
    };


    render() {
        
    return (
        <DataContext.Consumer>
            {(context: DataContextType | undefined) => {
                if (!context) {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <LoadingOutlined style={{ fontSize: '3em' }} />
                        </div>); // 或者其他的加载状态显示
                }
                // 从 context 中解构出 topFiveFimData 和 n
                const { usersOriginData} = context;

                return (
                    <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                        {this.renderModal()}
                        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                            <Col md={24}>
                            {constRenderTable(usersOriginData, '用户列表', [], 
                                          this.userManagementColumns, 'UserManagementlist',"http://localhost:5000/api/users/all",[''],this.showModal,"添加用户")}
                                {/* <div className="gutter-box">
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
                                </div> */}
                            </Col>
        
                        </Row>
                    </div>
                );
            }}
        </DataContext.Consumer>
    )
    }
}

export default UserManagement;
