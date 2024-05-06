// ScheduleTask.tsx

import React from 'react';
import { Card, Col, Button, Row, Modal, Form, Input, Badge, message, Tooltip, Menu } from 'antd'
import DataDisplayTable from '../ElkeidTable/DataDisplayTable';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import moment from 'moment';
import axios from 'axios';

export interface ScheduleTaskType {
    key: React.Key;
    uuid: string;
    task_name: string;
    task_type: string;
    create_Time: string;
    status: string;
}
interface ScheduleTaskProps {
 };
interface ScheduleTaskState {
    selectedVulnUuid: string;
    showModal: boolean, // 控制模态框显示
    currentRecord: any, // 当前选中的记录
    operationName: string,
    
}


class ScheduleTask extends React.Component<ScheduleTaskProps, ScheduleTaskState> {
    constructor(props: any) {
        super(props);
        this.state = {
            // ...其他状态字段
            showModal: false, // 控制模态框显示
            currentRecord: null, // 当前选中的记录
            selectedVulnUuid: '', // 添加状态来存储当前选中的漏洞 id
            operationName: "",

        };
    }

    TaskRecordColumns = [
        {
            title: '作业ID',
            dataIndex: 'job_id',
            key: 'job_id',
            render: (text: string, record: any) => (
                <Tooltip title={record.job_id}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                        {record.job_id || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '初次启动时刻',
            dataIndex: 'start_timestamp',
            render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a: any, b: any) => parseFloat(a.start_timestamp) - parseFloat(b.start_timestamp),
        },
        {
            title: '最近更新时刻',
            dataIndex: 'update_timestamp',
            render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a: any, b: any) => parseFloat(a.update_timestamp) - parseFloat(b.update_timestamp),
        },
        {
            title: '执行次数',
            dataIndex: 'excute_times',
            key: 'excute_times',
            render: (text: string) => text || '0',
            sorter: (a: any, b: any) => parseFloat(a.excute_times) - parseFloat(b.excute_times),
        },
        {
            title: '启动耗时',
            dataIndex: 'process_time',
            sorter: (a: any, b: any) => parseFloat(a.process_time) - parseFloat(b.process_time),
        },
        {
            title: "状态",
            dataIndex: 'status',
            onFilter: (value: string | number | boolean, record: any) => record.status.includes(value as string),
            filters: [
                {
                    text: 'running',
                    value: 'running',
                },
                {
                    text: 'waiting',
                    value: 'waiting',
                },
                {
                    text: 'pending',
                    value: 'pending',
                },
            ],
            render: (text: string, record: any) => (
                <Badge
                    status={
                        record.status === 'running' ? 'processing' :
                            record.status === 'pending' ? 'warning' :
                                record.status === 'error' ? 'error' :
                                    record.status === 'waiting' ? 'default' :
                                        'success'
                    }
                    text={record.status}
                />
            ),

        },
        {
            title: '返回值',
            dataIndex: 'retval',
            // render: (text: string) => {
            //     try {
            //         const parsedText = JSON.parse(`"${text}"`);
            //         return parsedText || '-';
            //     } catch (error) {
            //         return text || '-';
            //     }
            // },
            render: (text: string, record: any) => (
                <Tooltip title={record.retval}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', maxWidth: '90px' }}>
                        {record.retval || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "操作",
            dataIndex: 'operation',
            render: (text: string, record: any) => (
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', minWidth: '120px' }}>
                    <Row>
                        <Button
                            onClick={() => this.toggleModal(record, "暂停")}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            disabled={record.status !== "running"}//只有running时，可以暂停
                        >
                            暂停
                        </Button>
                        <Button
                            onClick={() => this.toggleModal(record, "恢复")}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            disabled={record.status !== "pending"}//只有pending时，可以恢复
                        >
                            继续
                        </Button>
                        <Button
                            onClick={() => this.toggleModal(record, "删除")}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                color: '#EA635F', // 设置按钮的颜色
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            //disabled={record.status === "waiting"}
                        >
                            删除
                        </Button>
                    </Row>
                    {/* <Row>
                        <Button
                            onClick={() => this.toggleModal(record)}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                color: '#EA635F', // 设置按钮的颜色
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            disabled={record.status !== "closing"}
                        >
                            删除
                        </Button>
                    </Row> */}
                </div>
            )

        },
    ];

    TaskDetailsColumns = [
        {
            title: '作业ID',
            dataIndex: 'job_id',
            key: 'job_id',
            render: (text: string, record: any) => (
                <Tooltip title={record.job_id}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', maxWidth: '100px' }}>
                        {record.job_id || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '调用目标',
            dataIndex: 'job_class',
            key: 'job_class',
            render: (text: string, record: any) => (
                <Tooltip title={record.job_class}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                        {record.job_class || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '表达式',
            dataIndex: 'expression',
            key: 'expression',
            render: (text: string, record: any) => (
                <Tooltip title={record.expression}>
                    <div style={{ 
                        whiteSpace: 'nowrap', overflow: 'hidden', 
                    textOverflow: 'ellipsis', maxWidth: '100px',
                    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    // padding: '10px',
                    // borderRadius: '5px',
                    // boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    // textAlign: 'center', 
                    }}>
                        {record.expression || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '执行策略',
            dataIndex: 'exec_strategy',
            key: 'exec_strategy',
            onFilter: (value: string | number | boolean, record: any) => record.exec_strategy.includes(value as string),
            filters: [
                {
                    text: 'interval',
                    value: 'interval',
                },
                {
                    text: 'cron',
                    value: 'cron',
                },
                {
                    text: 'date',
                    value: 'date',
                },
            ],
            render: (text: string) => text || '-',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a: any, b: any) => parseFloat(a.create_time) - parseFloat(b.create_time),
        },
        {
            title: '开始时间',
            dataIndex: 'start_time',
            render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a: any, b: any) => parseFloat(a.create_time) - parseFloat(b.create_time),
        },
        {
            title: '结束时间',
            dataIndex: 'end_time',
            render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a: any, b: any) => parseFloat(a.update_time) - parseFloat(b.update_time),
        },
        {
            title: "操作",
            dataIndex: 'operation',
            render: (text: string, record: any) => (
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', minWidth: '120px' }}>
                    <Row>
                        <Button
                            onClick={() => this.toggleModal(record, "暂停")}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            disabled={record.status !== "running"}//只有running时，可以暂停
                        >
                            暂停
                        </Button>
                        <Button
                            onClick={() => this.toggleModal(record, "恢复")}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            disabled={record.status !== "pending"}//只有pending时，可以恢复
                        >
                            继续
                        </Button>
                        <Button
                            onClick={() => this.toggleModal(record, "删除")}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                color: '#EA635F', // 设置按钮的颜色
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            //disabled={record.status === "waiting"}
                        >
                            删除
                        </Button>
                    </Row>
                    {/* <Row>
                        <Button
                            onClick={() => this.toggleModal(record)}
                            style={{
                                fontWeight: 'bold',
                                padding: '3px 4px', // 设置按钮的内边距
                                border: 'transparent',
                                backgroundColor: 'transparent',
                                color: '#EA635F', // 设置按钮的颜色
                                fontSize: '12px', // 设置字体大小为 12 像素
                            }}
                            disabled={record.status !== "closing"}
                        >
                            删除
                        </Button>
                    </Row> */}
                </div>
            )

        },
    ];


    toggleModal = (record = null, op = "default") => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            operationName: op,
            currentRecord: record // 设置当前记录，以便后续操作
        }));
    }
    handleRefresh = (api:string) => {
        // 这个方法将被用于调用context中的refreshDataFromAPI
        this.context.refreshDataFromAPI();
      };

    handleDelete = (job_id: string) => {
        axios.delete(`http://localhost:5000/api/delete_task?job_id=${job_id}`)
            .then(response => {
                message.success('任务删除成功');
                // 这里可以根据需要刷新页面或者重新加载数据
                this.handleRefresh("http://localhost:5000/api/taskdetail/all")
            })
            .catch(error => {
                message.error('任务删除失败');
                console.error('删除任务时出错：', error);
            });
    };
    handlePause = (job_id: string) => {
        axios.post(`http://localhost:5000/api/pause_task?job_id=${job_id}`)
            .then(response => {
                message.success('任务暂停成功');
                // 这里可以根据需要刷新页面或者重新加载数据
                this.handleRefresh("http://localhost:5000/api/taskdetail/all")
            })
            .catch(error => {
                message.error('任务暂停失败');
                console.error('暂停任务时出错：', error);
            });
    };
    handleResume = (job_id: string) => {
        axios.post(`http://localhost:5000/api/resume_task?job_id=${job_id}`)
            .then(response => {
                message.success('任务恢复成功');
                // 这里可以根据需要刷新页面或者重新加载数据
                this.handleRefresh("http://localhost:5000/api/taskdetail/all")
            })
            .catch(error => {
                message.error('任务恢复失败');
                console.error('恢复任务时出错：', error);
            });
    };
    handleOk = async () => {
        // 处理忽略操作
        const record = this.state.currentRecord;
        if (record) {
            if (this.state.operationName === "删除") {
                this.handleDelete(record.job_id);
            }
            else if (this.state.operationName === "暂停") {
                this.handlePause(record.job_id);
            }
            else {
                this.handleResume(record.job_id);
            }
            //await this.handleIgnoreButtonClick(record);
        }
        this.toggleModal(); // 关闭模态框
    }

    handleCancel = () => {
        this.toggleModal(); // 关闭模态框
    }
    renderModal = () => {
        return (
            <>
                <Modal
                    title="确认操作"
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" style={{ backgroundColor: '#1664FF', color: 'white' }} onClick={this.handleOk}>
                            是
                        </Button>,
                    ]}
                //style={{ top: '50%', transform: 'translateY(-50%)' }} // 添加这行代码尝试居中
                >
                    确认{this.state.operationName}该定时任务？
                </Modal>
            </>
        );
    };


    renderTable = (OriginData: any[], title: string, timeColumnIndex: string[], column: any[], currentPanel: string) => {
        if (OriginData !== undefined) {
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            return (
                <div style={{ fontWeight: 'bolder', width: '100%', }}>
                    <Card bordered={true}
                        style={{ backgroundColor: '#ffffff' }}>
                        <Row>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
                            </div>
                        </Row>
                        <DataDisplayTable
                            externalDataSource={originDataArray}
                            apiEndpoint="http://localhost:5000/api/taskdetail/all"
                            timeColumnIndex={[]}
                            columns={column}
                            currentPanel={currentPanel}
                        />
                    </Card>
                </div>
            );
            // if (originDataArray.length > 0) {
            //     // if (!originDataArray[0].job_id) {
            //     //     return (
            //     //     <Card bordered={true}
            //     //         style={{display: 'flex', justifyContent: 'center', alignItems: 'center',backgroundColor: '#ffffff', width: '100%' }}>
            //     //         <LoadingOutlined style={{ fontSize: '3em' }} />
            //     //     </Card>
            //     //     )
            //     // }
            //     //message.info("job_id:"+originDataArray[0].job_id)
            //     return (
            //     <div style={{fontWeight: 'bolder', width: '100%',}}>
            //         <Card bordered={true}
            //             style={{backgroundColor: '#ffffff' }}>
            //             <Row>
            //                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
            //                     <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
            //                 </div>
            //             </Row>
            //             <DataDisplayTable
            //                 externalDataSource={originDataArray}
            //                 timeColumnIndex={[]}
            //                 columns={column}
            //                 currentPanel={currentPanel}
            //             />
            //         </Card>
            //     </div>
            //     );
            // }
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                <Card bordered={true}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', width: '100%' }}>
                    <LoadingOutlined style={{ fontSize: '3em' }} />
                </Card>
            </div>
        );
    }

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
                    const { taskDetailsOriginData,refreshDataFromAPI } = context;
                    // 将函数绑定到类组件的实例上
                    this.handleRefresh = refreshDataFromAPI;
                    return (
                        <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                            {this.renderModal()}
                            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                <Col md={24}>
                                    {this.renderTable(taskDetailsOriginData, '任务详情', ['create_time', 'start_time', 'end_time',], this.TaskDetailsColumns, 'TaskDetail')}
                                    {this.renderTable(taskDetailsOriginData, '任务监听', ['update_timestamp', 'create_timestamp'], this.TaskRecordColumns, 'TaskRecord')}
                                </Col>

                            </Row>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        )
    }
}

export default ScheduleTask;
