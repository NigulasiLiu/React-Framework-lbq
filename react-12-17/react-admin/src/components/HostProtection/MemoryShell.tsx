import React from 'react';
import axios from 'axios';
import {
    Col,
    Row,
    Card,
    Input,
    Button,
    Tooltip,
    Modal,
    Form,
    message,
    Upload,
    message as AntMessage,
    Badge,
} from 'antd';
import { LoadingOutlined,  } from '@ant-design/icons';
import moment from 'moment';
import CustomUpload from '../CustomAntd/CustomUpload'
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { constRenderTable, hostinventoryColumnsType } from '../Columns';
import umbrella from 'umbrella-storage';
import { APP_Server_URL, MemoryShell_API, Task_Data_API } from '../../service/config';
import { blueButton } from '../../style/config';

const { TextArea } = Input;

interface MemmoryShellProps {
}

interface MemmoryShellStates {
    modalVisible: boolean,
    columns: any[];

    detailModalVisible: boolean;  // 新增状态控制新Modal的显示
    responseData: any;
    uploadedFileContent: string | null; // 添加一个字段来存储上传文件的内容
}

class MemoryShell extends React.Component<MemmoryShellProps, MemmoryShellStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            modalVisible: false,
            columns: [],

            detailModalVisible: false,  // 初始化为不显示
            responseData: null,
            uploadedFileContent: null, // 初始化为null
        };
        // Define your table columns based on the DataItem interface
    }
    MemoryHorseColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            Maxwidth: '15px',
            // render:(text:string)=>(
            //     <Button className="custom-button">{text}</Button>
            // ),
        },
        // {
        //     title: "主机名称",
        //     dataIndex: 'uuid',
        //     key: 'uuid',
        //     filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        //     render: (text: string, record: any) => (
        //         <div>
        //             <div>
        //                 <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
        //                     <Button style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF', padding: '0 0' }}>
        //                         <Tooltip title={record.uuid}>
        //                             <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
        //                                 {record.uuid || '-'}
        //                             </div>
        //                         </Tooltip>
        //                     </Button>
        //                 </Link>
        //             </div>
        //         </div>
        //     ),
        // },
        {
            title: '攻击时刻',
            dataIndex: 'detect_time',
            render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a: any, b: any) => parseFloat(b.detect_time) - parseFloat(a.detect_time),
        },
        {
            title: '内存马内容',
            dataIndex: 'shell_data',
            render: (text: string, record: any) => (
                <Tooltip title={record.shell_data}>
                    <div style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px',
                    }}>
                        {record.shell_data}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '内存马POC',
            dataIndex: 'shell_poc',
            render: (text: string, record: any) => (
                <Tooltip title={record.shell_poc}>
                    <div style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px',
                    }}>
                        {record.shell_poc}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: '是否高危',
            dataIndex: 'is_shell',
            onFilter: (value: string | number | boolean, record: any) => record.is_shell == value,
            filters: [
                {
                    text: 'Yes',
                    value: '1',
                },
                {
                    text: 'No',
                    value: '0',
                },
            ],
            render: (text: string, record: any) => (
                <Badge status={record.is_shell === '0' ? 'success' : 'error'} text={record.is_shell === '1' ? 'Yes' : 'No'} />
            ),
        },
    ];
    // 显示Modal
    showModal = () => {
        this.setState({ modalVisible: true });
    };

    hideMemoryShellModal = () => {
        this.setState({ modalVisible: false });
    };
    handleMemoryShellSubmit = async (values: any) => {
        try {
            const token = localStorage.getItem('jwt_token');
            // 配置axios请求头部，包括JWT
            const config = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined, // 如果存在token则发送，否则不发送Authorization头部
                }
            };

            const { uploadedFileContent } = this.state;

            // 直接将values作为POST请求的body发送
            // console.log('values:', JSON.stringify(values, null, 2));
            const formData = new FormData();
            const poc_data = uploadedFileContent?uploadedFileContent:values.data;
            formData.append('data', poc_data); // 使用表单字段名 'data'，将待解码内容作为值传递


            const response = await axios.post(APP_Server_URL+'/api/memoryshell/check', formData,config);
            console.log('response.data:' + JSON.stringify(response.data, null, 2));
            message.success('已保存内存马信息');
            this.hideMemoryShellModal(); // 关闭Modal

            this.setState({
                responseData: response.data,
                detailModalVisible: true,
            });
        } catch (error) {
            console.error('发送失败:', error);
            message.error('poc内容发送失败，请稍后再试');
        }
    };


    handleUploadSuccess = (fileName: string, fileContent: string) => {
        this.setState({ uploadedFileContent: fileContent }); // 将上传文件的内容存储到state中
    };

    handleUploadError = (fileName: string) => {
        message.error(`${fileName} 文件上传失败，请重试`);
    };

    renderMemoryShellModal = () => {
        const { uploadedFileContent } = this.state;
        return (
            <Modal
                title={<span style={{ fontSize: '22px' }}>内存马检测</span>}
                visible={this.state.modalVisible}
                onOk={() => document.getElementById('MemoryShellInfoForm')?.dispatchEvent(new Event('submit', { cancelable: true }))}
                onCancel={this.hideMemoryShellModal}
                okText="确认"
                cancelText="取消"
                okButtonProps={{...blueButton}}
                // style={{ backgroundColor: '#E5E8EF', padding:'28px' }}
            >
                <Form
                    name="MemoryShellInfoForm"
                    onFinish={this.handleMemoryShellSubmit}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label={<span style={{ fontSize: '18px' }}>添加检测内容</span>}
                        name="data"
                        rules={[{ required: true, message: '检测内容不能为空' }]}
                    >
                        <TextArea
                            rows={8}
                            placeholder="添加检测内容"
                            style={{ border: '2px solid gray' }}
                        />
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    label={<span style={{ fontSize: '18px' }}>添加检测内容</span>}*/}
                    {/*    name="data"*/}
                    {/*    rules={[{ required: true, message: '检测内容不能为空' }]}*/}
                    {/*>*/}
                    {/*    <CustomUpload*/}
                    {/*        onUploadSuccess={this.handleUploadSuccess}*/}
                    {/*        onUploadError={this.handleUploadError}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}

                </Form>
            </Modal>
        );
    };
    handleRefresh = (api:string, tag:number) => {
        // 这个方法将被用于调用context中的refreshDataFromAPI
        this.context.refreshDataFromAPI();
    };
    renderDetailModal = () => {
        return (
            <Modal
                title={<span style={{fontSize:'19px'}}>{"内存马检测结果"}</span>}
                visible={this.state.detailModalVisible}
                onCancel={() => this.setState({ detailModalVisible: false })}
                footer={[
                    <Button key="back" onClick={
                        () => {
                        this.setState({ detailModalVisible: false })
                        this.handleRefresh(MemoryShell_API,0)
                    }
                    }>
                        关闭
                    </Button>,
                ]}
            >
                <Form
                    labelCol={{
                        xs: { span: 24 },
                        sm: { span: 5, offset: 0},
                    }}
                    wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 19, offset: 5 },  // 增加内容列的宽度以便更好地展示内容
                    }}
                    name="检测结果"
                >
                    <Form.Item label="检测结果" name="resultDescription">
                        {this.state.responseData?.message.is_shell ?
                            <span style={{ color: 'red' }}>检测到内存马</span> :
                            <span style={{ color: 'blue' }}>无内存马</span>}
                    </Form.Item>
                    <Form.Item label="内存马内容" name="shellDataDescription">
                        {this.state.responseData?.message.shell_data || '见输入'}
                    </Form.Item>
                    <Form.Item label="POC" name="shellPocDescription">
                            {this.state.responseData?.message.is_shell ?
                                <span style={{ color: 'red' }}>{this.state.responseData?.message.shell_poc}</span> : '无'}
                    </Form.Item>
                </Form>

                {/*<Form {...{*/}
                {/*    labelCol: {*/}
                {/*        xs: { span: 24 },*/}
                {/*        sm: { span: 6 },*/}
                {/*    },*/}
                {/*    wrapperCol: {*/}
                {/*        xs: { span: 24 },*/}
                {/*        sm: { span: 14 },*/}
                {/*    },}}*/}
                {/*      name="检测结果"*/}
                {/*>*/}
                {/*    <Form.Item label="检测结果"*/}
                {/*               name="description">*/}
                {/*        <p style={{*/}
                {/*            margin: '0px auto',*/}
                {/*            display: 'flex',*/}
                {/*            //justifyContent: 'center', // 水平居中*/}
                {/*            alignItems: 'center', // 垂直居中*/}
                {/*        }}>{this.state.responseData?.message.is_shell ?*/}
                {/*            <span style={{ color: 'red' }}>检测到内存马</span> : '无内存马' || '检测功能异常'}*/}
                {/*        </p>*/}
                {/*    </Form.Item>*/}
                {/*    <Form.Item label="内存马内容"*/}
                {/*               name="description">*/}
                {/*        <p style={{*/}
                {/*            margin: '0px auto',*/}
                {/*            display: 'flex',*/}
                {/*            //justifyContent: 'center', // 水平居中*/}
                {/*            alignItems: 'center', // 垂直居中*/}
                {/*        }}>{this.state.responseData?.message.shell_data || '见输入'}</p>*/}
                {/*    </Form.Item>*/}
                {/*    <Form.Item label="内存马POC"*/}
                {/*               name="description">*/}
                {/*        <p style={{*/}
                {/*            margin: '0px auto',*/}
                {/*            display: 'flex',*/}
                {/*            //justifyContent: 'center', // 水平居中*/}
                {/*            alignItems: 'center', // 垂直居中*/}
                {/*        }}>{this.state.responseData?.message.is_shell ? (*/}
                {/*            <span style={{ color: 'red' }}>{this.state.responseData?.message.shell_poc}</span>) : '无'}*/}
                {/*        </p>*/}
                {/*    </Form.Item>*/}
                {/*    </Form>*/}
            </Modal>
        );
    };


    render() {
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const { memHorseOriginData,refreshDataFromAPI } = context;
                    // 将函数绑定到类组件的实例上
                    this.handleRefresh = refreshDataFromAPI;

                    return (
                        <div style={{
                            // fontFamily: 'YouYuan, sans-serif',
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold' }}>
                            {this.renderMemoryShellModal()}
                            {this.renderDetailModal()}
                            <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
                                <Col md={24}>
                                    {constRenderTable(memHorseOriginData, '内存马捕获', ['alert_time'],
                                        this.MemoryHorseColumns, 'memHorseList', MemoryShell_API, ['uuid'], this.showModal, '内存马检测')}
                                </Col>
                            </Row>
                        </div>

                    );
                }}
            </DataContext.Consumer>
        );
    }
}

export default MemoryShell;
