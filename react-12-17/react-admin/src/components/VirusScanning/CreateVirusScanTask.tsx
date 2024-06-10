import React, { useState } from 'react';
import { Steps, Form, Input, InputNumber, Button, Row, Alert, Radio, Card, message, Col, DatePicker } from 'antd';
import FetchDataForElkeidTable from '../OWLTable/FetchDataForElkeidTable';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createNewTaskColumns, VirusTaskDetail } from '../Columns';
import { LeftOutlined } from '@ant-design/icons';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Agent_Data_API, APP_Server_URL } from '../../service/config';
import moment from 'moment/moment';
import axios from 'axios';

const { Step } = Steps;
const { TextArea } = Input;


interface CreateVirusScanTaskProps extends RouteComponentProps {
}

interface CreateVirusScanTaskState {
    currentStep: number,
    selectedTaskType: string, // 默认选中的任务类型
    selectedUuids: React.Key[];
}

class CreateVirusScanTask extends React.Component<CreateVirusScanTaskProps, CreateVirusScanTaskState> {
    constructor(props: CreateVirusScanTaskProps) {
        super(props);
        this.state = {
            currentStep: 0,
            selectedTaskType: 'folderscan', // 默认选中的任务类型
            selectedUuids: [],
        };
    }


    handleSubmit = async (values: any) => {
        const { selectedTaskType, selectedUuids } = this.state;
        let taskType:any;
        const sendPostRequest = async (uuid: string, id: number, createdTime: string) => {
            let apiUrl = '';
            if (selectedTaskType === 'fullscan') {
                taskType = '全盘扫描';
                apiUrl = `/api/virusscan/full?uuid=${uuid}`;
            } else if (selectedTaskType === 'quickscan') {
                taskType = '快速扫描';
                apiUrl = `/api/virusscan/quick?uuid=${uuid}`;
            } else if (selectedTaskType === 'folderscan') {
                taskType = '目录扫描';
                const { abspath } = values;
                apiUrl = `/api/virusscan/path?uuid=${uuid}&path=${encodeURIComponent(abspath)}`;
            }

            try {
                const response = await axios.post(apiUrl);
                const taskDetail = {
                    id,
                    uuid,
                    scanType: taskType,
                    status: response.status === 200 ? '创建成功' : '创建失败',
                    createdTime,
                };
                // 存储到 localStorage
                const existingTasks = JSON.parse(localStorage.getItem('virusTaskDetail') || '[]');
                existingTasks.push(taskDetail);
                localStorage.setItem('virusTaskDetail', JSON.stringify(existingTasks));
                if (response.status === 200) {
                    message.success(`任务 ${uuid} 创建成功`);
                } else {
                    message.error(`任务 ${uuid} 创建失败`);
                }
            } catch (error) {
                console.error(`Error creating task for ${uuid}:`, error);
                const taskDetail = {
                    id,
                    uuid,
                    scanType: taskType,
                    status: '创建失败',
                    createdTime,
                };
                // 存储到 localStorage
                const existingTasks = JSON.parse(localStorage.getItem('virusTaskDetail') || '[]');
                existingTasks.push(taskDetail);
                localStorage.setItem('virusTaskDetail', JSON.stringify(existingTasks));
                message.error(`任务 ${uuid} 创建失败`);
            }
        };

        // 获取当前任务列表长度，生成新的ID
        const existingTasks = JSON.parse(localStorage.getItem('virusTaskDetail') || '[]');
        let nextId = existingTasks.length > 0 ? Math.max(...existingTasks.map((task: VirusTaskDetail) => task.id)) + 1 : 1;

        const createdTime = new Date().toLocaleString();
        // 逐个发送请求并插入正确的id
        for (const uuid of selectedUuids) {
            await sendPostRequest(uuid.toString(), nextId, createdTime);
            nextId++; // 确保id自增
        }
    };

    goBack = () => {
        this.props.history.goBack();
    };

    handleSelectedRowKeysChange = (selectedUuids: React.Key[]) => {
        this.setState({
            selectedUuids,
        });
        // message.info("选中了：" + selectedUuids)
    };
    getStepStatus = (stepIndex: number) => {
        const { currentStep } = this.state;
        if (stepIndex < currentStep) {
            return 'finish';
        } else if (stepIndex === currentStep) {
            return 'process';
        } else {
            return 'wait';
        }
    };


    render() {
        const { currentStep } = this.state;
        const renderCommonFormItems = (taskType: string) => (
            <>
                {taskType === 'fullscan' && (
                    <Form.Item>
                        <Alert
                            message="全盘扫描端上资源占用较高，且时间较长"
                            type="warning"
                            showIcon
                        />
                    </Form.Item>
                )}
                <Form.Item
                    label="资源占用上限/%"
                    name="cpuUsage"
                    rules={[{ required: true, message: '请输入CPU占用的上限' }]}
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value ? value.replace('%', '') : ''}
                        defaultValue={30}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="任务超时时长/h"
                    name="timeout"
                    rules={[{ required: true, message: '请输入任务超时时长' }]}
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        formatter={value => `${value}h`}
                        parser={value => value ? value.replace('h', '') : ''}
                        defaultValue={48}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </>
        );

