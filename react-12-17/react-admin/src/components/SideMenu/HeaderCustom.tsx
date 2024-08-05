import React, { useEffect, useState } from 'react';
import { useAlita } from 'redux-alita';
import umbrella from 'umbrella-storage';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useSwitch } from '../../utils/hooks';
import {LogoutOutlined,
    ArrowsAltOutlined,
} from '@ant-design/icons';
import { Row, Col, message } from 'antd';
import axios from 'axios';
import { Menu, Layout, Popover, Tooltip, Dropdown, Avatar } from 'antd';
import { gitOauthToken, gitOauthInfo } from '../../service';
import { parseQuery } from '../../utils';
import { PwaInstaller } from '../widget';

import screenfull from 'screenfull';
import avater from '../../style/imgs/user1.png';
import logo from '../../style/imgs/logo_new.png';
import { APP_Server_URL } from '../../service/config';


const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

type HeaderCustomProps = {
    toggle: () => void;
    collapsed: boolean;
    user: any;
    userName: string;
    responsive?: any;
    path?: string;
};

const HeaderCustom = (props: HeaderCustomProps) => {
    const [user, setUser] = useState<any>();
    const [userName, setUserName] = useState<string>();
    const [responsive, setAlita] = useAlita('responsive', { light: true });
    const [visible, turn] = useSwitch();

    const history = useHistory();

    const location = useLocation(); // 使用 useLocation 钩子获取当前路径
    useEffect(() => {
        const query = parseQuery();
        // let storageUser = umbrella.getLocalStorage('user');
        // let storageUser1 = localStorage.getItem("user");
        let storageUser = umbrella.getLocalStorage('user');
        // message.info(`storageUser: ${storageUser}`); // 显示用户信息

        if (hideSiderMenu && props.collapsed === false) {
            props.toggle();
        }
        if (!storageUser && query.code) {
            gitOauthToken(query.code as string).then((res: any) => {
                gitOauthInfo(res.access_token).then((info: any) => {
                    setUser({
                        user: info,
                    });
                    setUserName('default');
                    // umbrella.setLocalStorage('user', info);
                    localStorage.setItem('user', info);
                });
            });
        } else {
            setUserName(storageUser);
            setUser({
                user: storageUser,
            });
            // message.info(`props.user: ${props.user}`); // 显示用户信息

        }
    }, []);
    const screenFull = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    };
    const menuClick = (e: any) => {
        e.key === 'logout' && logout();
    };
    // 用于处理SubMenu标题点击的函数
    const handleSubMenuClick = (e: any) => {
        // 可以在这里添加自定义逻辑，或者什么都不做以保持默认行为
        console.log('用户点击了头像');
        return true;
    };

    // const logout = () => {
    //     umbrella.removeLocalStorage('user');
    //     history.push('/login');
    // };
    const logout = async () => {
        try {
            // 调用后端登出API
            await axios.get(APP_Server_URL+'/api/logout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`, // 发送当前JWT
                },
            });
            console.log('User logged out successfully'); // 调试信息
        } catch (error) {
            console.error('Logout failed', error); // 登出失败的调试信息
        }

        // 清除前端存储的信息
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        umbrella.removeLocalStorage('user');

        // 更新redux状态为未登录
        setAlita({ stateName: 'auth', data: null }); // 更新状态

        // 重定向到登录页面
        history.push('/login');
    };

    const logoutmenu = (
        <Menu>
            {/*<SubMenu title="用户中心">*/}
            {/*    <MenuItemGroup title="用户中心">*/}
            {/*        <Menu.Item key="setting:1">你好 - {user?.userName}</Menu.Item>*/}
            {/*        <Menu.Item key="setting:2">个人信息</Menu.Item>*/}
            {/*    </MenuItemGroup>*/}
            {/*    <MenuItemGroup title="设置中心">*/}
            {/*        <Menu.Item key="setting:3">个人设置</Menu.Item>*/}
            {/*        <Menu.Item key="setting:4">系统设置</Menu.Item>*/}
            {/*    </MenuItemGroup>*/}
            {/*</SubMenu>*/}
            {/*<Menu.Item key="setting:3"><SettingOutlined />设置</Menu.Item>*/}
            <Menu.Item key="logout" onClick={logout}>
                <LogoutOutlined /> 登出
            </Menu.Item>
        </Menu>

    );

    //用于隐藏左侧菜单
    //const [isSiderVisible, setIsSiderVisible] = useState(true);
    const pagesWithoutSiderMenu = [
        '/app/detailspage',
        '/app/create_agent_task',
        '/app/create_virusscan_task',
        '/app/baseline_detail',
        '/app/virusscan_detail',
    ];

    const hideSiderMenu = pagesWithoutSiderMenu.some(page =>
        location.pathname.includes(page),
    );

    //const isDetailPage = pagesWithoutSiderMenu.includes(location.pathname);
    return (
        <div style={{ background: '#FFFFFF', borderBottom: '3px solid #F6F7FB',
            fontFamily: '宋体, sans-serif', fontWeight: 'bold'
        }} >
            <Row align="middle" className="header-row">
                <Col span={24}>
                    <Header className="header-row  header-border"
                            style={{
                                zIndex: 2, // 设置顶侧栏的z-index为2
                                //borderBottom: '2px solid #E5E6EB', // 添加了底轮廓线
                                // 其他已有样式
                            }}
                    >
                        <Row>
                            {/*{hideSiderMenu ? null : (responsive?.isMobile ? (*/}
                            {/*    <Popover*/}
                            {/*        content={<SiderCustom popoverHide={turn.turnOff} />}*/}
                            {/*        trigger="click"*/}
                            {/*        placement="bottomLeft"*/}
                            {/*        visible={visible}*/}
                            {/*        onVisibleChange={(newVisible) => {*/}
                            {/*            console.log('Popover visibility changed:', newVisible);*/}
                            {/*            if (newVisible !== visible) {*/}
                            {/*                newVisible ? turn.turnOn() : turn.turnOff();*/}
                            {/*            }*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <BarsOutlined className="header-row" />*/}
                            {/*    </Popover>*/}

                            {/*) : props.collapsed ? (*/}
                            {/*    <Tooltip title="展开"> /!* 添加Tooltip并设置title为"展开" *!/*/}
                            {/*        <MenuUnfoldOutlined*/}
                            {/*            className="header-row"*/}
                            {/*            onClick={props.toggle}*/}
                            {/*        />*/}
                            {/*    </Tooltip>*/}
                            {/*) : (*/}
                            {/*    <Tooltip title="收起"> /!* 添加Tooltip并设置title为"收起" *!/*/}
                            {/*        <MenuFoldOutlined*/}
                            {/*            className="header-row"*/}
                            {/*            onClick={props.toggle}*/}
                            {/*        />*/}
                            {/*    </Tooltip>*/}
                            {/*))}*/}
                            {!hideSiderMenu && (//backgroundColor:'#F6F7FB',
                                <div style={{
                                    color: '#00367a', marginLeft: '-35px', fontSize: '20px', fontStyle: 'italic',border:'solid 0px #F6F7FB',
                                    fontFamily: 'FZDaHei-B01S, sans-serif',
                                }}>
                                    <img src={logo} alt="Logo"
                                         style={{ zoom: 0.15, marginRight: '20px', }} />
                                    用电全域安全监测平台
                                </div>
                            )}
                            {hideSiderMenu && (
                                <div className="logo-title-container" style={{
                                    margin: '0px,0px',
                                    marginLeft: '-40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                }}>
                                    <img src={logo} alt="Logo"
                                         style={{ zoom:0.15,marginRight:'20px' }} />
                                    <Link to="/app/dashboard" style={{ textDecoration: 'none' }}>
                                        <h2 style={{fontFamily: 'FZDaHei-B01S, sans-serif',fontStyle: 'italic',
                                            fontWeight: 'bold',
                                            padding: '22px,6px',
                                            margin: '10px,0px',
                                            color: 'rgba(0, 54, 122, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '20px',
                                        }}>用电全域安全监测平台</h2>
                                    </Link>
                                </div>
                            )}
                            <Menu
                                mode="horizontal"
                                style={{ lineHeight: '64px', float: 'right', marginLeft: 'auto', marginRight: '0px' }}
                                onClick={menuClick}
                            >
                                {/*<Menu.Item key="pwa">*/}
                                {/*    <PwaInstaller />*/}
                                {/*</Menu.Item>*/}
                                <Menu.Item key="full">
                                    <ArrowsAltOutlined onClick={screenFull} />
                                </Menu.Item>
                                {/* <Menu.Item key="1">
                                <Badge count={25} overflowCount={10} style={{ marginLeft: 10 }}>
                                    <NotificationOutlined />
                                </Badge>
                            </Menu.Item> */}
                                <Dropdown overlay={logoutmenu} trigger={['click']}>
                                    <a onClick={e => e.preventDefault()}>
                                        <Avatar src={user?.avatar || avater} style={{ marginRight: 20 }} />
                                        <span style={{
                                            color: 'black',
                                            fontWeight: 'bold',
                                            marginRight: 20,
                                        }}
                                              onMouseEnter={(e) => e.currentTarget.style.color = '#4086FF'}
                                              onMouseLeave={(e) => e.currentTarget.style.color = 'black'}>
                                        {props.userName || 'Default'}
                                            {/*user?.userName*/}
                                    </span>
                                    </a>
                                </Dropdown>
                            </Menu>
                        </Row>
                    </Header>
                </Col>
            </Row>
        </div>
    );
};

export default HeaderCustom;
