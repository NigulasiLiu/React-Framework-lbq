// HostDetailsTable.tsx

import React from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'antd';
import DataDisplayTable from '../AssetsCenter/DataDisplayTable';

interface HostDetailsTableState {
    selectedRowKeys: React.Key[];
    //panel:string;
    route:string;
    currentPanel:string;
}
interface HostDetailsTableProps {
    selectedRowKeys: React.Key[];
    //panel:string;
    route:string;
    currentPanel:string;//用于切换页面的case
    titleName:string;//页面显示的中文标题
    columns:any[];
    onSelectChange: (selectedKeys: React.Key[]) => void; // 选择变化时的可选函数
}

class HostDetailsTable extends React.Component<HostDetailsTableProps,HostDetailsTableState> {
    constructor(props: HostDetailsTableProps) {
        super(props);
        this.state={
            selectedRowKeys:[],
            //panel:'',
            route:'',
            currentPanel:'',
        }
      }
    
    render() {
        return (
        <div style={{ width: '100%' }}>
            <Col className="gutter-row" md={24} style={{ width: '100%',maxWidth:1425,border:'false'}}>
                <Row gutter={[8, 16]} style={{ marginTop: '-21px',marginLeft: '-8px' }}>
                    <Col md={24}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{this.props.titleName}</h2>
                                </div>
                                <DataDisplayTable
                                    apiEndpoint={this.props.route}
                                    columns={this.props.columns}
                                    currentPanel={this.props.currentPanel}
                                    selectedRowKeys={this.state.selectedRowKeys}
                                    onSelectChange={(keys: any) => this.props.onSelectChange(keys)}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                
            </Col>
        </div>
        );
      }
}

export default HostDetailsTable;
