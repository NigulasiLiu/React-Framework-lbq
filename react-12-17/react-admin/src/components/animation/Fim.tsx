// Fim.tsx

import React from 'react';
import axios from 'axios';
import { Table, Button, Input, Card, Col } from 'antd';
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
  };

class Fim extends React.Component<{}, FimState> {
    constructor(props: FimProps) {
        super(props);
        this.fetchLatestData = this.fetchLatestData.bind(this);
      }
      
    state: FimState = {
        dataSource: [], // This will be populated with data from MySQL
        selectedRowKeys: [],
        deleteIndex: null,

        lastUpdated: null,
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
    columns = [
    {
        title: '文件名',
        dataIndex: 'filename',
        key: 'filename',
    },
    {
        title: 'MD5哈希值',
        dataIndex: 'content_md5',
        key: 'content_md5',
    },
    {
        title: '创建时间',
        dataIndex: 'ctime',
        key: 'ctime',
    },
    {
        title: '修改时间',
        dataIndex: 'mtime',
        key: 'mtime',
    },
    {
        title: '访问时间',
        dataIndex: 'atime',
        key: 'atime',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '文件名哈希值',
        dataIndex: 'filename_md5',
        key: 'filename_md5',
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
            <Col md={24}>
            <Card bordered={false}
            bodyStyle={{ padding: '4px' }}
            >
            <div style={{ marginBottom: '16px' }}>
                <Button 
                style={{
                    color: this.state.dataSource.length === 0 ? '#ccc' : 'inherit' // Dim the font color if dataSource is empty
                }}
                onClick={this.handleExport}
                disabled={this.state.dataSource.length === 0} // Optionally disable the button
                > 
                批量导出</Button>
                <Button onClick={this.fetchLatestData}>采集最新数据</Button>
                <span style={{ marginLeft: '20px', border: 'none'}}>
                最近更新时间: {this.state.lastUpdated ? this.state.lastUpdated : '-'}
                </span>
                
                </div>
            
            <div style={{ marginBottom: 16 }}>
                <Input.Search
                placeholder="请选择筛选条件并搜索"
                onSearch={this.handleAdd} // Replace with actual search handler
                style={{ width: '100%' }}
                />
            </div>
            <Table<DataItem>
                className="customTable"
                rowSelection={rowSelection}
                pagination={false}
                dataSource={this.state.dataSource}
                columns={this.columns}
                rowKey="id" // Use 'id' as the unique key for each row
                rowClassName={(record: DataItem, index) => { // Make sure to type 'record' as 'DataItem'
                    if (this.state.deleteIndex === record.id) // Use 'record.id' instead of 'record.key'
                        return 'animated zoomOutLeft min-black';
                    return 'animated fadeInRight';
                }}
            />
            </Card>   
            </Col> 
        </div>
        );
      }
}

export default Fim;
