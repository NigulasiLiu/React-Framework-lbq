import React from 'react';
import { notification, Badge } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface CustomNotificationProps {
    typeName: 'success' | 'info' | 'warning' | 'error';
    descriptionContent: string;
}

const iconMap = {
    success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    warning: <WarningOutlined style={{ color: '#faad14' }} />,
    error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
};

const notificationCountMap: { [key: string]: number } = {};
const notificationKeyMap: { [key: string]: string } = {};

class CustomNotification extends React.Component<CustomNotificationProps> {
    static openNotification(typeName: 'success' | 'info' | 'warning' | 'error', descriptionContent: string) {
        const key = `${typeName}-${descriptionContent}`;
        if (!notificationCountMap[key]) {
            notificationCountMap[key] = 0;
        }
        notificationCountMap[key] += 1;

        notification[typeName]({
            message: (
                <span style={{ fontFamily: 'youyuan', fontSize: '14px' }}>Data Refresh Tried-Notification-open</span>
    ),
            description: (
                <span style={{ fontFamily: 'youyuan', fontSize: '12px' }}>
                    {descriptionContent}
                </span>
            ),
            icon: iconMap[typeName],
        });
    }
    static openNotification2(typeName: 'success' | 'info' | 'warning' | 'error', descriptionContent: string) {
        const key = `${typeName}-${descriptionContent}`;

        // Close previous notification if exists
        if (notificationKeyMap[key]) {
            notification.close(notificationKeyMap[key]);
        }

        if (!notificationCountMap[key]) {
            notificationCountMap[key] = 0;
        }
        notificationCountMap[key] += 1;

        const notificationKey = `open${Date.now()}`;
        notificationKeyMap[key] = notificationKey;

        const args = {
            key: notificationKey,
            message: (
                <Badge
                    count={notificationCountMap[key]}
                    offset={[10, 0]}
                    style={{ backgroundColor: '#ff4d4f', color: 'white', fontSize: '12px', lineHeight: '16px' }}
                >
                    <span style={{ fontFamily: 'youyuan', fontSize: '14px' }}>Data Refresh Tried-Notification-2</span>
                </Badge>
            ),
            description: (
                <span style={{ fontFamily: 'youyuan', fontSize: '12px' }}>
                    {descriptionContent}
                </span>
            ),
            icon: iconMap[typeName],
            duration: 0,
        };
        notification.open(args);
    }
    // static openNotification2(typeName: 'success' | 'info' | 'warning' | 'error', descriptionContent: string) {
    //     const key = `${typeName}-${descriptionContent}`;
    //     if (!notificationCountMap[key]) {
    //         notificationCountMap[key] = 0;
    //     }
    //     notificationCountMap[key] += 1;
    //
    //     const args = {
    //         message: (
    //             <Badge
    //                 count={notificationCountMap[key]}
    //                 offset={[10, 0]}
    //                 style={{ backgroundColor: '#ff4d4f', color: 'white', fontSize: '12px', lineHeight: '18px' }}
    //             >
    //                 <span style={{ fontFamily: 'youyuan', fontSize: '16px' }}>Data Refresh Tried</span>
    //             </Badge>
    //         ),
    //         description: (
    //             <span style={{ fontFamily: 'youyuan', fontSize: '14px' }}>
    //                 {descriptionContent}
    //             </span>
    //         ),
    //         icon: iconMap[typeName],
    //         duration: 0,
    //     };
    //     notification.open(args);
    // }
    static successNotification(panel: string) {
        const key = `success-${panel}`;
        if (!notificationCountMap[key]) {
            notificationCountMap[key] = 0;
        }
        notificationCountMap[key] += 1;

        notification.open({
            message: (
                <span style={{ fontFamily: 'youyuan', fontSize: '14px' }}>Data Refresh Tried-Notification-static</span>
            ),
            description: (
                <span style={{ fontFamily: 'youyuan', fontSize: '12px' }}>
                    {panel} 数据已刷新
                </span>
            ),
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            style: {
                border: '1px solid #52c41a',
                backgroundColor: '#f6ffed',
            },
        });
    }
    render() {
        return null;
    }
}

export default CustomNotification;
