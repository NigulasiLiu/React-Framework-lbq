import React from 'react';
import axios from 'axios';
import { Table, Button, Input, Card, Col, DatePicker, Row, Menu } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface DataDisplayTableProps {
    apiEndpoint: string;
    columns: any[];
    currentPanel: string; // 新增一个可选的currentPanel属性
    timeColumnIndex?: string[];
    rankLabel?: string; //设定每个panel需要排序的的字段用于展示在overview
    selectedRowKeys?: React.Key[]; // 可选属性，代表被选中行的keys，用于控制独立的key
    onSelectChange?: (selectedKeys: React.Key[]) => void; // 选择变化时的可选函数
    //筛选top5数据，从父组件获取
    onTopDataChange?: (panelName: string, data: GenericDataItem[]) => void;
}

interface GenericDataItem {
    [key: string]: any;
}

interface DataDisplayTableState {
    dataSource: GenericDataItem[];
    selectedRowKeys: React.Key[];
    lastUpdated: string | null;
    searchQuery: string;
    selectedApplicationType: string | null; //用于展示与原型功能不同的panel
}

class DataDisplayTable extends React.Component<DataDisplayTableProps, DataDisplayTableState> {
    constructor(props: DataDisplayTableProps) {
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
        this.fetchLatestData().then(() => {
            //从最新获取的数据中读取列的字段以填充onFilter功能
            const newColumns = this.autoPopulateFilters();
            // 如果需要，可以在这里做其他的事情，比如存储newColumns到组件的state
        });
    }
    componentDidUpdate(prevProps: any) {
        // 检查面板是否发生变化
        if (this.props.currentPanel !== prevProps.currentPanel) {
            // 如果面板发生变化，重置selectedRowKeys和lastUpdated
            this.setState(
                {
                    selectedRowKeys: [],
                    lastUpdated: null, // 重置lastUpdated
                },
                () => {
                    // 异步调用fetchLatestData来确保setState完成后执行
                    this.fetchLatestData();
                }
            );
        }
    }

