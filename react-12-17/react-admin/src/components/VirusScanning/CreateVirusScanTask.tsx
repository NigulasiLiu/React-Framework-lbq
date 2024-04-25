import React, { useState } from 'react';
import { Steps, Form, Input,InputNumber,Button,Row, Alert,Radio,Card } from 'antd';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createNewTaskColumns } from '../tableUtils';
import { LeftOutlined } from '@ant-design/icons';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { TextArea } = Input;


interface CreateVirusScanTaskProps extends RouteComponentProps {}

interface CreateVirusScanTaskState{
    currentStep: number,
    selectedTaskType: string, // 默认选中的任务类型
}
class CreateVirusScanTask extends React.Component<CreateVirusScanTaskProps, CreateVirusScanTaskState> {
  constructor(props:CreateVirusScanTaskProps) {
    super(props);
    this.state = {
      currentStep: 0,
      selectedTaskType: "terminalscan", // 默认选中的任务类型
    };
  }
  handleSubmit = (values:string) => {
    console.log('Received values of form: ', values);
    // 提交表单的操作
  };

  goBack = () => {
    this.props.history.goBack();
  };

  closeTab = () => {
    window.close();
  };

  getStepStatus = (stepIndex:number) => {
    const { currentStep } = this.state;
    if (stepIndex < currentStep) {
      return 'finish';
    } else if (stepIndex === currentStep) {
      return 'process';
    } else {
      return 'wait';
    }
  };

  handleTaskTypeChange = (e:any) => {
    this.setState({ selectedTaskType: e.target.value });
  };

