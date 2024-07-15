import React from 'react';
import { Button, Card, Col, message, Row, Table } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { Link } from 'react-router-dom';
import { blueButton } from '../../style/config';
import { handleExport } from '../ContextAPI/DataService';
import { createNewTaskColumns } from '../Columns';

interface HostListTableProps {
    externalDataSource: any[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    apiEndpoint: string;
    currentPanel: string;
    updateSelectedUuids: (selectedUuids: React.Key[]) => void; // 添加新的 props
}

interface HostListTableState {
    selectedUuids: React.Key[];
    lastUpdated: string | null;
    externalDataSource:any[];
}

class HostListTable extends React.Component<HostListTableProps, HostListTableState> {
    constructor(props: HostListTableProps) {
        super(props);
        this.state = {
            selectedUuids: [],
            lastUpdated: null,
            externalDataSource:[],
        };
    }

    componentDidMount() {
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        });
    }

    componentDidUpdate(prevProps: HostListTableProps) {
        if (prevProps.externalDataSource !== this.props.externalDataSource) {
            this.processExternalData();
        }
    }

    processExternalData() {
        let { externalDataSource } = this.props;

        // 1. 去重（根据uuid字段）
        const uniqueData = new Map();
        externalDataSource.forEach(item => {
            uniqueData.set(item.uuid, item);
        });

        // 2. 去除status字段值为0的行
        let filteredData = Array.from(uniqueData.values()).filter(item => {
            console.log("Filtering item with status:", item.status); // 调试信息
            return item.status !== "0";
        });

        // 3. 保留last_seen字段最新的行
        const latestData = new Map();
        filteredData.forEach(item => {
            if (!latestData.has(item.uuid) || new Date(item.last_seen) > new Date(latestData.get(item.uuid).last_seen)) {
                latestData.set(item.uuid, item);
            }
        });

        this.setState({ externalDataSource: Array.from(latestData.values()) });
    }


    // 更新选中行时调用的函数
    onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        let newSelectedRowKeys = [...selectedRowKeys];

        selectedRows.forEach(row => {
            if (row.children && row.children.length > 0) {
                const childKeys = row.children.map((child: any) => child.key);
                newSelectedRowKeys = [...newSelectedRowKeys, ...childKeys];
            }
        });

        this.setState({ selectedUuids: newSelectedRowKeys });
        this.props.updateSelectedUuids(newSelectedRowKeys); // 调用传入的回调函数
    };

    render() {
        const { externalDataSource } = this.state;
        const isButtonDisabled = !externalDataSource || externalDataSource.length === 0 || this.state.selectedUuids.length === 0;

        const rowSelection = {
            selectedRowKeys: this.state.selectedUuids,
            onChange: this.onSelectChange,
        };

        const data = Array.isArray(externalDataSource) ? externalDataSource : [externalDataSource];
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }}>DataManager context无法加载</LoadingOutlined>
                            </div>
                        );
                    }
                    const { refreshDataFromAPI } = context;
                    const handleRefresh = (api: string, apiUuid?: (uuid: string) => string, uuid?: string) => {
                        if (apiUuid && uuid) {
                            // Implement logic for API refresh with UUID if needed
                        } else {
                            refreshDataFromAPI(api,0);
                        }
                        this.setState({
                            lastUpdated: new Date().toLocaleString(),
                        });
                    };
                    return (
                        <div style={{ fontWeight: 'bold', width: '100%' }}>
                            <Card style={{ padding: '4px', width: '100%' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Row gutter={[2, 2]}>
                                        <Col flex="none">
                                            <Button
                                                style={{
                                                    marginRight: '10px',
                                                    opacity: isButtonDisabled ? 0.5 : 1,
                                                }}
                                                onClick={() => handleExport(externalDataSource, this.props.currentPanel, this.state.selectedUuids)}
                                                disabled={isButtonDisabled}
                                            >
                                                批量导出
                                            </Button>
                                        </Col>
                                        <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10, marginTop: '5px' }}>
                                            <span>最近更新时间: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                        </Col>
                                    </Row>
                                </div>
                                <Table
                                    className="customTable"
                                    rowSelection={rowSelection}
                                    rowKey={this.props.columns[0].key}
                                    dataSource={data || []}
                                    columns={this.props.columns}
                                    pagination={{
                                        showQuickJumper: true,
                                    }}
                                />
                            </Card>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}

export default HostListTable;
