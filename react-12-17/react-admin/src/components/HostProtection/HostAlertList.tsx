// HostAlertList.tsx
import React from 'react';
import AlertList from './AlertList'; // 确保路径正确
import { hostalertColumns } from '../Columns'; // 假设列配置从某个文件导入

class HostAlertList extends React.Component {
    render() {
        // 定义或从外部获取API端点
        const apiEndpoint = "http://localhost:5000/api/files/hostalertlist";

        return (
            <AlertList 
                apiEndpoint={apiEndpoint} 
                columns={hostalertColumns}
                currentPanel='hostalertlist'
            />
        );
    }
}

export default HostAlertList;
