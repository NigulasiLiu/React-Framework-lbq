import React from 'react';
import { Menu } from 'antd';
import { SelectInfo } from 'rc-menu/lib/interface';
interface SidebarComponentProps {
    onApplicationTypeSelect: (applicationType: string) => void;
}

class SidebarComponent extends React.Component<SidebarComponentProps> {
    handleApplicationTypeSelect = (info: SelectInfo) => {
        const applicationType = info.key as string;
        this.props.onApplicationTypeSelect(applicationType);
    };

    render() {
        const applicationTypes = ['全部应用', '数据库', 'Web服务器', 'DevOps工具', '缓存服务'];
        return (
            <Menu mode="inline" 
            className="custom-menu" // 应用自定义类名
            onSelect={this.handleApplicationTypeSelect}>
                {applicationTypes.map((type) => (
                    <Menu.Item key={type}>{type}</Menu.Item>
                ))}
            </Menu>
        );
    }
}
export default SidebarComponent;