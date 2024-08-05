import React from 'react';
import { Card, Col, Row, Button, message, Modal, Table, Descriptions, Tooltip, Badge } from 'antd';
import axios from 'axios';
import { LoadingOutlined,  } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import DataDisplayTable from '../OWLTable/DataDisplayTable';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import umbrella from 'umbrella-storage';
import {
  APP_Server_URL,
  Isolate_Data_API,
  Isolate_decrypt_Data,
  Isolate_encrypt_Data,
  Monitor_Data_API,
} from '../../service/config';
import { monitoredColumns } from '../Columns';
import moment from 'moment/moment';
import { splitFilePath } from '../ContextAPI/DataService';


interface MicroIsolationProps{

};

interface MicroIsolationStates{
  spFilesColumns:any[]
  EncryptedFilesColumns:any[];
  encryptModalVisible: boolean,
  decryptModalVisible: boolean,
  currentRecord: any; // 存储当前选中的行数据
};


// 在MicroIsolation组件内部，可能在constructor或直接在state定义中
const initialData = [
  {
    // key: '1',
    id: 1,
    uuid: '192.168.1.1',
    encrypt_key: 'some_key_1',
    origin_filename: 'report1.docx',
    origin_file_path: '/path/to/report1.docx',
    encrypted_filename: 'report1_encrypted.docx',
    encrypted_file_path: '/path/to/encrypted/report1.docx',
  },
  {
    // key: '2',
    id: 2,
    uuid: '192.168.1.2',
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
      spFilesColumns:  [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          Maxwidth: '15px',
        },
        {
          title: '主机名',
          dataIndex: 'uuid',
          key: 'uuid',
          render: (text: string, record: any) => (
              <div>
                <div>
                  {/*{record.uuid.slice(0, 5)}*/}
                  <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid || 'defaultUUID')}`} target="_blank">
                    <Button style={{
                      fontWeight: 'bold',
                      border: 'transparent',
                      backgroundColor: 'transparent',
                      color: '#4086FF',
                      padding: '0 0',
                    }}>
                      <Tooltip title={record.uuid || 'Unknown UUID'}>
                        <div style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '80px',
                        }}>
                          {record.uuid || '-'}
                        </div>
                      </Tooltip>
                    </Button>
                  </Link>
                </div>
                <div style={{
                  fontSize: 'small', // 字体更小
                  background: '#f0f0f0', // 灰色背景
                  padding: '2px 4px', // 轻微内边距
                  borderRadius: '2px', // 圆角边框
                  display: 'inline-block', // 使得背景色仅围绕文本
                  marginTop: '4px', // 上边距
                }}>
                  <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.agentIP}
                </div>
              </div>
          ),
        },
        {
          title: '文件名',
          dataIndex: 'file_path',
          onHeaderCell: () => ({
            style: {
              maxWidth: 200, // 最大宽度200px
            },
          }),
        },
        {
          title: '告警类型',
          dataIndex: 'change_type',
          onFilter: (value: string | number | boolean, record: any) => record.change_type.includes(value as string),
          filters: [
            {
              text: 'created',
              value: 'created',
            },
            {
              text: 'deleted',
              value: 'deleted',
            },
            {
              text: 'modified',
              value: 'modified',
            },
          ],
          // 修改这里使用record参数，确保函数能访问到当前行的数据
          render: (text: string, record: any) => (
              <Badge
                  status={record.change_type === 'deleted' ? 'error' : (record.change_type === 'modified' ? 'warning' : 'processing')}
                  text={record.change_type} />
          ),


          onHeaderCell: () => ({
            style: {
              minWidth: 80, // 最小宽度100px
              //maxWidth: 170, // 最大宽度200px
            },
          }),
        },
        {
          title: '文件类型',
          dataIndex: 'file_type',
        },
        {
          title: '告警时间',
          dataIndex: 'timestamp',
          render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
          sorter: (a: any, b: any) => parseFloat(b.timestamp) - parseFloat(a.timestamp),
        },
          {
            title: '操作',
            key: 'operation',
            render: (text:string, record:any) => (
              <Button
                  style={{
                    fontWeight: 'bold', padding: '0 0',
                    border: 'transparent',
                    backgroundColor: 'transparent',
                  }}
                  onClick={() => this.showEncryptModal(record)}>隔离</Button>
            ),
          }
      ],
      decryptModalVisible: false,
      encryptModalVisible: false,
      currentRecord: {}, // 存储当前选中的行数据
      EncryptedFilesColumns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: "主机名称",
          dataIndex: 'uuid', key: 'uuid',
          render: (text: string, record: any) => (
              <div>
                <div>
                  <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                    <Button style={{
                      fontWeight: 'bold',
                      border: 'transparent',
                      backgroundColor: 'transparent',
                      color: '#4086FF',
                      padding: '0 0',
                    }}>
                      <Tooltip title={record.uuid}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                          {record.uuid || '-'}
                        </div>
                      </Tooltip>
                    </Button>
                  </Link>
                </div>
                <div style={{
                  fontSize: 'small', // 字体更小
                  background: '#f0f0f0', // 灰色背景
                  padding: '2px 4px', // 轻微内边距
                  borderRadius: '2px', // 圆角边框
                  display: 'inline-block', // 使得背景色仅围绕文本
                  marginTop: '4px', // 上边距
                }}>
                  <span style={{ fontWeight: 'bold' }}>内网IP:</span> {record.agent_ip}
                </div>
              </div>
          ),
        },
        {
          title: '文件名称',
          dataIndex: 'origin_filename',
          key: 'origin_filename',
        },
        {
          title: '文件位置',
          dataIndex: 'origin_filepath',
          key: 'origin_filepath',
        },
        // {
        //   title: '加密密钥',
        //   dataIndex: 'aes_key',
        //   key: 'aes_key',
        // },
        {
          title: '隔离文件名',
          dataIndex: 'encrypted_filename',
          key: 'encrypted_filename',
        },
        {
          title: '隔离文件路径',
          dataIndex: 'encrypted_filepath',
          key: 'encrypted_filepath',
        },
        {
          title: '操作',
          key: 'operation',
          render: (text:string, record:any) => (
            <Button
                style={{
                  fontWeight: 'bold', padding: '0 0',
                  border: 'transparent',
                  backgroundColor: 'transparent',
                  // color: record.status === 'Online' ? '#4086FF' : 'rgba(64, 134, 255, 0.5)', // 动态改变颜色
                  // cursor: record.status === 'Online' ? 'pointer' : 'default' // 当按钮被禁用时，更改鼠标样式
                }}
                onClick={() => this.showDecryptModal(record)}>解除隔离
            </Button>
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
    uuid: currentRecord.uuid, // 假设agent_ip是表格中的一列
    filename: currentRecord.origin_filename,
    filepath: currentRecord.origin_filepath,
    encryptedfilename: currentRecord.encrypted_filename,
    encryptedfilepath: currentRecord.encrypted_filepath,
  };
  
  try {
    const token = localStorage.getItem('jwt_token');
    // 配置axios请求头部，包括JWT
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // 如果存在token则发送，否则不发送Authorization头部
      }
    };
    const response = await axios.post(Isolate_decrypt_Data, postData,config);
    if (response.data.code === 200) {
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

renderDecryptModal=()=>{
  return (
      <Modal
      title="取消隔离文件"
      visible={this.state.decryptModalVisible}
      onOk={this.handleDecryptSubmit}
      onCancel={this.hideDecryptModal}
      okText="确认"
      cancelText="取消"
      okButtonProps={{ style: { backgroundColor: '#1664FF', borderColor: '#1890ff', color: '#fff' } }}
    >
        <Descriptions bordered column={1}>
        <Descriptions.Item label="Agent UUID">{this.state.currentRecord.uuid}</Descriptions.Item>
        <Descriptions.Item label="原文件名称">{this.state.currentRecord.origin_filename}</Descriptions.Item>
        <Descriptions.Item label="原文件路径">{this.state.currentRecord.origin_filepath}</Descriptions.Item>
        <Descriptions.Item label="加密文件名称">{this.state.currentRecord.encrypted_filename}</Descriptions.Item>
        <Descriptions.Item label="加密文件路径">{this.state.currentRecord.encrypted_filepath}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}


// 隔离Modal，并设置当前行数据
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
  const filePath = currentRecord.file_path;
  const { filepath, filename } = splitFilePath(filePath);
  const postData = {
    uuid: currentRecord.uuid, // 假设agent_ip是表格中的一列
// 使用字符串处理方法获取文件名和路径
    filename : filename, // 获取文件名
    filepath : filepath, // 获取文件所在的路径
  };
  
  try {
    const token = localStorage.getItem('jwt_token');
    // 配置axios请求头部，包括JWT
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined, // 如果存在token则发送，否则不发送Authorization头部
      }
    };
    const response = await axios.post(Isolate_encrypt_Data, postData,config);
    if (response.data.code === 200) {
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

renderEncryptModal=()=>{
// 假设 this.state.currentRecord.file_path 可能不是字符串
  const filePath = this.state.currentRecord.file_path;
  const { filepath, filename } = splitFilePath(filePath);
// 获取文件所在的路径
  return (
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
        <Descriptions.Item label="Agent UUID">{this.state.currentRecord.uuid}</Descriptions.Item>
        <Descriptions.Item label="文件名称">{filename}</Descriptions.Item>
        <Descriptions.Item label="文件路径">{filepath}</Descriptions.Item>
      </Descriptions>
    </Modal>
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
            const {monitoredOriginData,
              virusOriginData,
              isolationOriginData,} = context;
            const virusData = virusOriginData===undefined?initialData:virusOriginData;
            return (
                <div style={{ fontFamily: '宋体, sans-serif', fontWeight: 'bold' }}>
                  <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col md={24}>
                      <div className="gutter-box">
                        {this.renderEncryptModal()}
                        {this.renderDecryptModal()}
                        <Card bordered={false}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                            <h2 style={{
                              fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>可疑文件列表</h2>
                          </div>
                          <DataDisplayTable
                              key={"spFileslist"}
                              // externalDataSource={virusData}
                              externalDataSource={monitoredOriginData}
                              apiEndpoint={Monitor_Data_API}
                              timeColumnIndex={[]}
                              columns={this.state.spFilesColumns}
                              currentPanel={"spFileslist"}
                              searchColumns={['uuid', 'filepath']}
                          />
                          {/*<Table dataSource={initialData} columns={this.state.spFilesColumns} />*/}

                        </Card>
                        <Card bordered={false}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                            <h2 style={{
                              fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>隔离文件列表</h2>
                          </div>
                          <DataDisplayTable
                              key={"isolate"}
                              externalDataSource={isolationOriginData}
                              apiEndpoint={Isolate_Data_API}
                              timeColumnIndex={[]}
                              columns={this.state.EncryptedFilesColumns}
                              currentPanel={"isolate"}
                              searchColumns={['uuid', 'encrypted_filename']}
                          />
                          {/*<Table dataSource={initialData} columns={this.state.EncryptedFilesColumns} />*/}

                        </Card>
                      </div>
                    </Col>
                  </Row>
                </div>
            );
          }}
        </DataContext.Consumer>
    )
  }
}

export default MicroIsolation;

