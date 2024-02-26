// HostAlertList.tsx
import React from 'react';
import WhiteList from '../WhiteList'; // 确保路径正确
import { whitelistColumns } from '../AssetsCenter/tableUtils'; // 假设列配置从某个文件导入

class HostWhiteList extends React.Component {
    render() {
        // 定义或从外部获取API端点
        const apiEndpoint = "http://localhost:5000/api/files/hostwhitelist";

        return (
            <div>
                <WhiteList 
                    apiEndpoint={apiEndpoint} 
                    columns={whitelistColumns}
                    currentPanel='hostwhitelist'
                />
            </div>
        );
    }
}

export default HostWhiteList;
