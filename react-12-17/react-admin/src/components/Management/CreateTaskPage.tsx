import React from 'react';
import { Steps, Form, Input, Button, Row, Alert, Radio, Card, message, Switch, DatePicker, Col } from 'antd';
import FetchDataForElkeidTable from '../OWLTable/FetchDataForElkeidTable';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createNewTaskColumns } from '../Columns';
import { LeftOutlined } from '@ant-design/icons';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { fetchDataFromAPI } from '../ContextAPI/DataService';
import { Add_Task_API, Agent_Data_API, Task_Data_API } from '../../service/config';
import umbrella from 'umbrella-storage';

const { Step } = Steps;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CreateTaskPageProps extends RouteComponentProps {
}

interface CreateTaskPageState {
    currentStep: number,
    selectedTaskType: string, // 默认选中的任务类型
    selectedUuids: React.Key[];
    selectedTaskStatus: string;
    taskData: {
        selectedUuids: React.Key[];
        job_name?: string;
        taskDescription?: string;
    }

    existingJobIds: any[];
    startTime: Moment | null;
    endTime: Moment | null;
    excuteTime: Moment | null;
}

class CreateTaskPage extends React.Component<CreateTaskPageProps, CreateTaskPageState> {

    constructor(props: CreateTaskPageProps) {
        super(props);
        this.state = {
            existingJobIds: [],
            currentStep: 0,
            taskData: {
                selectedUuids: [],
            },
            selectedTaskType: 'interval', // 默认选中的任务类型
            selectedTaskStatus: 'normal', // 默认选中的任务类型
            selectedUuids: [],
            startTime: null,
            endTime: null,
            excuteTime: null,
        };
    }

    componentDidMount() {
        this.fetchTaskDetails();
    }

    //获取已经存在的任务的uuid，用于判断用户输入的新job_id是否合理
    async fetchTaskDetails() {
        try {
            const taskData = await fetchDataFromAPI({ apiEndpoint: Task_Data_API });
            if (taskData !== undefined) {
                const taskDataArray = Array.isArray(taskData) ? taskData : [taskData];
                const jobIds = taskDataArray.map(item => item.job_id);
                jobIds.forEach(item => {
                    message.info('已存在的jobId有:' + item);
                });
                this.setState({ existingJobIds: jobIds });
            }
        } catch (error) {
            message.error(`加载任务详情失败: ${error}`);
        }
    }

    validateTaskName = (rule: any, value: string, callback: (message?: string) => void) => {
        if (!value) {
            callback();
            return;
        }

        // 生成所有可能的新的 job_id
        const newJobIds: string[] = this.state.selectedUuids.map(uuid => `${uuid}_${value}`);

        // 检查是否有任何生成的 job_id 已存在于现有 job_id 列表中
        const isConflict = newJobIds.some(jobId => this.state.existingJobIds.includes(jobId));

        if (isConflict) {
            callback('输入的任务名称已存在，请输入其他任务名称！');
        } else {
            callback();
        }
    };

    handleStartTimeChange = (date: Moment | null, dateString: string) => {
        if (!date) {
            this.setState({ startTime: null });
            return;
        }

        // 使用moment进行日期比较
        const { endTime } = this.state;
        if (endTime && date.isAfter(endTime)) {
            this.setState({ startTime: null });
            message.error('开始时间不能晚于结束时间！');
            return;
        }
        this.setState({ startTime: date });
    };

