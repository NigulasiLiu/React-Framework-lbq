import React, { createRef } from 'react';
import { Card, Col, Row, Modal, Form, Input, Button,message } from 'antd';
import axios from 'axios';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';

interface HoneypotDefenseProps{

};

interface HoneypotDefenseStates{
  modalVisible: boolean,
  columns:any[];
};
const columnsHoneypotInfo = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '蜜罐设置的端口',
    dataIndex: 'honeypot_port',
    key: 'honeypot_port',
  },
  {
    title: '蜜罐类型',
    dataIndex: 'honeypot_type',
    key: 'honeypot_type',
    // 可以使用render方法来将蜜罐类型的Integer值转换为对应的文本说明
    // render: (text:number) => {
    //   switch(text) {
    //     case 1:
    //       return 'MySQL蜜罐';
    //     default:
    //       return '其他蜜罐';
    //   }
    // },
  },
  {
    title: '蜜罐状态',
    dataIndex: 'honeypot_status',
    key: 'honeypot_status',
  },
];

const columnsAttackerInfo = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '攻击者IP地址',
    dataIndex: 'attacker_ip',
    key: 'attacker_ip',
  },
  {
    title: '攻击者主机名',
    dataIndex: 'attacker_hostname',
    key: 'attacker_hostname',
  },
  {
    title: '攻击者微信号',
    dataIndex: 'attacker_wx_id',
    key: 'attacker_wx_id',
  },
  {
    title: '攻击时间',
    dataIndex: 'attack_time',
    key: 'attack_time',
  },
];
const columnsAttackerInfo2 = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Agent',
    dataIndex: 'agent_ip',
    key: 'agent_ip',
  },
  {
    title: '攻击者IP',
    dataIndex: 'atk_ip',
    key: 'atk_ip',
  },
  {
    title: '攻击时间',
    dataIndex: 'atk_time',
    key: 'atk_time',
  },
];
class HoneypotDefense extends React.Component<{}, HoneypotDefenseStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
        columns:[],
    };
    // Define your table columns based on the DataItem interface
  }
  // 显示Modal
  showModal = () => {
    this.setState({ modalVisible: true });
  };

  hideHoneypotModal = () => {
    this.setState({ modalVisible: false });
  };
  handleHoneypotSubmit = async (values: any) => {
    try {
      // 直接将values作为POST请求的body发送
      const response = await axios.post('/api/honeypot/setup', values);
      console.log(response.data);
      message.success('蜜罐信息添加成功');
      this.hideHoneypotModal(); // 关闭Modal
    } catch (error) {
      console.error('提交失败:', error);
      message.error('蜜罐信息添加失败，请稍后再试');
    }
  };
  
    render() {
        return (
        <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
          <Button onClick={this.showModal}>添加蜜罐</Button> {/* 临时添加的按钮，用于展示Modal */}
        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
        <Modal
            title="添加蜜罐信息"
            visible={this.state.modalVisible}
            onOk={() => document.getElementById('honeypotInfoForm')?.dispatchEvent(new Event('submit', { cancelable: true }))}
            onCancel={this.hideHoneypotModal}
            okText="确认"
            cancelText="取消"
            okButtonProps={{ style: { backgroundColor: '#1664FF', borderColor: '#1890ff', color: '#fff' } }}
          >
          <Form
            name="honeypotInfoForm"
            onFinish={this.handleHoneypotSubmit}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label="蜜罐端口"
              name="honeypot_port"
              rules={[{ required: true, message: '请输入蜜罐设置的端口' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="蜜罐类型"
              name="honeypot_type"
              rules={[{ required: true, message: '请输入蜜罐类型' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="蜜罐状态"
              name="honeypot_status"
              rules={[{ required: true, message: '请输入蜜罐状态' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
          </Modal>


            <Col md={24}>
                <div className="gutter-box">
                <Card bordered={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>蜜罐信息</h2>
                    </div>
                    <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/api/files/hostinventory"
                    timeColumnIndex={[]}
                    columns={columnsHoneypotInfo}
                    currentPanel={"HoneypotDefenselist"}
                    />
                    </Card>
                </div>
            </Col>
        </Row>
        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
            <Col md={24}>
                <div className="gutter-box">
                <Card bordered={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>捕获信息</h2>
                    </div>
                    <FetchAPIDataTable
                    apiEndpoint="http://localhost:5000/honeypot/attack/data"
                    timeColumnIndex={[]}
                    columns={columnsAttackerInfo2}
                    currentPanel={"AttackerCatchedlist"}
                    />
                    </Card>
                </div>
            </Col>
        </Row>
        </div>
        );
      }
}

export default HoneypotDefense;
