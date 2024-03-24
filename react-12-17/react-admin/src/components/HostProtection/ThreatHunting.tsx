import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message,Row } from 'antd';
import axios from 'axios';

interface TTP {
  key: string;
  tactic: string;
  technique: string;
  procedure: string;
}

const fetchTTPs = async () => {
  // 替换成实际的后端API
  const { data } = await axios.get<TTP[]>('https://yourapi.com/ttps');
  return data;
};

const ThreatHunting: React.FC = () => {
  const [ttps, setTtps] = useState<TTP[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchTTPs();
        setTtps(data);
      } catch (error) {
        message.error('获取TTPs信息失败');
      }
    };
    init();
  }, []);

  const columns = [
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
      <Row gutter={[8,8]}>
      <Button onClick={() => setIsModalOpen(true)}>
        添加新的TTP
      </Button>
      <Table dataSource={ttps} columns={columns} />

      <Modal title="添加新的TTP" onCancel={() => setIsModalOpen(false)} onOk={() => {}}>
        {/* 表单组件 */}
      </Modal>
      </Row>
    </div>
  );
};

export default ThreatHunting;