    handleEndTimeChange = (date: Moment | null, dateString: string) => {
        if (!date) {
            this.setState({ endTime: null });
            return;
        }

        const { startTime } = this.state;
        if (date) {
            if (startTime && date.isBefore(startTime)) {
                this.setState({ endTime: null });
                message.error('结束时间必须晚于开始时间！');
                return;
            }
            if (date.isBefore(moment())) {
                this.setState({ endTime: null });
                message.error('结束时间必须晚于当前时间！');
                return;
            }
            this.setState({ endTime: date });
        }
    };
    handleExcuteTimeChange = (date: Moment | null, dateString: string) => {
        if (!date) {
            this.setState({ excuteTime: null });
            return;
        }

        if (date.isBefore(moment())) {
            this.setState({ excuteTime: null });
            message.error('一次性任务预定时间不能早于当前时间！');
            return;
        }
        this.setState({ excuteTime: date });
    };
    handleSubmit = async (values: any) => {
        const { selectedTaskType, selectedTaskStatus } = this.state;
        if (selectedTaskType !== 'date') {
            const { startTime, endTime } = this.state;
            if (!startTime || !endTime) {
                message.error('请填写有效的时间字段！');
                return;
            }
            if (endTime.isBefore(startTime)) {
                message.error('结束时间必须晚于开始时间！');
                this.setState({ endTime: null });
                return;
            }
            if (endTime.isBefore(moment())) {
                message.error('结束时间必须晚于当前时间！');
                this.setState({ endTime: null });
                return;
            }
        } else {
            const { excuteTime } = this.state;
            if (excuteTime && excuteTime.isBefore(moment())) {
                message.error('结束时间必须晚于当前时间！');
                this.setState({ endTime: null });
                return;
            }
        }
        try {
            const postDataArray = this.state.selectedUuids.map(uuid => ({
                uuid: uuid,
                job_name: values.job_name,
                taskDescription: values.taskDescription || 'no',
                callTarget: values.target,
                args: values.args,
                kwargs: values.kwargs,
                executionStrategy: selectedTaskType,
                expression: values.expression || '',
                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
                executionTime: values.executionTime ? values.executionTime.format('YYYY-MM-DD HH:mm:ss') : null,
                taskStatus: selectedTaskStatus || 'normal',
            }));

            // 输出调试信息
            message.info(`准备发送 ${postDataArray.length} 个任务...`);
            const token = umbrella.getLocalStorage('jwt_token');
            const responses = await Promise.all(postDataArray.map((postData) => {
                    message.info(`准备发送 ${JSON.stringify(postData)}`);
                    return fetch(Add_Task_API, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token ? `Bearer ${token}` : '',
                        },
                        body: JSON.stringify(postData),
                    });
                },
            ));

            responses.forEach(async (response, index) => {
                const responseData = await response.json();
                if (response.ok) {
                    console.log(`Task ${index + 1} sent successfully:`, responseData);
                    message.success(`任务${index + 1}已成功发送！`);
                } else {
                    console.error(`Failed to send task ${index + 1}:`, responseData.error);
                    message.error(`任务${index + 1}发送失败: ${responseData.error}`);
                }
            });

