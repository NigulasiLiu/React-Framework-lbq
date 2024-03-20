/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { useEffect, useState } from 'react';
import screenfull from 'screenfull';
import avater from '../style/imgs/user1.png';
import SiderCustom from './SideMenu/SiderCustom';
import { LogoutOutlined,SettingOutlined } from '@ant-design/icons';
import { Menu, Layout, Popover, Tooltip,Dropdown, Avatar} from 'antd';
import { gitOauthToken, gitOauthInfo } from '../service';
import { parseQuery } from '../utils';
import { useHistory,useLocation } from 'react-router-dom';
import { PwaInstaller } from './widget';
import { useAlita } from 'redux-alita';
import umbrella from 'umbrella-storage';
import { useSwitch } from '../utils/hooks';
import {
    ArrowsAltOutlined,
    BarsOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Row, Col } from 'antd';



const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

type HeaderCustomProps = {
    toggle: () => void;
    collapsed: boolean;
    user: any;
    responsive?: any;
    path?: string;
};

const HeaderCustom = (props: HeaderCustomProps) => {
    const [user, setUser] = useState<any>();
    const [responsive] = useAlita('responsive', { light: true });
    const [visible, turn] = useSwitch();
    
    const history = useHistory();

    const location = useLocation(); // 使用 useLocation 钩子获取当前路径
    useEffect(() => {
        const query = parseQuery();
        let storageUser = umbrella.getLocalStorage('user');
        if (hideSiderMenu && props.collapsed === false) {
            props.toggle();
        }
        if (!storageUser && query.code) {
            gitOauthToken(query.code as string).then((res: any) => {
                gitOauthInfo(res.access_token).then((info: any) => {
                    setUser({
                        user: info,
                    });
                    umbrella.setLocalStorage('user', info);
                });
            });
        } else {
            setUser({
                user: storageUser,
            });
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
    const handleSubMenuClick = (e:any) => {
    // 可以在这里添加自定义逻辑，或者什么都不做以保持默认行为
    console.log("用户点击了头像");
            return true;
        };
    const logout = () => {
        umbrella.removeLocalStorage('user');
        history.push('/login');
    };
    const logoutmenu = (
        <Menu>
            {/* <SubMenu title="用户中心">
                <MenuItemGroup title="用户中心">
                    <Menu.Item key="setting:1">你好 - {user?.userName}</Menu.Item>
                    <Menu.Item key="setting:2">个人信息</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="设置中心">
                    <Menu.Item key="setting:3">个人设置</Menu.Item>
                    <Menu.Item key="setting:4">系统设置</Menu.Item>
                </MenuItemGroup>
            </SubMenu> */}
            
            <Menu.Item key="setting:3"><SettingOutlined />设置</Menu.Item>
            <Menu.Item key="logout" onClick={logout}>
            <LogoutOutlined /> 登出
            </Menu.Item>
        </Menu>

    );

    //用于隐藏标题
    //const [isSiderVisible, setIsSiderVisible] = useState(true);
    const pagesWithoutSiderMenu=
    [
    '/app/detailspage',
    '/app/create_agent_task',
    '/app/create_virusscan_task',
    '/app/baseline_detail',
    '/app/virusscan_detail'
    ];
    const hideSiderMenu = pagesWithoutSiderMenu.includes(location.pathname);

    return (
    <Row align="middle" className="header-row">
        <Col span={24}>
        <Header className="header-row  header-border"
                    style={{
                        zIndex: 2, // 设置顶侧栏的z-index为2
                        borderBottom: '2px solid #E5E6EB', // 添加了底轮廓线
                        // 其他已有样式
                    }}>
            
            {hideSiderMenu?null:(responsive?.isMobile ? (
                <Popover
                    content={<SiderCustom popoverHide={turn.turnOff} />}
                    trigger="click"
                    placement="bottomLeft"
                    visible={visible}
                    onVisibleChange={(visible) => (visible ? turn.turnOn() : turn.turnOff())}
                >
                    <BarsOutlined className="header-row" />
                </Popover>
            ) : props.collapsed ? (
                <Tooltip title="展开"> {/* 添加Tooltip并设置title为"展开" */}
                    <MenuUnfoldOutlined
                        className="header-row"
                        onClick={props.toggle}
                    />
                </Tooltip>
            ) : (
                <Tooltip title="收起"> {/* 添加Tooltip并设置title为"收起" */}
                    <MenuFoldOutlined
                        className="header-row"
                        onClick={props.toggle}
                    />
                </Tooltip>
            ))}
            <Menu
                mode="horizontal"
                style={{ lineHeight: '64px', float: 'right' }}
                onClick={menuClick}
            >
            {/* Add version info here */}

                {/* <Menu.Item key="pwa">
                    <PwaInstaller />
                </Menu.Item> */}
                <Menu.Item key="full" >
                    <ArrowsAltOutlined onClick={screenFull} />
                </Menu.Item>
                {/* <Menu.Item key="1">
                    <Badge count={25} overflowCount={10} style={{ marginLeft: 10 }}>
                        <NotificationOutlined />
                    </Badge>
                </Menu.Item> */}
                <Dropdown overlay={logoutmenu} trigger={['click']}>
                    <a onClick={e => e.preventDefault()}>
                        <Avatar src={user?.user?.avatar || avater} style={{ marginRight: 20 }}/>
                    <span style={{
                            color: 'black',
                            fontWeight: 'bold',
                            marginRight: 20
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#4086FF'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'black'}>
                            {user?.user?.userName || 'Guest'}
                        </span> 
                    </a>
                </Dropdown>
            </Menu>
        </Header>
        </Col>
    </Row>
    );
};

export default HeaderCustom;
