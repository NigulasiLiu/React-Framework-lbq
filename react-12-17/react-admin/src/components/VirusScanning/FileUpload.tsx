import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';
import { Button, Upload, Modal, message, List, Col, Row } from 'antd';
import { UploadOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

interface FileUploadProps {
    uploadUrl: string;
    scanUrl: string;
    visible: boolean;
    onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadUrl, scanUrl, visible, onClose }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploadKey, setUploadKey] = useState<number>(Date.now()); // 用于重置Upload组件
    const [scanRecords, setScanRecords] = useState<string[]>([]);

    const handleFileChange = (info: any) => {
        setError(null);
        const newFiles = info.fileList.map((file: any) => file.originFileObj);
        setSelectedFiles(newFiles);
    };

    const handleFileUploadAndScan = async () => {
        if (selectedFiles.length === 0) {
            message.error('没有选择文件');
            return;
        }

        const uploadResults: string[] = [];
        const uploadPromises = selectedFiles.map(async file => {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('jwt_token');
            try {
                const response = await axios.post(uploadUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                });
                if (response.data.status === 200) {
                    uploadResults.push(`${file.name} 上传成功`);
                } else {
                    uploadResults.push(`${file.name} 上传失败: ${response.data.message}`);
                }
            } catch (error) {
                uploadResults.push(`${file.name} 上传失败: ${error.message}`);
            }
        });

        await Promise.all(uploadPromises);
        setUploadStatus(uploadResults);

        const allSuccess = uploadResults.every(result => result.includes('上传成功'));
        if (allSuccess) {
            message.success('所有文件上传成功');
            try {
                const token = localStorage.getItem('jwt_token');
                const scanResponse = await axios.post(scanUrl, { files: selectedFiles.map(file => file.name) }, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                });

                if (scanResponse.data.status === 200) {
                    message.success('扫描成功');
                    setScanRecords(selectedFiles.map(file => `${file.name} 上传并扫描成功`));
                } else {
                    message.error(`扫描失败: ${scanResponse.data.message}`);
                    setScanRecords([...scanRecords, `扫描失败: ${scanResponse.data.message}`]);
                }
            } catch (error) {
                message.error(`扫描失败: ${error.message}`);
                setScanRecords([...scanRecords, `扫描失败: ${error.message}`]);
            }
        } else {
            message.error('有文件上传失败');
        }
    };

    const handleFileRemove = (fileToRemove: File) => {
        setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
        setUploadStatus([]);
        setError(null);
        setUploadKey(Date.now()); // 重置Upload组件
    };

    const handleRemoveStatus = (index: number) => {
        setUploadStatus(uploadStatus.filter((_, i) => i !== index));
    };

    const handleRemoveRecord = (index: number) => {
        setScanRecords(scanRecords.filter((_, i) => i !== index));
    };

    return (
            <Modal
                title="扫描上传文件"
                visible={visible}
                onCancel={onClose}
                footer={null}
                closeIcon={<CloseOutlined />}
                centered
            >
                <div className="file-upload-container">
                    <Upload
                        key={uploadKey} // 强制重新渲染Upload组件
                        multiple // 允许上传多个文件
                        beforeUpload={() => false} // 关闭自动上传
                        onChange={handleFileChange}
                        showUploadList={false}
                    >
                        <Button
                            icon={<UploadOutlined />}
                            style={{
                                marginRight: '10px',
                            }}
                        >
                            选择文件
                        </Button>
                    </Upload>
                    {selectedFiles.map((file) => (
                        <div className="file-info" key={file.name}>
                            <span>{file.name}</span>
                            <Button
                                type="primary"
                                danger
                                style={{
                                    marginRight: '10px',
                                    backgroundColor: '#fb1440',
                                    color: 'white',
                                    transition: 'opacity 0.3s',
                                    opacity: 1,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = 0.7;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = 1;
                                }}
                                onClick={() => handleFileRemove(file)}
                            >
                                移除
                            </Button>
                        </div>
                    ))}
                    {error && <p className="error-message">{error}</p>}
                    <div className="buttons-container">
                        <Button
                            style={{
                                backgroundColor: '#1664FF',
                                color: 'white',
                                marginRight: '10px',
                                marginTop: '10px',
                                transition: 'opacity 0.3s',
                                opacity: 1,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = 0.7;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = 1;
                            }}
                            onClick={handleFileUploadAndScan}
                        >
                            上传并扫描
                        </Button>
                    </div>
                    <Row>
                        <Col span={12}>
                            <List
                                header={<div>上传状态</div>}
                                bordered
                                dataSource={uploadStatus}
                                renderItem={(status, index) => (
                                    <List.Item
                                        style={{ fontSize: '14px', color: status.includes('失败') ? 'red' : 'inherit' }}
                                        actions={[
                                            <Button
                                                type="link"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveStatus(index)}
                                            >
                                                删除
                                            </Button>,
                                        ]}
                                    >
                                        <span style={{ fontSize: '13px' }}>{status}</span>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <List
                                header={<div>扫描记录</div>}
                                bordered
                                dataSource={scanRecords}
                                renderItem={(item, index) => (
                                    <List.Item
                                        style={{ color: item.includes('失败') ? 'red' : 'inherit' }}
                                        actions={[
                                            <Button
                                                type="link"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveRecord(index)}
                                            >
                                                删除
                                            </Button>,
                                        ]}
                                    >
                                        <span style={{fontSize:'13px',}}>{item}</span>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
    );
};

export default FileUpload;
