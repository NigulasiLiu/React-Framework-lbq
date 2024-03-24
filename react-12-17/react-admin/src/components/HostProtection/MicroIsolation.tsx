import React, { useState } from 'react';
import { Button, Upload, message, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const MicroIsolation: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [encrypting, setEncrypting] = useState(false);
  const [decrypting, setDecrypting] = useState(false);

  const handleEncrypt = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }
    setEncrypting(true);
    // 假设这是后端提供的加密API
    try {
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file.originFileObj);
      });
      await axios.post('/api/encrypt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('文件加密成功');
    } catch (error) {
      message.error('文件加密失败');
    } finally {
      setEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }
    setDecrypting(true);
    // 假设这是后端提供的解密API
    try {
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file.originFileObj);
      });
      await axios.post('/api/decrypt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('文件解密成功');
    } catch (error) {
      message.error('文件解密失败');
    } finally {
      setDecrypting(false);
    }
  };

  const beforeUpload = (file: any) => {
    setFileList([file]);
    return false; // 不自动上传
  };

  return (
    <div>
    <Row gutter={[8,8]}>
      <Upload beforeUpload={beforeUpload} fileList={fileList} onRemove={() => setFileList([])}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
      <Button type="primary" onClick={handleEncrypt} loading={encrypting} style={{ margin: '0 8px' }}>
        加密
      </Button>
      <Button onClick={handleDecrypt} loading={decrypting}>
        解密
      </Button>
        </Row>
    </div>
  );
};

export default MicroIsolation;
