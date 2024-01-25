// ContainerCluster.tsx

import React from 'react';
import axios from 'axios';
import { Table, Button, Input, Card, Col, DatePicker, Row } from 'antd';
import DataDisplayTable from './DataDisplayTable';
const { RangePicker } = DatePicker;

interface FimProps {
}
// Define the data item structure based on your MySQL data
interface DataItem {
  id: number;
  filename: string;
  content_md5: string;
  ctime: string;
  mtime: string;
  atime: string;
  status: string;
  filename_md5: string;
}

// Define the component's state to include the data source array
type FimState = {
    dataSource: DataItem[];
    selectedRowKeys: React.Key[];
    deleteIndex: number | null;
    //最新采集数据状态
    lastUpdated: string | null;
    searchQuery: string; // 添加搜索查询状态
  };

class ContainerCluster extends React.Component<{}, FimState> {
    constructor(props: FimProps) {
        super(props);
        this.fetchLatestData = this.fetchLatestData.bind(this);
      }
      
    state: FimState = {
        dataSource: [], // This will be populated with data from MySQL
        selectedRowKeys: [],
        deleteIndex: null,

        lastUpdated: null,
        searchQuery: '', // 初始化搜索查询为空字符串
        };
    // 获取最新数据的方法
    fetchLatestData = async () => {
        try {
            console.log('Fetching data...'); // 新增日志
            const response = await axios.get('http://localhost:5000/api/files');
            console.log('Response received:', response); // 查看响应对象
            if (response.data) {
                console.log('Data fetched successfully:', response.data);
                this.setState({
                    dataSource: response.data,
                    lastUpdated: new Date().toLocaleString(), // 更新时间
                  });
            } else {
                console.log('No data in response');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }
    
    // Define your table columns based on the DataItem interface
    containerColumns = [
    {
        title: '集群',
        dataIndex: 'cluster',
        key: 'cluster',
    },
    {
        title: '集群版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '节点数',
        dataIndex: 'nodeNumber',
        key: 'nodeNumber',
    },
    {
        title: '安全组件状态',
        dataIndex: 'componentStatus',
        key: 'componentStatus',
    },
    {
        title: '风险',
        dataIndex: 'risk',
        key: 'risk',
    },
    {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
    },
    ];
    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys });
      };
    
      handleExport = () => {
        const { dataSource, selectedRowKeys } = this.state;
        const dataToExport = dataSource.filter(item => selectedRowKeys.includes(item.id));
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = "export.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
    
      handleAdd = () => {
        // Logic to add labels or tasks
      };
    
      // Define the rowSelection object
      rowSelection = {
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    // The render method for the table component
    handleSearch = (query: string) => {
        this.setState({ searchQuery: query });
    
        // 如果搜索查询为空，则重置数据源
        if (!query) {
            this.fetchLatestData(); // 或者设置为原始数据源
            return;
        }
    
        // 过滤 dataSource
        const filteredDataSource = this.state.dataSource.filter(item => {
            // 这里可以根据需要过滤多个字段
            return item.filename.toLowerCase().includes(query.toLowerCase()) ||
                   item.content_md5.toLowerCase().includes(query.toLowerCase()) //||
                   // ... 其他字段条件
        });
    
        this.setState({ dataSource: filteredDataSource });
    };
    
    
    render() {
        const { dataSource, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        // Conditional button style
        const buttonStyle = selectedRowKeys.length > 0
        ? { fontWeight: 'bold' as 'bold', color: 'red' } 
        : { fontWeight: 'normal' as 'normal', color: 'grey' }; 
        return (
        <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    <Col md={24}>
                        <div className="gutter-box">
                        <Card bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>容器集群</h2>
                            </div>
                            <DataDisplayTable
                                apiEndpoint="http://localhost:5000/api/files/hostinventory"
                                columns={this.containerColumns}
                                currentPanel={"containerClusterlist"}
                                selectedRowKeys={this.state.selectedRowKeys}
                                onSelectChange={(keys: any) => this.onSelectChange(keys)}
                            />
                            </Card>
                        </div>
                    </Col>

        </Row>
        </div>
        );
      }
}

export default ContainerCluster;
