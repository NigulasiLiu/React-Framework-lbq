import React from 'react';
import { Card, Col, Row, Form, Input, Button, message,Modal,Table,Descriptions } from 'antd';
import axios from 'axios';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';


interface MicroIsolationProps{

};

interface MicroIsolationStates{
  spFilesColumns:any[]
  columns:any[];
  encryptModalVisible: boolean,
  decryptModalVisible: boolean,
  currentRecord: any; // 存储当前选中的行数据
};


// 在MicroIsolation组件内部，可能在constructor或直接在state定义中
const initialData = [
  {
    key: '1',
    id: 1,
    agent_ip: '192.168.1.1',
    encrypt_key: 'some_key_1',
    origin_filename: 'report1.docx',
    origin_file_path: '/path/to/report1.docx',
    encrypted_filename: 'report1_encrypted.docx',
    encrypted_file_path: '/path/to/encrypted/report1.docx',
  },
  {
    key: '2',
    id: 2,
    agent_ip: '192.168.1.2',
    encrypt_key: 'some_key_2',
    origin_filename: 'report2.docx',
    origin_file_path: '/path/to/report2.docx',
    encrypted_filename: 'report2_encrypted.docx',
    encrypted_file_path: '/path/to/encrypted/report2.docx',
  },
  // 更多数据...
];

class MicroIsolation extends React.Component<MicroIsolationProps,MicroIsolationStates> {
  constructor(props:any) {
    super(props);
    this.state = {
      spFilesColumns:[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '原文件文件名',
          dataIndex: 'origin_filename',
          key: 'origin_filename',
        },
        {
          title: '原文件文件路径',
          dataIndex: 'origin_file_path',
          key: 'origin_file_path',
        },
        {
          title: '操作',
          key: 'operation',
          render: (text:string, record:any) => (
            <Button onClick={() => this.showDecryptModal(record)}>隔离</Button>
          ),
        }
        
      ],
    decryptModalVisible: false,
    encryptModalVisible: false,
    currentRecord: {}, // 存储当前选中的行数据
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '加密密钥',
          dataIndex: 'encrypt_key',
          key: 'encrypt_key',
        },
        {
          title: '原文件文件名',
          dataIndex: 'origin_filename',
          key: 'origin_filename',
        },
        {
          title: '原文件文件路径',
          dataIndex: 'origin_file_path',
          key: 'origin_file_path',
        },
        {
          title: '加密文件的文件名',
          dataIndex: 'encrypted_filename',
          key: 'encrypted_filename',
        },
        {
          title: '加密文件的文件路径',
          dataIndex: 'encrypted_file_path',
          key: 'encrypted_file_path',
        },
        {
          title: '操作',
          key: 'operation',
          render: (text:string, record:any) => (
            <Button onClick={() => this.showDecryptModal(record)}>解除隔离</Button>
          ),
        }
        
      ],
    };
  }

// 显示解除隔离Modal，并设置当前行数据
showDecryptModal = (record:any) => {
  this.setState({
    decryptModalVisible: true,
    currentRecord: record,
  });
};

// 隐藏Modal
hideDecryptModal = () => {
  this.setState({
    decryptModalVisible: false,
    currentRecord: {},
  });
};

