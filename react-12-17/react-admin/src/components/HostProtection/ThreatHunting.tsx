import React from 'react';
import { Col, Button, Modal, Form, Input, message, Row,Card } from 'antd';
import axios from 'axios';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';
import { constRenderTable } from '../tableUtils';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';

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

  renderTTPsModal=()=>{
    return (                <Modal
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

);
  }
  render() {
    const threatHuntingColumns = [
      {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          Maxwidth: '15px',
      },
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
      <DataContext.Consumer>
          {(context: DataContextType | undefined) => {
              if (!context) {
                  return (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                          <LoadingOutlined style={{ fontSize: '3em' }} />
                      </div>); // 或者其他的加载状态显示
              }
              // 从 context 中解构出 topFiveFimData 和 n
              const { ttpsOriginData} = context;
              // 将函数绑定到类组件的实例上
              return (
                <div>
                {/* <Button onClick={this.openModal}>添加TTPs</Button> */}
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                {this.renderTTPsModal()}
                    <Col md={24}>
                    {constRenderTable(ttpsOriginData, 'TTPs信息', [], 
                                          threatHuntingColumns, 'threathuntinglist',"'http://localhost:5000/api/files/threathunting'",[''],this.openModal,"添加TTPs")}
                                
                        {/* <div className="gutter-box">
                        <Card bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>TTPs信息</h2>
                            </div>
                            <FetchDataForElkeidTable
                            apiEndpoint="http://localhost:5000/api/files/threathunting"
                            timeColumnIndex={[]}
                            columns={threatHuntingColumns}
                            currentPanel={"HoneypotDefenselist"}
                            />
                            </Card>
                        </div> */}
                    </Col>
                </Row>
                </div>
              );
          }}
      </DataContext.Consumer>
  )
  }
}

export default ThreatHunting;
