import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { blueButton } from '../../style/config';

const DisplaySettingsGuide: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentZoomLevel, setCurrentZoomLevel] = useState(1);

    useEffect(() => {
        const checkZoomLevel = () => {
            // 获取当前的缩放比例
            const zoomLevel = window.devicePixelRatio || 1;
            return zoomLevel;
        };

        // 检测当前的缩放比例
        const zoomLevel = checkZoomLevel();
        setCurrentZoomLevel(zoomLevel);

        // 如果缩放比例不为 125%，则显示弹窗
        if (zoomLevel !== 1.25) {
            setIsModalVisible(true);
        }
    }, []);

    const handleOk = () => {
        setIsModalVisible(false);
        // 自动设置页面缩放比例为 125%
        document.body.style.zoom = (1.25 / currentZoomLevel).toString();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            title={<><ExclamationCircleOutlined style={{ color: '#faad14' }} /> 显示设置引导</>}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="submit" {...blueButton} onClick={handleOk}>
                    确定
                </Button>
            ]}
        >
            <p style={{fontSize:'15px'}}>为了提升您的浏览体验,请将显示设置调整为125%缩放比例。</p>
            <p style={{fontSize:'15px'}}>请按照以下步骤进行操作:</p>
            <ol style={{ paddingLeft: '20px' }}> {/* 调整列表项的缩进 */}
                <li>右键点击桌面并选择“显示设置”</li>
                <li>在“缩放与布局”部分，从“更改文本、应用等项目的大小”下拉菜单中选择“125%”</li>
                <li>如果系统提示，请点击“应用”</li>
                <li>您可能需要注销并重新登录以使更改生效</li>
            </ol>
            <p style={{ color: 'red' }}>注意:调整显示设置可能需要重新启动计算机才能生效</p>
        </Modal>
    );
};

export default DisplaySettingsGuide;
