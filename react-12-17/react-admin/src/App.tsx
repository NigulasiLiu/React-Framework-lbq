import React, { useState, useEffect } from 'react';
import { Layout, notification, ConfigProvider, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import umbrella from 'umbrella-storage';
import { useAlita } from 'redux-alita';
import Routes from './routes';
import SiderCustom from './components/SideMenu/SiderCustom';
import HeaderCustom from './components/SideMenu/HeaderCustom';
import { ThemePicker, Copyright } from './components/widget';
import { checkLogin } from './utils';
import { fetchMenu } from './service';
import DataManager from './components/ContextAPI/DataManager';
import classNames from 'classnames';
import zhCN from 'antd/es/locale/zh_CN';


const { Content, Footer } = Layout;

type AppProps = {};

function checkIsMobile() {
    const clientWidth = window.innerWidth;
    return clientWidth <= 992;
}

let _resizeThrottled = false;

function resizeListener(handler: (isMobile: boolean) => void) {
    const delay = 250;
    if (!_resizeThrottled) {
        _resizeThrottled = true;
        const timer = setTimeout(() => {
            handler(checkIsMobile());
            _resizeThrottled = false;
            clearTimeout(timer);
        }, delay);
    }
}

function handleResize(handler: (isMobile: boolean) => void) {
    window.addEventListener('resize', resizeListener.bind(null, handler));
}

function openFNotification() {
    const openNotification = () => {
        notification.open({
            message: '博主-yezihaohao',
            description: (
                <div>
                    <p>
                        GitHub地址：
                        <a
                            href="https://github.com/yezihaohao"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://github.com/yezihaohao
                        </a>
                    </p>
                    <p>
                        博客地址：
                        <a
                            href="https://yezihaohao.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://yezihaohao.github.io/
                        </a>
                    </p>
                </div>
            ),
            icon: <SmileOutlined style={{ color: 'red' }} />,
            duration: 0,
        });
        umbrella.setLocalStorage('hideBlog', true);
    };
    const storageFirst = umbrella.getLocalStorage('hideBlog');
    if (!storageFirst) {
        openNotification();
    }
}


function App(props: AppProps) {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [auth, responsive, setAlita] = useAlita(
        { auth: { permissions: null } },
        { responsive: { isMobile: false } },
        { light: true },
    );

    useEffect(() => {
        let user = umbrella.getLocalStorage('user');  // 这应该返回一个字符串化的JSON对象
        // let user = localStorage.getItem("user")
        if (user) {
            // const userData = JSON.parse(user);  // 将字符串解析回对象
            const userData = user;
            setAlita('auth', userData);
            message.info(`User Info: ${user}`); // 显示用户信息
        }
        else{
            message.info(`No User Info!`); // 显示用户信息
        }
        setAlita('responsive', { isMobile: checkIsMobile() });

        handleResize((isMobile: boolean) => setAlita('responsive', { isMobile }));
        // openFNotification();
        //fetchSmenu((smenus: any[]) => setAlita('smenus', smenus));去除异步菜单
    }, [setAlita]);

    function toggle() {
        setCollapsed(!collapsed);
    }

    const isLogged = checkLogin(); // 直接检查登录状态
    return (
        <ConfigProvider locale={zhCN}>
            <DataManager>
                <Layout>
                    {!responsive.isMobile && isLogged && (
                        <SiderCustom collapsed={collapsed} />
                    )}
                    {/* <ThemePicker /> */}
                    <Layout
                        className={classNames('app_layout', { 'app_layout-mobile': responsive.isMobile })}
                    >
                        <HeaderCustom toggle={toggle} collapsed={collapsed} user={auth || {}} userName={auth?auth.toString():''}/>
                        <Content className="app_layout_content">
                            <Routes auth={auth} />
                        </Content>
                        <Footer className="app_layout_foot">
                            <Copyright />
                        </Footer>
                    </Layout>
                </Layout>
            </DataManager>
        </ConfigProvider>
    );
};

export default App;
