import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';
import umbrella from 'umbrella-storage';
import { Button, Upload, Modal } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';

interface FileUploadProps {
    uploadUrl: string;
    visible: boolean;
    onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadUrl, visible, onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [uploadKey, setUploadKey] = useState<number>(Date.now()); // 用于重置Upload组件

    const handleFileChange = (info: any) => {
        if (selectedFile) {
            setError('最多上传一个文件');
        } else {
            setError(null);
            if (info.fileList && info.fileList.length > 0) {
                setSelectedFile(info.fileList[0].originFileObj);
            }
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('没有选择文件');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const token = umbrella.getLocalStorage('jwt_token');
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            if (response.data.status === 200) {
                setUploadStatus('文件上传成功');
            } else {
                setUploadStatus(`上传失败: ${response.data.message}`);
            }
        } catch (error) {
            setUploadStatus(`上传失败: ${error.message}`);
        }
    };


    const handleFileRemove = () => {
        setSelectedFile(null);
        setUploadStatus('');
        setError(null);
        setUploadKey(Date.now()); // 重置Upload组件
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
                {selectedFile && (
                    <div className="file-info">
                        <span>{selectedFile.name}</span>
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
                            onClick={handleFileRemove}
                        >
                            移除
                        </Button>
                    </div>
                )}
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
                        onClick={handleFileUpload}
                    >
                        上传并扫描
                    </Button>
                </div>
                <p className="upload-status">{uploadStatus}</p>
            </div>
        </Modal>
    );
};

export default FileUpload;
