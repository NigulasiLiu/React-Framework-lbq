// HostAlertList.tsx
import React from 'react';
import AlertList from '../AlertList'; // 确保路径正确
import { hostalertColumns } from '../tableUtils'; // 假设列配置从某个文件导入

class CCPAlertList extends React.Component {
    render() {
        // 定义或从外部获取API端点
        const apiEndpoint = "http://localhost:5000/api/files/ccpalertlist";

        return (
            <div>
                <AlertList 
                    apiEndpoint={apiEndpoint} 
                    columns={hostalertColumns}
                    currentPanel='ccpalertlist'
                />
            </div>
        );
    }
}

export default CCPAlertList;
