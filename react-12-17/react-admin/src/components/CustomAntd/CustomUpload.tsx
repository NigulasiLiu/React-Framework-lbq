import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';

const { Dragger } = Upload;

interface CustomUploadProps {
    onUploadSuccess: (fileName: string, fileContent: string) => void; // 上传成功时的回调函数
    onUploadError: (fileName: string) => void; // 上传失败时的回调函数
}

const CustomUpload: React.FC<CustomUploadProps> = ({ onUploadSuccess, onUploadError }) => {
    const uploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info:any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} 文件上传成功。`);
                const reader = new FileReader();
                reader.onload = (event) => {
                    const fileContent = event.target?.result as string;
                    onUploadSuccess(info.file.name, fileContent);
                };
                reader.readAsText(info.file.originFileObj);
            } else if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败。`);
                onUploadError(info.file.name);
            }
        },
        onDrop(e: React.DragEvent<HTMLDivElement>) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...uploadProps}>
            <p >
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
            <p className="ant-upload-hint">
                仅支持单个上传。
            </p>
        </Dragger>
    );
};

export default CustomUpload;
