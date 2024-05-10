import React, { createRef } from 'react';
import { Card, Col, Row, Modal, Form, Input, Button, message, Tooltip } from 'antd';
import axios from 'axios';
import { constRenderTable, hostinventoryColumnsType } from '../Columns';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';

interface HoneypotDefenseProps{

};

interface HoneypotDefenseStates{
  modalVisible: boolean,
  columns:any[];
};
const columnsHoneypotInfo1 = [
  {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      Maxwidth: '15px',
  },
  {
    title: '蜜罐端口',
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

const columnsHoneypotInfo = [
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
    title: '蜜罐IP',
    dataIndex: 'agent_ip',
    key: 'agent_ip',
  },
  {
    title: '攻击时刻',
    dataIndex: 'atk_time',
    key: 'atk_time',
    render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
    sorter: (a: any, b: any) => parseFloat(b.atk_time) - parseFloat(a.atk_time),
  },
];


const columnsAttackerInfo = [
  {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      Maxwidth: '15px',
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
      Maxwidth: '15px',
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
  renderHoneyPotModal=()=>{
    return (
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
        </Modal>);
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
                    const { honeyPotOriginData} = context;
                    // 将函数绑定到类组件的实例上
      

                    return (
                      <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
                        {this.renderHoneyPotModal()}
                        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                            <Col md={24}>
                            {constRenderTable(honeyPotOriginData, '蜜罐信息', [],
                                      columnsHoneypotInfo, 'HoneypotDefenselist',"http://localhost:5000/api/honeypot/all",['uuid'],this.showModal,"新增蜜罐")}
                            </Col>
                        </Row>
                      </div>
                      );
                }}
            </DataContext.Consumer>
        )
    }
}

export default HoneypotDefense;