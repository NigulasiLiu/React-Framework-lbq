import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface';
import { Provenance_Upload_Camflow_Config_API } from '../../service/config';

import './provenance.css';


const App: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: any = {
    name: 'file',
    action: Provenance_Upload_Camflow_Config_API,
    headers: {
      authorization: 'authorization-text',
    },
    multiple: false, // 确保一次只能上传一个文件

    onRemove: (file : any) => {
      setFileList([]);
    },

    beforeUpload: (file : UploadFile) => {
      setFileList([file]);
      // return false; // 不自动上传
    },

    onChange: (info : any) => {
      let newFileList : any = [...info.fileList];
      // 只保留最新上传的文件
      newFileList = newFileList.slice(-1);
      // 如果最新的文件状态是'uploading', 不做操作
      if (info.file.status === 'uploading') {
        setFileList(newFileList);
      }
      // 如果文件上传成功或失败，显示对应的消息
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    fileList,
  };

  return (
    <Upload {...props}>
      <Button className='upload-button'>上传配置文件</Button>
    </Upload>
  );
};

export default App;
