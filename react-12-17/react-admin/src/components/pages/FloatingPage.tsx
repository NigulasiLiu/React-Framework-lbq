import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const FloatingForm = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // 这里可以添加表单提交的逻辑
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        新建 SHA256 任务
      </Button>
      <Modal
        title="新建 SHA256 任务"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            提交任务
          </Button>,
        ]}
      >
        <Form
          name="new_sha256_task"
          layout="vertical"
        >
          <Form.Item
            label="任务名称"
            name="taskName"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item
            label="任务描述"
            name="taskDescription"
            rules={[{ required: true, message: '请输入任务描述' }]}
          >
            <TextArea rows={4} placeholder="请输入任务描述" />
          </Form.Item>
          <Form.Item
            label="周期"
            name="cycle"
            rules={[{ required: true, message: '请选择任务周期' }]}
          >
            <Select placeholder="请选择任务周期">
              <Option value="once">仅一次</Option>
              <Option value="daily">每天</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
              {/* 更多选项... */}
            </Select>
          </Form.Item>
          {/* 添加更多的表单项 */}
        </Form>
      </Modal>
    </>
  );
};

export default FloatingForm;