            // 循环结束后的跳转操作
            //this.props.history.push('/app/Management/ScheduleTask');
        } catch (error) {
            console.error('Network error:', error);
            message.error(`网络错误: ${error}`);
        }
    };


    goBack = () => {
        this.props.history.goBack();
    };

    closeTab = () => {
        window.close();
    };

    getStepStatus = (stepIndex: number) => {
        const { currentStep } = this.state;
        if (stepIndex < currentStep) {
            return 'finish';
        } else if (stepIndex === currentStep) {
            return 'process';
        } else {
            return 'wait';
        }
    };


    handleSelectedRowKeysChange = (selectedUuids: React.Key[]) => {
        this.setState({
            selectedUuids,
        });
        message.info('选中了：' + selectedUuids);
    };

    handleTaskTypeChange = (e: any) => {
        this.setState({ selectedTaskType: e.target.value });
    };

    render() {
        const { currentStep, selectedTaskType } = this.state;
        const isIntervalOrCron = selectedTaskType === 'interval' || selectedTaskType === 'cron';

        return (
            <div style={{ width: '100%', margin: '0 auto' }}>
                <Row style={{
                    width: '110%', height: '80px', backgroundColor: '#FFFFFF', //height:'40px',
                    marginLeft: '-20px', padding: '12px', borderBottom: '1px solid #F6F7FB',
                }}>
                    <div style={{ margin: 'auto 10px' }}>
                        <Button
                            type="link"
                            style={{
                                width: '40px', height: '40px', fontWeight: 'bold', border: 'transparent',
                                backgroundColor: '#F6F7FB', color: '#88878C',
                            }}
                            icon={<LeftOutlined />}
                            onClick={() => {
                                window.close();
                            }}
                        />
                        <span style={{ fontSize: '20px', marginLeft: '20px' }}>
              新建任务
            </span>
                    </div>
                </Row>
                <Row style={{ width: '30%', height: '40px', margin: '5px auto' }}>
                    <Steps>
                        <Step title="选择主机" status={this.getStepStatus(0)}
                              icon={currentStep > 0 ? <SmileOutlined /> : <UserOutlined />} />
                        <Step title="设置任务信息" status={this.getStepStatus(1)}
                              icon={currentStep > 1 ? <SmileOutlined /> : <SolutionOutlined />} />
                    </Steps>
                </Row>
                <Row style={{}}>
                    {currentStep === 0 && (
                        <Card bordered={false} style={{ width: '90%', margin: '0px auto' }}>
                            <Row style={{ margin: '0px auto', width: '100%' }}>
                                <FetchDataForElkeidTable
                                    key={'createnewtask'}
                                    apiEndpoint={Agent_Data_API}
                                    timeColumnIndex={[]}
                                    columns={createNewTaskColumns}
                                    currentPanel={'createnewtask'}
                                    keyIndex={1}
                                    search={[]}
                                    onSelectedRowKeysChange={this.handleSelectedRowKeysChange}
                                />
                            </Row>
                            <Row style={{
                                width: '100%', margin: '20px auto',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                            }}>
                                <Button
                                    style={{ backgroundColor: 'white', color: 'black', marginRight: '20px' }}
                                    onClick={this.goBack} // 或者其他取消操作的逻辑
                                >
                                    取消
                                </Button>
                                <Button
                                    disabled={this.state.selectedUuids.length === 0}
                                    style={{ backgroundColor: '#1664FF', color: 'white' }}
                                    onClick={() => this.setState({ currentStep: currentStep + 1 })}
                                >
                                    下一步
                                </Button>
                            </Row>
                        </Card>
                    )}
                    {currentStep === 1 && (
                        <Card style={{ width: '90%', margin: '0px auto' }}>
                            <Row style={{ width: '100%', margin: '0px auto' }}>
                                <Form
                                    layout="vertical"
                                    style={{ width: '70%', margin: '0px auto' }}
                                    onFinish={this.handleSubmit}
                                    initialValues={{
                                        job_name: '',
                                        taskDescription: '',
                                        target: '',
                                        args: '',
                                        kwargs: '',
                                        status: 'normal', // 设置任务状态的默认值
                                        description: '', // 如果需要，你也可以设置其他字段的初始值
                                        startTime: moment(), // 设置开始时间的初始值
                                        endTime: moment(), // 设置结束时间的初始值
                                        excuteTime: moment(), // 设置执行时间的初始值
                                    }}
                                >
                                    <Row>
                                        <Row style={{
                                            width: '100%',
                                            paddingBottom: '0px',
                                            border: 'solid 0px #E5E8EF',
                                        }}>
                                            <Form.Item
                                                label={<span style={{ fontSize: '18px' }}>将要下发任务的主机</span>}
                                                name="description">
                                                <p style={{
                                                    margin: '0px auto', fontSize: '18px',
                                                    display: 'flex',
                                                    //justifyContent: 'center', // 水平居中
                                                    alignItems: 'center', // 垂直居中
                                                }}>{this.state.selectedUuids.join(', ')}</p>
                                            </Form.Item>
                                        </Row>
                                        <Row style={{ width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item
                                                    label="任务名称"
                                                    name="job_name"
                                                    rules={[
                                                        { required: true, message: '请输入任务名称' },
                                                        { validator: this.validateTaskName },
                                                    ]}
                                                >
                                                    <Input placeholder="请输入任务名称" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item
                                                    label="任务描述"
                                                    name="taskDescription"
                                                    rules={[{ required: false, message: '请输入任务描述' }]}
                                                >
                                                    <TextArea rows={1} placeholder="请输入任务描述" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row style={{ width: '100%' }}>
                                            <Col span={10}>
                                                <Form.Item label="调用目标" name="target"
                                                           rules={[{ required: true, message: '请输入调用目标' }]}>
                                                    <Input
                                                        placeholder={'调用示例:test.main.Test(\'kinit\',1314,True);参数仅支持字符串，整数，浮点数，布尔类型'} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item label="参数" name="args"
                                                           rules={[{ required: false, message: '请输入参数' }]}>
                                                    <Input
                                                        placeholder="示例:('task1');参数仅支持字符串，整数，浮点数，布尔类型" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item label="关键字参数" name="kwargs"
                                                           rules={[{ required: false, message: '请输入关键字参数' }]}>
                                                    <Input
                                                        placeholder="示例:(isEmpty=True);参数仅支持字符串，整数，浮点数，布尔类型" />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row style={{ width: '100%' }}>
                                            <Col span={24}>
                                                <Form.Item label="执行策略">
                                                    <Radio.Group
                                                        onChange={(e) => this.setState({ selectedTaskType: e.target.value })}
                                                        defaultValue={'interval'}>
                                                        <Radio value="interval"
                                                               onClick={() => this.setState({ selectedTaskType: 'interval' })}>时间间隔</Radio>
                                                        <Radio value="cron"
                                                               onClick={() => this.setState({ selectedTaskType: 'cron' })}>Cron
                                                            表达式</Radio>
                                                        <Radio value="date"
                                                               onClick={() => this.setState({ selectedTaskType: 'date' })}>指定日期时间</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {isIntervalOrCron && (
                                            <Row style={{ width: '100%' }}>
                                                <Col span={24}>
                                                    <Form.Item label="表达式" name="expression"
                                                               rules={[{ required: true, message: '请输入表达式' }]}>
                                                        <Input placeholder={selectedTaskType === 'interval' ?
                                                            'interval 表达式，五位，分别为:秒 分时天周，例如:10 * * * * 表示每隔 10 秒执行一次任务' : 'cron 表达式，六位或七位，分别表示秒、分钟、小时、天、月、星期几、年(可选)'}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Row>
                                                    <Row style={{ width: '100%' }}>
                                                        <Col span={11}>
                                                            <Form.Item label="开始时间" name="startTime" rules={[{
                                                                required: true,
                                                                message: '请选择开始时间',
                                                            }]}>
                                                                <DatePicker className="custom-date-picker" showTime
                                                                            format="YYYY-MM-DD HH:mm:ss"
                                                                            defaultValue={moment()}
                                                                            value={this.state.startTime}
                                                                            onChange={this.handleStartTimeChange} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={2}>
                                                        </Col>
                                                        <Col span={11}>
                                                            <Form.Item label="结束时间" name="endTime"
                                                                       rules={[
                                                                           {
                                                                               required: true,
                                                                               message: '请选择结束时间',
                                                                           },
                                                                       ]}>
                                                                <DatePicker className="custom-date-picker" showTime
                                                                            format="YYYY-MM-DD HH:mm:ss"
                                                                            defaultValue={moment()}
                                                                            value={this.state.endTime}
                                                                            onChange={this.handleEndTimeChange} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Row>
                                            </Row>
                                        )}
                                        {!isIntervalOrCron && (
                                            <Row style={{ width: '100%' }}>
                                                <Col span={24}>
                                                    <Form.Item label="执行时间" name="executionTime"
                                                               rules={[{ required: true, message: '请选择执行时间' }]}>
                                                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
                                                                    defaultValue={moment()}
                                                                    value={this.state.excuteTime}
                                                                    onChange={this.handleExcuteTimeChange} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}
                                        <Row style={{ width: '100%' }}>
                                            <Col span={5}>
                                                <Form.Item label="任务状态" name="status" valuePropName="checked">
                                                    <Radio.Group
                                                        onChange={(e) => this.setState({ selectedTaskStatus: e.target.value })}
                                                        defaultValue="normal">
                                                        <Radio value="normal"
                                                               onClick={() => this.setState({ selectedTaskStatus: 'normal' })}>正常</Radio>
                                                        {/* <Radio value="disabled" onClick={() => this.setState({ selectedTaskStatus: 'disabled' })}>停用</Radio> */}
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                            <Col span={1}>
                                            </Col>
                                            <Col span={18}>
                                                <Form.Item label="注意"
                                                           name="description">
                                                    <p style={{
                                                        margin: '0px auto',
                                                        display: 'flex',
                                                        //justifyContent: 'center', // 水平居中
                                                        alignItems: 'center', // 垂直居中
                                                    }}> 创建或更新任务完成后，如果任务状态与设置的不符，请尝试刷新数据或查看调度日志，任务状态可能会有延迟(几秒)。
                                                    </p>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Row style={{
                                        width: '100%', margin: '20px auto',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    }}>
                                        <Button
                                            style={{ backgroundColor: 'white', color: 'black', marginRight: '20px' }}
                                            onClick={() => this.setState({ currentStep: currentStep - 1 })}
                                        >
                                            上一步
                                        </Button>
                                        <Button
                                            style={{ backgroundColor: '#1664FF', color: 'white' }}
                                            htmlType="submit"
                                        >
                                            确定
                                        </Button>
                                    </Row>
                                </Form>
                            </Row>
                        </Card>
                    )}
                </Row>
            </div>
        );
    }
}

export default withRouter(CreateTaskPage);