    fetchLatestData = async () => {
        try {
            const response = await axios.get(this.props.apiEndpoint);
            // 检查响应中的数据是否为空
            if (response.data && response.data.length > 0) {
                const rankLabel = this.props.rankLabel ?? 'defaultRankField'; // 使用 props 中的 rankLabel 或默认值
                const sortedData = response.data.sort((a: any, b: any) => {
                    // 如果 rankLabel 字段不存在，则视为 0
                    const aValue = a[rankLabel] ?? 0;
                    const bValue = b[rankLabel] ?? 0;
                    return bValue - aValue;
                });

                // 获取排序后的前五条数据
                const topFiveData = sortedData.slice(0, 5);

                this.setState({
                    //dataSource: response.data,
                    dataSource: this.convertUnixTimeColumns(response.data),
                    lastUpdated: new Date().toLocaleString(),
                });

                if (this.props.onTopDataChange) {
                    this.props.onTopDataChange(this.props.currentPanel, topFiveData);
                }
            } else {
                // 如果数据为空，则设置dataSource为空数组，并将lastUpdated设置为null
                this.setState({
                    dataSource: [],
                    lastUpdated: null,
                });
            }
            // 数据加载完成后，移除按钮的焦点
            // if (this.refreshButtonRef && this.refreshButtonRef.current) {
            //     this.refreshButtonRef.current.blur();
            // }
        } catch (error) {
            console.error('Error fetching data:', error);
            // 在请求出错时，也应该清空数据和更新时间
            this.setState({
                dataSource: [],
                lastUpdated: null,
            });
        }
    };
    // 提取数据中fieldName字段中所有出现的数据种类
    extractFieldVarieties = <T extends keyof GenericDataItem>(fieldName: T): Array<{text: string, value: string}> => {
        const { dataSource } = this.state;
        const fieldVarieties = new Set<GenericDataItem[T]>();

        dataSource.forEach((item) => {
            const fieldValue = item[fieldName];
            if (fieldValue !== undefined && fieldValue !== null) {
                fieldVarieties.add(fieldValue);
            }
        });

        return Array.from(fieldVarieties).map(variety => ({
            text: variety.toString(),
            value: variety.toString(),
        }));
    };
    // 自动填充filters的方法
    autoPopulateFilters = () => {
        const { columns } = this.props;
        const { dataSource } = this.state;

        const newColumns = columns.map(column => {
            if (column.onFilter && dataSource) {
                const fieldVarieties = new Set(dataSource.map(item => item[column.dataIndex]));
                const filters = Array.from(fieldVarieties).map(variety => ({
                    text: variety ? variety.toString() : '',
                    value: variety,
                }));
                return { ...column, filters };
            }
            return column;
        });

        return newColumns;
    };
    filterDataByApplicationType = (data: GenericDataItem[]) => {
        return data.filter((item) =>
            this.state.selectedApplicationType
                ? item.applicationType === this.state.selectedApplicationType
                : true
        );
    };
    convertUnixTimeColumns = (data: GenericDataItem[]): GenericDataItem[] => {
        const { timeColumnIndex } = this.props;
        if (!timeColumnIndex || timeColumnIndex.length === 0) {
            return data;
        }

        return data.map(item => {
            const newItem = { ...item };
            timeColumnIndex.forEach(columnIndex => {
                if (newItem[columnIndex]) {
                    // 转换UNIX时间戳为本地时间字符串
                    newItem[columnIndex] = new Date(newItem[columnIndex] * 1000).toLocaleString();
                }
            });
            return newItem;
        });
    };
    handleSearch = (query: string) => {
        this.setState({ searchQuery: query });

        if (!query) {
            this.fetchLatestData();
            return;
        }

        const filteredDataSource = this.state.dataSource.filter((item) =>
            Object.keys(item).some((key) =>
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

        // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
        if (selectedRowKeys.length === 0 || dataSource.length === 0) {
            alert('没有可导出的数据');
            return;
        }
        const dataToExport = dataSource.filter((item) => selectedRowKeys.includes(item.id));
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 处理侧边栏选择事件
    handleApplicationTypeSelect = (e: any) => {
        const applicationType = e.key;
        // 选择新的应用类型后，也重置selectedRowKeys
        this.setState(
            {
                selectedApplicationType: applicationType,
                selectedRowKeys: [], // 重置selectedRowKeys
            },
            this.fetchLatestData
        );
    };
    // 渲染侧边栏组件
    renderSidebar = () => {
        const applicationTypes = ['全部应用', '数据库', 'Web服务器', 'DevOps工具', '缓存服务']; // 示例应用类型
        return (
            <Menu
                mode="inline"
                onSelect={this.handleApplicationTypeSelect}
                className="custom-menu" // 应用自定义类名
            >
                {applicationTypes.map((type) => (
                    <Menu.Item key={type}>{type}</Menu.Item>
                ))}
            </Menu>
        );
    };
    render() {
        const { dataSource, selectedRowKeys, lastUpdated } = this.state;
        const { currentPanel } = this.props; // 从props中获取currentPanel
        const newColumns = this.autoPopulateFilters();
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const isButtonDisabled = dataSource.length === 0 || selectedRowKeys.length === 0;
        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                    {/* Conditionally render the sidebar for applications */}
                    {currentPanel === 'applications' && (
                        <Col md={6} style={{ paddingRight: '12px', borderRight: '1px solid #ccc' }}>
                            {/* Render Sidebar here */}
                            {this.renderSidebar()}
                        </Col>
                    )}

                    {/* Main content area */}
                    <Col
                        md={currentPanel === 'applications' ? 18 : 24}
                        style={{
                            paddingLeft: currentPanel === 'applications' ? '12px' : '0px',
                        }}
                    >
                        <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col flex="none">
                                        <Button
                                            style={{ marginRight: 8 }}
                                            onClick={this.handleExport}
                                            disabled={isButtonDisabled}
                                        >
                                            批量导出
                                        </Button>
                                        <Button onClick={this.fetchLatestData}>采集最新数据</Button>
                                    </Col>
                                    <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10 }}>
                                        <span>最近更新时间: {lastUpdated ? lastUpdated : '-'}</span>
                                    </Col>
                                    {this.props.timeColumnIndex && this.props.timeColumnIndex.length > 0 && (
                                    <Col flex="none" style={{ marginLeft: 'auto' }}>
                                        <RangePicker style={{ width: 200 }} />
                                    </Col>
                                    )}
                                    {/* <Col flex="none" style={{ marginLeft: 'auto' }}>
                                        <RangePicker style={{ width: 200 }} />
                                    </Col> */}
                                </Row>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Input.Search
                                    placeholder="搜索任何字段可能出现的值"
                                    onSearch={this.handleSearch}
                                    style={{ width: '95%' }}
                                />
                                <Button
                                    icon={<SyncOutlined />}
                                    onClick={this.fetchLatestData}
                                    style={{ marginLeft: '27px' }}
                                />
                            </div>
                            <Table
                                className="customTable"
                                rowSelection={rowSelection}
                                pagination={false}
                                dataSource={this.state.dataSource}
                                columns={newColumns}
                                rowKey="id"
                                //locale={{ emptyText: 'No Data' }} // 可以指定无数据时展示的文本
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DataDisplayTable;
