// 添加跟踪按钮
import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import './provenance.css';
import axios from 'axios';
import { Provenance_Add_Tracker_API } from '../../service/config';
import { buttonStyle } from './ProvenanceMain';

const App: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm(); // 创建表单实例

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.submit(); // 触发表单提交
    };

    const isUnicodeEncoded = (str : any) => {
        return /\\u[0-9a-fA-F]{4}/.test(str);
    };

    const decodeUnicodeString = (unicodeStr : any) => {
        return decodeURIComponent(JSON.parse(`"${unicodeStr}"`));
    };

    const processData = (data : any) => {
        for (let key in data) {
            if (typeof data[key] === 'string' && isUnicodeEncoded(data[key])) {
                data[key] = decodeUnicodeString(data[key]);
            }
        }
        return data;
    };

    const onFinish = async (values : any) => {
        try {
            const processedValues = processData(values); // 处理表单数据
            const response = await axios.post(Provenance_Add_Tracker_API, processedValues);
            setIsModalVisible(false); // 提交成功后关闭模态框
            console.log(response.data);
            if (response.data.status === 200) {
                console.log('添加成功，刷新界面后显示更新');
                alert(response.data.message);
            } else {
                console.error("添加失败\n");
                alert("添加失败\n" + (response.data.message || '未知错误'));
            }
        } catch (error) {
            console.error('添加请求失败', error);
            alert("添加请求失败");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button onClick={showModal} className="short-custom-button"
                    {...buttonStyle}>
                添加跟踪目标
            </Button>
            <Modal
                title="待跟踪的目标"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
                style={{ top: 300 }} // 距离页面顶部
            >
                <Form className="track-object-form" form={form} onFinish={onFinish}>
                    <Form.Item
                        label="文件名"
                        name="name"
                        rules={[{ required: true, message: '请输入文件路径' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="INO或PID"
                        name="ino_or_pid"
                        rules={[
                            { required: true, message: '请输入INO或PID' },
                            {
                                pattern: /^[0-9]+$/,
                                message: '只允许输入数字',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="标签"
                        name="tags"
                        rules={[
                            { required: true, message: '请输入分号分隔的标签' },
                            {
                                pattern: /^[A-Za-z]+(;[A-Za-z]+)*$/,
                                message: '标签必须是由分号隔开的英文单词，不允许出现其他字符',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default App;