        return (
            <div style={{ width: '100%', margin: '0 auto' }}>
                <Row style={{
                    width: '110%', height: '80px', backgroundColor: '#FFFFFF', //height:'40px',
                    marginLeft: '-20px', padding: '12px', borderBottom: '1px solid #F6F7FB',
                }}>
                    <div style={{ margin: 'auto 10px' }}>
                        <Button
                            type="link"
                            style={{
                                width: '40px', height: '40px', fontWeight: 'bold', border: 'transparent',
                                backgroundColor: '#F6F7FB', color: '#88878C',
                            }}
                            icon={<LeftOutlined />}
                            onClick={() => {
                                window.close();
                            }}
                        />
                        <span style={{ fontSize: '20px', marginLeft: '20px' }}>
              新建任务
            </span>
                    </div>
                </Row>
                <Row style={{ width: '30%', height: '40px', margin: '5px auto' }}>
                    <Steps>
                        <Step title="选择主机" status={this.getStepStatus(0)}
                              icon={currentStep > 0 ? <SmileOutlined /> : <UserOutlined />} />
                        <Step title="设置任务信息" status={this.getStepStatus(1)}
                              icon={currentStep > 1 ? <SmileOutlined /> : <SolutionOutlined />} />
                    </Steps>
                </Row>
                <Row style={{}}>
                    {currentStep === 0 && (
                        <Card bordered={false} style={{ width: '90%', margin: '0px auto' }}>
                            <Row style={{ margin: '0px auto', width: '100%' }}>
                                <FetchDataForElkeidTable
                                    key={'createnewvirusscantask'}
                                    apiEndpoint={Agent_Data_API}
                                    timeColumnIndex={[]}
                                    columns={createNewTaskColumns}
                                    currentPanel={'createnewvirusscantask'} // 替换为你的 panel 名称
                                    keyIndex={1}
                                    search={[]}
                                    onSelectedRowKeysChange={this.handleSelectedRowKeysChange}
                                />
                            </Row>
                            <Row style={{
                                width: '100%', margin: '20px auto',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                            }}>
                                <Button
                                    style={{ backgroundColor: 'white', color: 'black', marginRight: '20px' }}
                                    onClick={this.goBack} // 或者其他取消操作的逻辑
                                >
                                    取消
                                </Button>
                                <Button
                                    disabled={this.state.selectedUuids.length === 0}
                                    style={{ backgroundColor: '#1664FF', color: 'white' }}
                                    onClick={() => this.setState({ currentStep: currentStep + 1 })}
                                >
                                    下一步
                                </Button>
                            </Row>
                        </Card>
                    )}
                    {currentStep === 1 && (
                        <Row style={{ width: '100%', margin: '0px auto' }}>
                            <Card style={{ width: '90%', margin: '0px auto' }}>
                                <Row style={{ width: '100%', margin: '0px auto' }}>
                                    <Form
                                        layout="vertical"
                                        style={{ width: '70%', margin: '0px auto' }}
                                        onFinish={this.handleSubmit}
                                        initialValues={{}}
                                    >
                                        <Row>
                                            <Row style={{
                                                width: '100%',
                                                paddingBottom: '0px',
                                                border: 'solid 0px #E5E8EF',
                                            }}>
                                                <Form.Item
                                                    label={<span style={{ fontSize: '18px' }}>将要扫描病毒的主机</span>}
                                                    name="description">
                                                    <p style={{
                                                        margin: '0px auto', fontSize: '18px',
                                                        display: 'flex',
                                                        //justifyContent: 'center', // 水平居中
                                                        alignItems: 'center', // 垂直居中
                                                    }}>{this.state.selectedUuids.join(', ')}</p>
                                                </Form.Item>
                                            </Row>
                                        </Row>
                                        <Row style={{ width: '100%' }}>
                                            <Form.Item label="任务类型" name="type" rules={[{ required: false }]}>
                                                <Radio.Group defaultValue="folderscan">
                                                    <Radio.Button value="folderscan"
                                                                  onClick={() => this.setState({ selectedTaskType: 'folderscan' })}>端上目录/文件扫描</Radio.Button>
                                                    <Radio.Button value="fullscan"
                                                                  onClick={() => this.setState({ selectedTaskType: 'fullscan' })}>全盘扫描</Radio.Button>
                                                    <Radio.Button value="quickscan"
                                                                  onClick={() => this.setState({ selectedTaskType: 'quickscan' })}>快速扫描</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Row>
                                            {this.state.selectedTaskType === 'folderscan' && (<>
                                                <Form.Item
                                                    label="绝对路径"
                                                    name="abspath"
                                                    rules={[{ required: true, message: '请输入绝对路径' }]}>
                                                    <Input placeholder="请输入绝对路径" />
                                                </Form.Item>
                                            </>)}
                                        {this.state.selectedTaskType === 'fullscan' && renderCommonFormItems(this.state.selectedTaskType)}
                                        {this.state.selectedTaskType === 'quickscan' && renderCommonFormItems(this.state.selectedTaskType)}

                                        <Row style={{
                                            width: '100%', margin: '20px auto',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Button
                                                style={{ backgroundColor: 'white', color: 'black', marginRight: '20px' }}
                                                onClick={() => this.setState({ currentStep: currentStep - 1 })}
                                            >
                                                上一步
                                            </Button>
                                            <Button
                                                style={{ backgroundColor: '#1664FF', color: 'white' }}
                                                htmlType="submit"
                                            >
                                                确定
                                            </Button>
                                        </Row>
                                    </Form>
                                </Row>
                            </Card>
                        </Row>
                    )}
                </Row>
            </div>
        );
    }
}

export default withRouter(CreateVirusScanTask);
