import React , { useRef } from 'react';
import { Button, Form, Input, message } from 'antd';

import { PwaInstaller } from '../widget';
import { connectAlita } from 'redux-alita';
import axios from 'axios';
import { GithubOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import umbrella from 'umbrella-storage';
import { Login_API } from '../../service/config';

const FormItem = Form.Item;

type LoginProps = {
    setAlitaState: (param: any) => void;
    auth: any;
} & RouteComponentProps;

class Login extends React.Component<LoginProps> {
    componentDidMount() {
        this.props.setAlitaState({ stateName: 'auth', data: null });
    }

    componentDidUpdate(prevProps: LoginProps) {
        const { auth, history } = this.props;
        // 检查auth.data是否存在，并且确保uid在更新后与之前不同
        if (auth.data && auth.data.uid && (!prevProps.auth.data || prevProps.auth.data.uid !== auth.data.uid)) {
            // localStorage.setItem('user', JSON.stringify(auth.data));
            // umbrella.setLocalStorage('user',JSON.stringify(auth.data))
            history.push('/');
        }
    }

    handleSubmit = async (values: any) => {
        const requestBody = {
            username: values.userName,
            password: values.password,
        };

        const userInfo = requestBody.username;  // 假设用户信息在response.data.user中
        // localStorage.setItem("user", userInfo);  // 存储用户信息到LocalStorage
        umbrella.setLocalStorage("user", userInfo);
        // message.info("username:"+umbrella.getLocalStorage("user"));
        try {
            // const token = localStorage.getItem('jwt_token');
            const token = localStorage.getItem('jwt_token');
            // 配置axios请求头部，包括JWT
            const config = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '11', // 如果存在token则发送，否则不发送Authorization头部
                }
            };
            const response = await axios.post(Login_API, requestBody,config);

            // 检查 response.data 是否符合预期格式和内容
            if (response.data && response.data.message === 'Accept' && response.data.token === 'fake-jwt-token') {
                // 更新状态和本地存储
                this.props.setAlitaState({
                    //funcName: 'login',
                    stateName: 'auth',
                    data: response.data,
                });
                localStorage.setItem("user", JSON.stringify(response.data));
                //this.props.history.push("/");
                this.props.history.push('/app/Dashboard');
            } else {
                // 处理意外的响应或显示错误消息
            }
            if (response.data && response.data.access_token) {
                console.log("Received JWT:", response.data.access_token); // 输出接收到的JWT
                // 存储JWT到localStorage
                localStorage.setItem("jwt_token", response.data.access_token);
                // umbrella.setLocalStorage("jwt_token", response.data.access_token)
                // 更新redux状态
                this.props.setAlitaState({
                    stateName: 'auth',
                    data: { uid: response.data.access_token },
                });
                console.log("登陆成功");
                // 跳转到主页或其他适当页面
                this.props.history.push('/app/Dashboard');
            } else {
                console.error('Error: Login unsuccessful', response.data.message);
                message.error('登录失败: ' + response.data.message);
            }
        } catch (error) {
            console.error('登录失败', error);
            message.error('登录异常: ' + error.message);
            this.props.history.push('/login'); // 确保登录失败时用户留在登录页面
        }
    };

    gitHub = () => {
        window.location.href =
            'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
    };

    render() {
        // const userNameRef = useRef<Input>(null);
        // const passwordRef = useRef<Input>(null);
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>用电全域安全监测平台</span>
                        {/*<PwaInstaller />*/}
                    </div>
                    <Form onFinish={this.handleSubmit} style={{ maxWidth: '300px' }}>
                        <FormItem
                            name="userName"
                            rules={[{ required: true, message: '请输入用户名!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Username"
                                // ref={userNameRef}
                                // onChange={(e) => {
                                //     if (userNameRef.current) {
                                //         userNameRef.current.input.style.backgroundColor = e.target.value ? 'gray' : 'white';
                                //     }
                                // }}
                            />
                        </FormItem>
                        <FormItem
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                            />
                        </FormItem>
                        <FormItem>
                            {/*<span className="login-form-forgot" style={{ float: 'right' }}>*/}
                            {/*    忘记密码*/}
                            {/*</span>*/}
                            <Button
                                htmlType="submit"
                                //className="login-form-button"

                                style={{
                                    width: '100%',
                                    marginBottom: '10px',
                                    marginTop: '10px',
                                    fontWeight:10,
                                    backgroundColor: 'rgba(0, 0, 0,0.6)',
                                    border: 'none',
                                    color: 'white',
                                    transition: 'opacity 0.3s', // 添加过渡效果
                                    opacity: 1, // 初始透明度
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = 0.7;
                                }} // 鼠标进入时将透明度设置为0.5
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = 1;}}
                            >
                                登录
                            </Button>
                            {/*<p style={{ display: 'flex', justifyContent: 'space-between' }}>*/}
                            {/*    <span>或 注册</span>*/}
                            {/*    <span onClick={this.gitHub}>*/}
                            {/*        <GithubOutlined />*/}
                            {/*        (第三方登录)*/}
                            {/*    </span>*/}
                            {/*</p>*/}
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Login);