// 处理解除隔离提交
handleDecryptSubmit = async () => {
  const { currentRecord } = this.state;
  // 构建请求体，这里假设currentRecord中含有需要的所有信息
  const postData = {
    ip_address: currentRecord.agent_ip, // 假设agent_ip是表格中的一列
    filename: currentRecord.origin_filename,
    filepath: currentRecord.origin_file_path,
  };
  
  try {
    const response = await axios.post('http://localhost:5000/api/isolate/decrypt', postData);
    if (response.data.code === 0) {
      message.success('文件解除隔离成功');
    } else {
      message.error('文件解除隔离失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('解除隔离请求错误:', error);
    message.error('文件解除隔离请求发送失败');
  }
  this.hideDecryptModal();
};
// 显示解除隔离Modal，并设置当前行数据
showEncryptModal = (record:any) => {
  this.setState({
    encryptModalVisible: true,
    currentRecord: record,
  });
};

// 隐藏Modal
hideEncryptModal = () => {
  this.setState({
    encryptModalVisible: false,
    currentRecord: {},
  });
};

// 处理添加隔离提交
handleEncryptSubmit = async () => {
  const { currentRecord } = this.state;
  // 构建请求体，这里假设currentRecord中含有需要的所有信息
  const postData = {
    ip_address: currentRecord.agent_ip, // 假设agent_ip是表格中的一列
    filename: currentRecord.origin_filename,
    filepath: currentRecord.origin_file_path,
  };
  
  try {
    const response = await axios.post('http://localhost:5000/api/isolate/encrypt', postData);
    if (response.data.code === 0) {
      message.success('文件隔离成功');
    } else {
      message.error('文件隔离失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('添加隔离请求错误:', error);
    message.error('文件隔离请求发送失败');
  }
  this.hideEncryptModal();
};
// // 新增 - 提交表单进行文件隔离
// onEncryptFinish = async (values:any) => {
//   try {
//     const response = await axios.post('http://localhost:5000/api/isolate/encrypt', {
//       ip_address: values.ip_address,
//       filename: values.filename,
//       filepath: values.filepath,
//     });
//     if (response.data.code === 0) {
//       message.success('文件隔离成功');
//     } else {
//       message.error('文件隔离失败: ' + response.data.message);
//     }
//   } catch (error) {
//     console.error('隔离请求错误:', error);
//     message.error('文件隔离请求发送失败');
//   }
// };
// onDecryptFinish = async (values:any) => {
//   try {
//     const response = await axios.post('http://localhost:5000/api/isolate/decrypt', {
//       ip_address: values.ip_address,
//       filename: values.filename,
//       filepath: values.filepath,
//     });
//     if (response.data.code === 0) {
//       message.success('文件解除隔离成功');
//     } else {
//       message.error('文件解除隔离失败: ' + response.data.message);
//     }
//   } catch (error) {
//     console.error('解除隔离请求错误:', error);
//     message.error('文件解除隔离请求发送失败');
//   }
// };
  render() {
    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
          <Col md={24}>
            <div className="gutter-box">
              <Modal
                title="添加隔离文件"
                visible={this.state.encryptModalVisible}
                onOk={this.handleEncryptSubmit}
                onCancel={this.hideEncryptModal}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ style: { backgroundColor: '#1664FF', borderColor: '#1890ff', color: '#fff' } }}
              >
                  <Descriptions bordered column={1}>
                  <Descriptions.Item label="Agent IP地址">{this.state.currentRecord.agent_ip}</Descriptions.Item>
                  <Descriptions.Item label="文件名称">{this.state.currentRecord.origin_filename}</Descriptions.Item>
                  <Descriptions.Item label="文件路径">{this.state.currentRecord.origin_file_path}</Descriptions.Item>
                </Descriptions>
              </Modal>

              <Card bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>可疑文件列表</h2>
                </div>
                <FetchAPIDataTable 
                apiEndpoint="http://localhost:5000/api/FetchSpFile" 
                columns={this.state.spFilesColumns} 
                timeColumnIndex={[]}
                currentPanel={"spFileslist"} />
                <Table dataSource={initialData} columns={this.state.spFilesColumns} />

              </Card>
              <Modal
                title="解除文件隔离"
                visible={this.state.decryptModalVisible}
                onOk={this.handleDecryptSubmit}
                onCancel={this.hideDecryptModal}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ style: { backgroundColor: '#1664FF', borderColor: '#1890ff', color: '#fff' } }}
              >
                  <Descriptions bordered column={1}>
                  <Descriptions.Item label="Agent IP地址">{this.state.currentRecord.agent_ip}</Descriptions.Item>
                  <Descriptions.Item label="文件名称">{this.state.currentRecord.origin_filename}</Descriptions.Item>
                  <Descriptions.Item label="文件路径">{this.state.currentRecord.origin_file_path}</Descriptions.Item>
                </Descriptions>
              </Modal>

              <Card bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>隔离文件列表</h2>
                </div>
                <FetchAPIDataTable 
                apiEndpoint="http://localhost:5000/api/MicroIsolationlist" 
                columns={this.state.columns} 
                timeColumnIndex={[]}
                currentPanel={"MicroIsolationlist"} />
                <Table dataSource={initialData} columns={this.state.columns} />

              </Card>

            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MicroIsolation;

