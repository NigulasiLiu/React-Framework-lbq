// HostAlertList.tsx
import React from 'react';
import WhiteList from '../HostProtection/WhiteList'; // 确保路径正确
import { hostalertColumns } from '../../utils/tableUtils'; // 假设列配置从某个文件导入

class HostWhiteList extends React.Component {
    render() {
        // 定义或从外部获取API端点
        const apiEndpoint = "http://localhost:5000/api/files/ccpwhitelist";

        return (
            <div>
                <WhiteList 
                    apiEndpoint={apiEndpoint} 
                    columns={hostalertColumns}
                    currentPanel='ccpwhitelist'
                />
            </div>
        );
    }
}

export default HostWhiteList;
