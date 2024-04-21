// ScheduleTask.tsx

import React from 'react';
import { Card, Col, Button, Row, Modal, Form, Input, Badge, message } from 'antd'
import { Link } from 'react-router-dom';
import FetchAPIDataTable from '../AssetsCenter/FetchAPIDataTable';
import DataDisplayTable from '../AssetsCenter/DataDisplayTable';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';

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
            title: 'ID',
            dataIndex: 'task_id',
            key: 'task_id',
        },
        {
            title: '作业编号',
            dataIndex: 'job_id',
            // key: 'job_id',
        },
        {
            title: '开始时间',
            dataIndex: 'start_time',
            // key: 'start_time',
        },
        {
            title: '结束时间',
            dataIndex: 'end_time',
            //key: 'end_time',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            //key: 'create_time',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            //key: 'update_time',
        },
        {
            title: '运行时间',
            dataIndex: 'process_time',
            //key: 'process_time',
        },
        {
            title: '返回值',
            dataIndex: 'retval',
            //key: 'retval',
        },
        {
            title: '异常',
            dataIndex: 'exception',
            //key: 'exception',
        },
        {
            title: "操作",
            dataIndex: 'operation',
            render: (text: string, record: any) => (
            <Link to="/app/create_agent_task" target="_blank">
                <Button 
                    style={{
                    fontWeight:'bold',padding:'0 0',
                    border: 'transparent',
                    backgroundColor: 'transparent',
                    //color: record.status === 'Online' ? '#4086FF' : 'rgba(64, 134, 255, 0.5)', // 动态改变颜色
                    //cursor: record.status === 'Online' ? 'pointer' : 'default' // 当按钮被禁用时，更改鼠标样式
                    }} 
                    //disabled={record.status !== 'Online'}
                >
                    删除任务
                </Button>
            </Link>
            )
        },
        // {
        //     title: '问题回溯',
        //     dataIndex: 'traceback',
        //     key: 'traceback',
        // },
    ];
    
    renderTable=(OriginData:any[], title:string, timeColumnIndex:string[], column:any[], currentPanel:string)=>{
        if(OriginData!==undefined){
            // 确保OriginData总是作为数组处理
            const originDataArray = Array.isArray(OriginData) ? OriginData : [OriginData];
            originDataArray.forEach(item => {
                console.log("create_time:", item.create_time);
                console.log("end_time:", item.end_time);
                console.log("exception:", item.exception);
                console.log("job_id:", item.job_id);
                console.log("process_time:", item.process_time);
                console.log("retval:", item.retval);
                console.log("start_time:", item.start_time);
                console.log("task_id:", item.task_id);
                console.log("traceback:", item.traceback);
                console.log("update_time:", item.update_time);
                console.log("\n"); // 打印空行分隔每个元素
            });
            if (originDataArray.length > 0) {
                if (!originDataArray) {
                    return <div>No data available.</div>;
                }
                message.info("len:"+originDataArray.length)
                return (
                <div style={{fontWeight: 'bolder', width: '100%',}}>
                    <Card bordered={true}
                        style={{backgroundColor: '#ffffff' }}>
                        <Row>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>{title}</h2>
                            </div>
                        </Row>
                        <DataDisplayTable
                            externalDataSource={originDataArray}
                            timeColumnIndex={timeColumnIndex}
                            columns={column}
                            currentPanel={currentPanel}
                        />
                    </Card>
                </div>
                );
            }
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
            <Card bordered={true}
                style={{backgroundColor: '#ffffff', width: '100%' }}>
                <LoadingOutlined style={{ fontSize: '3em' }} />
            </Card>
            </div>
        );
    }
    
    render() {
        return (
            <DataContext.Consumer>
              {(context: DataContextType | undefined) => {
                if (!context) {
                  return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <LoadingOutlined style={{ fontSize: '3em' }} />
                    </div>); // 或者其他的加载状态显示
              }
              // 从 context 中解构出 topFiveFimData 和 n
              const {taskOriginData} = context;
 
                  return (
                    <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
                        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                    <Col md={24}>
                                    {this.renderTable(taskOriginData, '任务详情',['update_time','create_time','start_time','end_time',],this.ScheduleTaskColumns,'ScheduleTasklist')}
                                    {/* <div style={{fontWeight: 'bolder', width: '100%',}}>
                                        <Card bordered={true}
                                            style={{backgroundColor: '#ffffff' }}>
                                            <Row>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold'}}>
                                                    <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>{"任务详情"}</h2>
                                                </div>
                                            </Row>
                                            <DataDisplayTable
                                            externalDataSource={taskOriginDataArray}
                                            timeColumnIndex={[]}
                                            columns={this.ScheduleTaskColumns}
                                            currentPanel={"ScheduleTasklist"}
                                            />
                                        </Card>
                                        
                                        <Card bordered={true}      //'update_time','create_time','start_time','end_time',
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
                                    </div> */}
                                        {/* <div className="gutter-box">
                                        <Card bordered={false}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>任务详情</h2>
                                            </div>
                                            <FetchAPIDataTable
                                            apiEndpoint="http://localhost:5000/api/task/all"
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
              }}
            </DataContext.Consumer>
          )
      }
}

export default ScheduleTask;
