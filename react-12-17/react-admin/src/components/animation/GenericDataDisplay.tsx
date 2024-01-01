import React from 'react';
import axios from 'axios';
import { Table, Button, Input, Card, Col, DatePicker, Row, Menu } from 'antd';
const { RangePicker } = DatePicker;

interface GenericDataDisplayProps {
  apiEndpoint: string;
  columns: any[];
  currentPanel?: string; // 新增一个可选的currentPanel属性
}

interface GenericDataItem {
  [key: string]: any;
}

interface GenericDataDisplayState {
  dataSource: GenericDataItem[];
  selectedRowKeys: React.Key[];
  lastUpdated: string | null;
  searchQuery: string;
  selectedApplicationType: string | null;//用于展示与原型功能不同的panel
}

class GenericDataDisplay extends React.Component<GenericDataDisplayProps, GenericDataDisplayState> {
  constructor(props: GenericDataDisplayProps) {
    super(props);
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      lastUpdated: null,
      searchQuery: '',
      selectedApplicationType: null,
    };
  }

  componentDidMount() {
    this.fetchLatestData();
  }

  fetchLatestData = async () => {
    try {
      const response = await axios.get(this.props.apiEndpoint);
      if (response.data) {
        this.setState({
          dataSource: response.data,
          lastUpdated: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  filterDataByApplicationType = (data: GenericDataItem[]) => {
    return data.filter(item => 
      this.state.selectedApplicationType ? item.applicationType === this.state.selectedApplicationType : true
    );
  };
  // handleSearch = (query: string) => {
  //   this.setState({ searchQuery: query });

  //   if (!query) {
  //     this.fetchLatestData();
  //     return;
  //   }

  //   const filteredDataSource = this.state.dataSource.filter(item =>
  //     Object.keys(item).some(key =>
  //       item[key].toString().toLowerCase().includes(query.toLowerCase())
  //     )
  //   );

  //   this.setState({ dataSource: filteredDataSource });
  // };

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query });

    if (!query) {
      this.fetchLatestData();
      return;
    }

    const filteredDataSource = this.state.dataSource.filter(item =>
      Object.keys(item).some(key =>
        item[key].toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    this.setState({ dataSource: filteredDataSource });
  };
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

  // 处理侧边栏选择事件
  handleApplicationTypeSelect = (e: any) => {
    const applicationType = e.key;
    this.setState({ selectedApplicationType: applicationType }, this.fetchLatestData);
  };
  
    // 渲染侧边栏组件
  renderSidebar = () => {
    const applicationTypes = ['全部应用','数据库', 'Web服务器', 'DevOps工具', '缓存服务']; // 示例应用类型
    return (
      <Menu
        mode="inline"
        onSelect={this.handleApplicationTypeSelect}
      >
        {applicationTypes.map(type => (
          <Menu.Item key={type}>{type}</Menu.Item>
        ))}
      </Menu>
    );
  };
  render() {
    const { dataSource, selectedRowKeys, lastUpdated } = this.state;
    const { currentPanel } = this.props; // 从props中获取currentPanel

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
 
    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
        {/* <Col md={24}>
          <Card bordered={false} bodyStyle={{ padding: '4px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
                <Col flex="none">
                  <Button
                    style={{ marginRight: 8 }}
                    onClick={this.handleExport}
                    disabled={dataSource.length === 0}
                  >
                    批量导出
                  </Button>
                  <Button onClick={this.fetchLatestData}>采集最新数据</Button>
                </Col>
                <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10 }}>
                  <span>
                    最近更新时间: {lastUpdated ? lastUpdated : '-'}
                  </span>
                </Col>
                <Col flex="none" style={{ marginLeft: 'auto' }}>
                  <RangePicker style={{ width: 200 }} />
                </Col>
              </Row>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索..."
                onSearch={this.handleSearch}
                style={{ width: '100%' }}
              />
            </div>
            <Table
              className="customTable"
              rowSelection={rowSelection}
              pagination={false}
              dataSource={dataSource}
              columns={this.props.columns}
              rowKey="id"
            />
          </Card>
        </Col> */}
      <Row>
        {/* Conditionally render the sidebar for applications */}
        {currentPanel === 'applications' && (
          <Col md={6}>
            {/* Render Sidebar here */}
            {this.renderSidebar()}
          </Col>
        )}

        {/* Main content area */}
        <Col md={currentPanel === 'applications' ? 18 : 24}>
          <Card bordered={false} bodyStyle={{ padding: '4px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
                <Col flex="none">
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={this.handleExport}
                      disabled={dataSource.length === 0}
                    >
                      批量导出
                    </Button>
                    <Button onClick={this.fetchLatestData}>采集最新数据</Button>
                  </Col>
                  <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10 }}>
                    <span>
                      最近更新时间: {lastUpdated ? lastUpdated : '-'}
                    </span>
                  </Col>
                  <Col flex="none" style={{ marginLeft: 'auto' }}>
                    <RangePicker style={{ width: 200 }} />
                </Col>
              </Row>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="搜索..."
                onSearch={this.handleSearch}
                style={{ width: '100%' }}
              />
            </div>
            <Table
              className="customTable"
              rowSelection={rowSelection}
              pagination={false}
              dataSource={dataSource}
              columns={this.props.columns}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
      </div>
    );
  }
}

export default GenericDataDisplay;
