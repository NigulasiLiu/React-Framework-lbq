import React from 'react';
import { Col, Button, Modal, Form, Input, message, Row,Card } from 'antd';
import axios from 'axios';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';

interface TTP {
  key: string;
  tactic: string;
  technique: string;
  procedure: string;
}

interface ThreatHuntingState {
  columns:any[];
  ttps: TTP[];
  isModalOpen: boolean;
}

class ThreatHunting extends React.Component<{}, ThreatHuntingState> {
  state: ThreatHuntingState = {
    ttps: [],
    isModalOpen: false,
    columns:[],
  };

  componentDidMount() {
    this.fetchTTPs();
  }


  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };
  handleTTPsSubmit = async (values: any) => {
    try {
      // 直接将values作为POST请求的body发送
      const response = await axios.post('/api/getTTPs', values);
      console.log(response.data);
      message.success('TTPs添加成功');
      this.closeModal(); // 关闭Modal
    } catch (error) {
      console.error('TTPs添加失败:', error);
      message.error('TTPs添加失败, 请稍后再试');
    }
  };
  
  fetchTTPs = async () => {
    // 替换成实际的后端API
    try {
      const { data } = await axios.get<TTP[]>('https://yourapi.com/ttps');
      this.setState({ ttps: data });
    } catch (error) {
      message.error('获取TTPs信息失败');
    }
  };
  render() {
    const threatHuntingColumns = [
      {
        title: '战术',
        dataIndex: 'tactic',
        key: 'tactic',
      },
      {
        title: '技术',
        dataIndex: 'technique',
        key: 'technique',
      },
      {
        title: '程序',
        dataIndex: 'procedure',
        key: 'procedure',
      },
      // 其他需要的列
    ];

    return (
      <div>
      <Button onClick={this.openModal}>添加TTPs</Button> {/* 临时添加的按钮，用于展示Modal */}
      <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
      <Modal
            title="添加TTP信息"
            visible={this.state.isModalOpen}
            onCancel={this.closeModal}
            okText="确认"
            cancelText="取消"
            onOk={() => document.getElementById('ttpInfoForm')?.dispatchEvent(new Event('submit', { cancelable: true }))}
          >
            <Form
              id="ttpInfoForm"
              onFinish={this.handleTTPsSubmit}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="战术"
                name="tactic"
                rules={[{ required: true, message: '请输入战术名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="技术"
                name="technique"
                rules={[{ required: true, message: '请输入技术名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="程序"
                name="procedure"
                rules={[{ required: true, message: '请输入程序名称' }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>


          <Col md={24}>
              <div className="gutter-box">
              <Card bordered={false}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                      <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>TTPs信息</h2>
                  </div>
                  <FetchAPIDataTable
                  apiEndpoint="http://localhost:5000/api/files/threathunting"
                  timeColumnIndex={[]}
                  columns={threatHuntingColumns}
                  currentPanel={"HoneypotDefenselist"}
                  />
                  </Card>
              </div>
          </Col>
      </Row>
      </div>
    );
  }
}

export default ThreatHunting;
