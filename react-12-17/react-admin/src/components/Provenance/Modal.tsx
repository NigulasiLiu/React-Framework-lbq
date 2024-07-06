import { Button, Modal, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './provenance.css';
import { Provenance_Get_Log_Str_API } from '../../service/config';
import { buttonStyle } from './ProvenanceMain';

const App: React.FC<{ buttonText: string }> = ({ buttonText }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [tableData1, setTableData1] = useState([]);
    const [columns1, setColumns1] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [columns2, setColumns2] = useState([]);

    useEffect(() => {
        if (isModalOpen) {
            if (buttonText === '查看日志') {
                fetchLogData();
            } else if (buttonText === '使用帮助') {
                setHelpContent();
            }
        }
    }, [isModalOpen, buttonText]);

    const fetchLogData = async () => {
        try {
            const response = await axios.get(Provenance_Get_Log_Str_API);
            const vertexLog = response.data['vertex_log'];
            const edgeLog = response.data['edge_log'];

            const [vertexHeaderLine, ...vertexLines] = vertexLog.split('\n');
            const vertexHeaders = vertexHeaderLine.split(',');

            const vertexColumns = vertexHeaders.map((header: any) => ({
                title: header,
                dataIndex: header,
                key: header,
            }));

            const vertexDataSource = vertexLines.map((line: any, index: any) => {
                const values = line.split(',');
                const dataItem: any = {};
                vertexHeaders.forEach((header: any, i: any) => {
                    dataItem[header] = values[i];
                });
                dataItem['key'] = index;
                return dataItem;
            });

            const [edgeHeaderLine, ...edgeLines] = edgeLog.split('\n');
            const edgeHeaders = edgeHeaderLine.split(',');

            const edgeColumns = edgeHeaders.map((header: any) => ({
                title: header,
                dataIndex: header,
                key: header,
            }));

            const edgeDataSource = edgeLines.map((line: any, index: any) => {
                const values = line.split(',');
                const dataItem: any = {};
                edgeHeaders.forEach((header: any, i: any) => {
                    dataItem[header] = values[i];
                });
                dataItem['key'] = index;
                return dataItem;
            });

            setColumns1(vertexColumns);
            setTableData1(vertexDataSource);
            setColumns2(edgeColumns);
            setTableData2(edgeDataSource);
        } catch (error) {
            console.error('Error fetching log data:', error);
        }
    };

    const setHelpContent = () => {
        const help_info =
            '攻击溯源功能基于剑桥大学的CamFlow开源溯源图工具。\n' +
            'CamFlow是高度可配置的Linux安全模块，用于捕获溯源信息以进行审计。\n' +
            '配置细节请参考： https://camflow.org/ \n' +
            '数据模型请参考： https://www.w3.org/TR/prov-primer/ \n' +
            '\n本项目提供以下功能：\n' +
            '- 选择监控的主机 \n' +
            '- 按时间范围检索生成溯源图 \n' +
            '- 修改主机端CamFlow工具的过滤选项 \n' +
            '- 添加/移除需要跟踪的元素 \n' +
            '- 查看原始日志文本 \n' +
            '- 直接上传CamFlow的配置文件 \n' +
            '- 查看CamFlow判定告警的日志 \n';

        const formatted_help_info = help_info.replace(/\n/g, '<br>');
        setModalContent(formatted_help_info);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const exportToCSV = (data: any[], columns: any[], filename: string) => {
        const csvHeader = columns.map(col => col.title).join(',');
        const csvRows = data.map(row => columns.map(col => row[col.dataIndex]).join(','));
        const csvContent = [csvHeader, ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (//className="custom-modal"
        <>
            <Button onClick={() => setIsModalOpen(true)} className="upload-button"
                    {...buttonStyle}
            >
                {buttonText}
            </Button>
            <Modal title={buttonText} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1800}>
                {buttonText === '使用帮助' ? (
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                ) : (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>CamFlow捕获到的节点数据</h2>
                            <Button onClick={() => exportToCSV(tableData1, columns1, 'vertex_log.csv')}
                                    style={{ marginBottom: 16 }}>
                                导出为CSV
                            </Button>
                            <Table
                                dataSource={tableData1}
                                columns={columns1}
                                pagination={false}
                                scroll={{ x: 'max-content' }}
                            />
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>CamFlow捕获到的边数据</h2>
                            <Button onClick={() => exportToCSV(tableData2, columns2, 'edge_log.csv')}
                                    style={{ marginBottom: 16 }}>
                                导出为CSV
                            </Button>
                            <Table
                                dataSource={tableData2}
                                columns={columns2}
                                pagination={false}
                                scroll={{ x: 'max-content' }}
                            />
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default App;