  render() {
    const { currentStep, selectedTaskType } = this.state;

    return (
    //   <div style={{ width: '100%', margin: '0 auto' }}>
    //     {/* Your existing code */}            
    //     <Form
    //     form={form}
    //     layout="vertical"
    //     style={{width:'30%',margin:'0px auto'}}
    //     onFinish={this.handleSubmit}>
    //       <Form.Item label="任务类型" name="type" rules={[{ required: false, }]}>
    //         <Radio.Group onChange={this.handleTaskTypeChange} defaultValue="terminalscan">
    //           <Radio.Button value="terminalscan">端上目录/文件扫描</Radio.Button>
    //           <Radio.Button value="fullscan">全盘扫描</Radio.Button>
    //           <Radio.Button value="quickscan">快速扫描</Radio.Button>
    //         </Radio.Group>
    //       </Form.Item>
    //       {selectedTaskType === "terminalscan" && (
    //         <Form.Item
    //           label="绝对路径"
    //           name="abspath"
    //           rules={[{ required: true, message: '请输入绝对路径' }]}
    //         >
    //           <Input placeholder="请输入绝对路径" />
    //         </Form.Item>
    //       )}
    //       {/* Additional conditions for fullscan and quickscan */}
    //     </Form>
    //     {/* More of your existing code */}
    //   </div>
        <div style={{width:'100%',margin:'0 auto'}}>
        <Row style={{backgroundColor:'#fff',width:'100%',height:'80px'}}>
            <div style={{ margin:'auto 60px'}}>
                <Button
                        type="link"
                        style={{width:'50px',height:'50px',border:'false'}}
                        icon={<LeftOutlined />}
                        onClick={this.closeTab}
                        />
                <span style={{fontSize:'20px',marginLeft:'20px'}}>
                    新建任务
                </span>
            </div>
        </Row>
        <Row style={{width:'30%',height:'50px',margin:'5px auto'}}>   
            <Steps>
                <Step title="选择主机" status={this.getStepStatus(0)} icon={currentStep > 0 ? <SmileOutlined /> : <UserOutlined />} />
                <Step title="设置任务信息" status={this.getStepStatus(1)} icon={currentStep > 1 ? <SmileOutlined /> : <SolutionOutlined />} />
            </Steps>
        </Row>
    <Row style={{}}>
            {currentStep === 0 && (
                <Card style={{width:'90%',margin:'0px auto'}}>
                    <Row style={{margin:'0px auto',width:'100%'}}>
                        <FetchDataForElkeidTable
                        apiEndpoint="http://localhost:5000/api/agent/all"
                        timeColumnIndex={['updatetime']}
                        columns={createNewTaskColumns}
                        currentPanel={"createnewtask"} // 替换为你的 panel 名称
                        />
                    </Row>
                </Card>
            )}
            {currentStep === 1 && (
            <Row style={{width:'100%',margin:'0px auto'}}>
            <Card style={{width:'90%',margin:'0px auto'}}>
                <Form
                layout="vertical"
                style={{width:'30%',margin:'0px auto'}}
                onFinish={this.handleSubmit}
                >
                <Form.Item
                    label="任务名称"
                    name="taskName"
                    rules={[{ required: true, message: '请输入任务名称' }]}
                >
                    <Input placeholder="请输入任务名称" />
                </Form.Item>
                <Form.Item
                    label="任务描述"
                    name="taskDescription"
                    rules={[{ required: false, message: '请输入任务描述' }]}
                >
                    <TextArea rows={4} placeholder="请输入任务描述" />
                </Form.Item>
                <Form.Item label="任务类型" name="type" rules={[{ required: false,}]}>
                    <Radio.Group defaultValue="terminalscan">
                    <Radio.Button value="terminalscan" onClick={()=>this.setState({selectedTaskType:'terminalscan'})}>端上目录/文件扫描</Radio.Button>
                    <Radio.Button value="fullscan" onClick={()=>this.setState({selectedTaskType:'fullscan'})}>全盘扫描</Radio.Button>
                    <Radio.Button value="quickscan" onClick={()=>this.setState({selectedTaskType:'quickscan'})}>快速扫描</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {this.state.selectedTaskType==='terminalscan'&&(<>
                    <Form.Item
                label="绝对路径"
                name="abspath"
                rules={[{ required: true, message: '请输入绝对路径' }]}>
                <Input placeholder="请输入绝对路径" />
                </Form.Item>
                </>)}

                {this.state.selectedTaskType==='fullscan'&&(<>
                <Form.Item>
                <Alert
                    message="全盘扫描端上资源占用较高，且时间较长，请在非业务高峰期操作"
                    type="warning"
                    showIcon
                />
                </Form.Item>
                <Form.Item
                label="资源占用上限/%"
                name="cpuUsage"
                rules={[{ required: true, message: '请输入CPU占用的上限' }]}
                labelCol={{ span: 12 }} // 你可以根据需要调整这个值
                wrapperCol={{ span: 12 }} // 你可以根据需要调整这个值
                >
                <InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value ? value.replace('%', '') : ''}
                    defaultValue={30} // 这里设置输入框的默认值
                    style={{ width: '100%' }} // 你可以通过调整宽度来设置它的尺寸
                />
                </Form.Item>
                <Form.Item
                label="任务超时时长/h"
                name="timeout"
                rules={[{ required: true, message: '请输入任务超时时长' }]}
                labelCol={{ span: 12 }} // 你可以根据需要调整这个值
                wrapperCol={{ span: 12 }} // 你可以根据需要调整这个值
                >

                <InputNumber
                    min={0}
                    max={100}
                    //formatter={value => `${value}h`}
                    parser={value => value ? value.replace('%', '') : ''}
                    defaultValue={48} // 这里设置输入框的默认值
                    style={{ width: '100%' }} // 你可以通过调整宽度来设置它的尺寸
                />
                </Form.Item>
                </>)}
                
                {this.state.selectedTaskType==='quickscan'&&(<>
                <Form.Item
                label="资源占用上限/%"
                name="cpuUsage"
                rules={[{ required: true, message: '请输入CPU占用的上限' }]}
                labelCol={{ span: 12 }} // 你可以根据需要调整这个值
                wrapperCol={{ span: 12 }} // 你可以根据需要调整这个值
                >
                <InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value ? value.replace('%', '') : ''}
                    defaultValue={30} // 这里设置输入框的默认值
                    style={{ width: '100%' }} // 你可以通过调整宽度来设置它的尺寸
                />
                </Form.Item>
                <Form.Item
                label="任务超时时长/h"
                name="timeout"
                rules={[{ required: true, message: '请输入任务超时时长' }]}
                labelCol={{ span: 12 }} // 你可以根据需要调整这个值
                wrapperCol={{ span: 12 }} // 你可以根据需要调整这个值
                >

                <InputNumber
                    min={0}
                    max={100}
                    //formatter={value => `${value}%`}
                    parser={value => value ? value.replace('%', '') : ''}
                    defaultValue={48} // 这里设置输入框的默认值
                    style={{ width: '100%' }} // 你可以通过调整宽度来设置它的尺寸
                />
                </Form.Item>
                </>)}


                <Form.Item>
                    <Button 
                        style={{backgroundColor:'#1664FF',color:'white'}} type="primary" htmlType="submit">
                    提交任务（discarded）
                    </Button>
                </Form.Item>
                </Form>
            </Card>
            </Row>
            )}
    </Row>

        <Row style={{ width: '90%',  margin: '0px auto' }}>
            
        <Card style={{width: '100%'}}>
            <div style={{margin: '0px auto' ,
                display: 'flex',
                justifyContent: 'center', // 水平居中
                alignItems: 'center', // 垂直居中
            }}>
                    {currentStep === 0 && (
                    <>
                        <Button
                        style={{backgroundColor:'white',color:'black'}}
                        onClick={this.goBack} // 或者其他取消操作的逻辑
                        >
                        取消
                        </Button>
                        <Button
                        style={{backgroundColor:'#1664FF',color:'white'}}
                        onClick={() => this.setState({ currentStep: currentStep + 1 })}
                        >
                        下一步
                        </Button>
                    </>
                    )}
                    {currentStep === 1 && (
                    <>
                        <Button
                        style={{backgroundColor:'white',color:'black'}}
                        onClick={() => this.setState({ currentStep: currentStep - 1 })}
                        >
                        上一步
                        </Button>
                        <Button
                        style={{backgroundColor:'#1664FF',color:'white'}}
                        onClick={() => console.log('完成操作')} // 或者其他完成操作的逻辑
                        >
                        确定
                        </Button>
                    </>
                    )}
            </div>
                </Card>
        </Row>
        </div>
    );
  }
}

export default withRouter(CreateVirusScanTask);
