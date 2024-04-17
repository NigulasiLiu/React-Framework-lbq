// ScheduleTask.tsx

import React from 'react';
import { Card, Col, Button, Row, Modal, Form, Input, Badge } from 'antd'
import { Link } from 'react-router-dom';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';
import DataDisplayTable from '../AssetsCenter/DataDisplayTable';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/lib/table/interface';

export interface ScheduleTaskType {
    key: React.Key;   
    uuid:string;
    task_name: string;
    task_type:string;  
    create_Time:string;        
    status: string;
} 

class ScheduleTask extends React.Component<{}> {

    ScheduleTaskColumns = [
    {
        title: '任务编号',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '主机名称',
        dataIndex: 'uuid',
        key: 'uuid',
        onFilter: (values:string, record:ScheduleTaskType) => record.uuid.includes(values),
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    autoFocus
                    placeholder="搜索..."
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    onClick={() => confirm()}
                    size="small"
                    style={{ width: 90, marginRight: 8,backgroundColor:'#1664FF',color:'white' }}
                >
                    搜索
                </Button>
                <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        // eslint-disable-next-line react/jsx-no-undef
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    
        render: (text: string) => (
            // 使用模板字符串构造带查询参数的路径,encodeURIComponent 函数确保 text 被正确编码
            <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
              <Button style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',
                        padding:'0 0'}}>{text.slice(0,5)}</Button>
            </Link>
          ),
    },
    {
        title: '任务名称',
        dataIndex: 'task_name',
        key: 'task_name',
        onFilter: (values:string, record:ScheduleTaskType) => record.uuid.includes(values),
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    autoFocus
                    placeholder="搜索..."
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    onClick={() => confirm()}
                    size="small"
                    style={{ width: 90, marginRight: 8,backgroundColor:'#1664FF',color:'white' }}
                >
                    搜索
                </Button>
                <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        // eslint-disable-next-line react/jsx-no-undef
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    
        render: (text: string) => (
            // 使用模板字符串构造带查询参数的路径,encodeURIComponent 函数确保 text 被正确编码
            <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
              <Button style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',
                        padding:'0 0'}}>{text.slice(0,5)}</Button>
            </Link>
          ),
    },
    {
        title: '任务类型',
        dataIndex: 'task_type',
        key: 'task_type',
        onFilter: (values:string, record:ScheduleTaskType) => record.uuid.includes(values),
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    autoFocus
                    placeholder="搜索..."
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    onClick={() => confirm()}
                    size="small"
                    style={{ width: 90, marginRight: 8,backgroundColor:'#1664FF',color:'white' }}
                >
                    搜索
                </Button>
                <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        // eslint-disable-next-line react/jsx-no-undef
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    
        render: (text: string) => (
            // 使用模板字符串构造带查询参数的路径,encodeURIComponent 函数确保 text 被正确编码
            <Link to={`/app/detailspage?uuid=${encodeURIComponent(text)}`} target="_blank">
              <Button style={{fontWeight:'bold',border:'transparent',backgroundColor:'transparent',color:'#4086FF',
                        padding:'0 0'}}>{text.slice(0,5)}</Button>
            </Link>
          ),
    },
    {
        title: '创建者',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        onFilter: (value: string | number | boolean, record: ScheduleTaskType) => record.status.includes(value as string),
        filters: [
            {
              text: '已完成',
              value: '已完成',
            },
            {
              text: '运行中',
              value: '运行中',
            },
            {
              text: '下发或运行失败',
              value: '下发或运行失败',
            },
        ],
          // 修改这里使用record参数，确保函数能访问到当前行的数据
        render: (text: string, record: ScheduleTaskType) => (
            <Badge status={record.status === '已完成' ? 'success' : (record.status === '运行中' ? 'processing' : 'error')} text={record.status} />
        ),
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        sorter: (a:ScheduleTaskType, b:ScheduleTaskType) => parseFloat(a.create_Time) - parseFloat(b.create_Time),
    
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any) => (
        // 在 render 方法中返回包含按钮的元素
        <Link to="/app/detailspage" target="_blank">
            <Button type="link" className='custom-link-button'>{"详情"}</Button>
        </Link>)
    }
    ];
      
    render() {
        return (
        <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                        <Col md={24}>
                        <div style={{fontWeight: 'bolder', width: '100%',}}>
                            <Card bordered={true}
                                style={{backgroundColor: '#ffffff' }}>
                                <Row>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>{"定时任务"}</h2>
                                    </div>
                                </Row>
                                <DataDisplayTable
                                externalDataSource={[]}
                                timeColumnIndex={['create_time']}
                                columns={this.ScheduleTaskColumns}
                                currentPanel={"ScheduleTasklist"}
                                />
                            </Card>
                        </div>
                            {/* <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                    <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>用户管理</h2>
                                </div>
                                <FetchAPIDataTable
                                apiEndpoint="http://localhost:5000/api/ScheduleTask"
                                timeColumnIndex={[]}
                                columns={this.ScheduleTaskColumns}
                                currentPanel={"ScheduleTasklist"}
                                />
                                </Card>
                            </div> */}
                        </Col>

            </Row>
        </div>
        );
      }
}

export default ScheduleTask;
