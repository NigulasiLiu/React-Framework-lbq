import React from 'react';
import { Row, Col, Card, Table, Button, Typography, message, Tooltip } from 'antd';
import { hostinventoryColumnsType, VirusTaskDetail } from '../Columns';
import { Link } from 'react-router-dom';

const { Text } = Typography;

interface VirusScanTableSidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    sidebarWidth?: number;
}

interface VirusScanTableSidebarState {
    isSidebarOpen: boolean;
    taskDetails: VirusTaskDetail[];
}

class VirusScanTableSidebar extends React.Component<VirusScanTableSidebarProps, VirusScanTableSidebarState> {
    constructor(props: VirusScanTableSidebarProps) {
        super(props);
        const taskDetails = JSON.parse(localStorage.getItem('virusTaskDetail') || '[]');
        this.state = {
            isSidebarOpen: false,
            taskDetails: taskDetails,
        };
    }
    componentDidMount() {
        const storedData = localStorage.getItem('virusTaskDetail');
        if (storedData) {
            // message.info(`localStorage data: ${storedData}`);
        } else {
            message.info('没有扫描记录。');
        }
    }

    handleDelete = (id: number) => {
        const updatedTaskDetails = this.state.taskDetails.filter(task => task.id !== id);
        this.setState({ taskDetails: updatedTaskDetails }, () => {
            localStorage.setItem('virusTaskDetail', JSON.stringify(updatedTaskDetails));
            message.success(`任务 ID ${id} 已删除`);
        });
    };

    render() {
        const { isSidebarOpen } = this.props;
        const { taskDetails } = this.state;
        const sidebartablewidth = this.props.sidebarWidth ? this.props.sidebarWidth : 490;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '目标主机 UUID',
                dataIndex: 'uuid',
                key: 'uuid',
            },
            {
                title: '扫描类型',
                dataIndex: 'scanType',
                key: 'scanType',
            },
            {
                title: '创建状态',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                key: 'createdTime',
            },
            {
                title: '操作',
                key: 'action',
                render: (text: any, record: VirusTaskDetail) => (
                    <Button
                        style={{
                            fontWeight: 'bold',
                            border: 'transparent',
                            backgroundColor: 'transparent',
                            color: '#4086FF',
                            padding: '0 0',
                        }} onClick={() => this.handleDelete(record.id)}>
                        删除记录
                    </Button>
                ),
            },
        ];

        return (
            <div className={isSidebarOpen ? "Largersidebar open" : "Largersidebar"}>
                <Col md={24} style={{ borderTop: '5px solid #4086FF' }}>
                        <Card style={{ width: '100%', minHeight:'700px',border:'2px solid #becffa', }}>
                            <Row style={{ borderTop: '0px solid #E5E8EF' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, marginBottom: 10, fontWeight: 'bold' }}>
                                    <h2 style={{ fontSize: '19px', fontWeight: 'bold', marginLeft: '0px' }}>全部扫描任务</h2>
                                </div>
                                <div style={{ maxWidth: sidebartablewidth, width: '100%', margin: '0 auto' }}>
                                    <Table
                                        className={"customTable"}
                                        dataSource={taskDetails}
                                        columns={columns}
                                        rowKey="uuid"
                                        pagination={{ pageSize: 10 }}  // 添加分页配置，每页10条记录
                                    />
                                </div>
                            </Row>
                        </Card>
                </Col>
            </div>
        );
    }
}

export default VirusScanTableSidebar;
