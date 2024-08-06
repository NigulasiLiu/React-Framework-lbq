// import React, { useState, useEffect } from 'react';
// import { Layout } from 'antd';
// import { withRouter, RouteComponentProps } from 'react-router-dom';
// import routes from '../routes/config';
// import SiderMenu from './SideMenu/SiderCustom';
// import { useAlita } from 'redux-alita';
// import { useSwitch } from '../utils/hooks';
// import { usePrevious } from 'ahooks';
// import logo from '../style/imgs/owl.png';
// const { Sider } = Layout;
// type SiderCustomProps = RouteComponentProps<any> & {
//     popoverHide?: () => void;
//     collapsed?: boolean;
//     smenus?: any;
// };
// interface IMenu {
//     openKeys: string[];
//     selectedKey: string;
// }
// const SiderCustom = (props: SiderCustomProps) => {
//     const [collapsed, tCollapsed] = useSwitch();
//     const [firstHide, tFirstHide] = useSwitch();
//     const [menu, setMenu] = useState<IMenu>({ openKeys: [''], selectedKey: '' });
//     // 异步菜单
//     const [smenus] = useAlita({ smenus: [] }, { light: true });
//     const { location, collapsed: pCollapsed } = props;
//     const prePathname = usePrevious(props.location.pathname);
//     useEffect(() => {
//         const recombineOpenKeys = (openKeys: string[]) => {
//             let i = 0;
//             let strPlus = '';
//             let tempKeys: string[] = [];
//             // 多级菜单循环处理
//             while (i < openKeys.length) {
//                 strPlus += openKeys[i];
//                 tempKeys.push(strPlus);
//                 i++;
//             }
//             return tempKeys;
//         };
//         const getOpenAndSelectKeys = () => {
//             return {
//                 openKeys: recombineOpenKeys(location.pathname.match(/[/](\w+)/gi) || []),
//                 selectedKey: location.pathname,
//             };
//         };

//         if (pCollapsed !== collapsed) {
//             setMenu(getOpenAndSelectKeys());
//             tCollapsed.setSwitcher(!!pCollapsed);
//             tFirstHide.setSwitcher(!!pCollapsed);
//         }

//         if (prePathname !== location.pathname) {
//             setMenu(getOpenAndSelectKeys());
//         }
//     }, [prePathname, location.pathname, collapsed, tFirstHide, tCollapsed, pCollapsed]);

//     const menuClick = (e: any) => {
//         setMenu((state) => ({ ...state, selectedKey: e.key }));
//         props.popoverHide?.(); // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
//     };

//     const openMenu: any = (v: string[]) => {
//         setMenu((state) => ({ ...state, openKeys: v }));
//         tFirstHide.turnOff();
//     };

//     const sidebarStyle: React.CSSProperties = {
//         width: collapsed ? '0' : '165px', // 控制侧边栏宽度
//         overflowX: 'hidden', // 隐藏溢出内容
//         transition: 'width 0.3s ease', // 添加过渡效果
//     };

//     return (
//         <Sider
//             trigger={null}
//             breakpoint="lg"
//             collapsed={collapsed}
//             collapsedWidth={50}
//             width={165}
//             style={{
//                 ...sidebarStyle, // 使用新样式
//                 overflowY: 'auto',
//                 borderRight: '2px solid #E5E6EB',
//                 zIndex: 1,
//             }}
//         >
//             {/* Logo和Title的容器 */}
//             <div className="logo-title-container" 
//             style={{ padding: '1px,1px', margin: '0px,0px',display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
//                 <img src={logo} alt="Logo" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
//                 <h2 style={{ fontFamily: "'YouYuan', sans-serif", 
//                 fontWeight: 'bold',padding: '22px,6px', margin: '10px,0px', color: 'rgba(0, 0, 0, 0.85)', 
//                 display: 'flex', alignItems: 'center',fontSize:'16px' }}>Security Platform</h2>
//             </div>
//             <SiderMenu
//                 menus={[...routes.menus, ...smenus]}
//                 onClick={menuClick}
//                 mode="inline"
//                 selectedKeys={[menu.selectedKey]}
//                 openKeys={firstHide ? [] : menu.openKeys}
//                 onOpenChange={openMenu}
//             />
//             {/* <style>
//                 {`
//                     #nprogress .spinner{
//                         left: ${collapsed ? '70px' : '206px'};
//                         right: 0 !important;
//                     }
//                     `}
//             </style> */}
//         </Sider>
//     );
// };

// export default withRouter(SiderCustom);


import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import routes, { menuTheme } from '../../routes/config';
import SiderMenu from './SiderMenu';
import { useAlita } from 'redux-alita';
import { useSwitch } from '../../utils/hooks';
import { usePrevious } from 'ahooks';
import './SiderMenu.css'
import logo from '../../style/imgs/CSPG_dark.png';

const { Sider } = Layout;

const pagesWithoutSiderMenu = [
    '/app/detailspage',
    '/app/create_agent_task',
    '/app/create_virusscan_task',
    '/app/baseline_detail',
    '/app/virusscan_detail',
];

type SiderCustomProps = RouteComponentProps<any> & {
    popoverHide?: () => void;
    collapsed?: boolean;
    smenus?: any;
};

interface IMenu {
    openKeys: string[];
    selectedKey: string;
}

const SiderCustom = (props: SiderCustomProps) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [collapsed, tCollapsed] = useSwitch();
    const [firstHide, tFirstHide] = useSwitch();
    const [menu, setMenu] = useState<IMenu>({ openKeys: [''], selectedKey: '' });
    // 异步菜单
    const [smenus] = useAlita({ smenus: [] }, { light: true });
    const { location, collapsed: pCollapsed } = props;
    const prePathname = usePrevious(props.location.pathname);

    useEffect(() => {
        // 检查当前路由是否在pagesWithoutSiderMenu列表中
        const shouldCollapse = pagesWithoutSiderMenu.some(path => props.location.pathname.includes(path));

        // 如果当前路由不在列表中，则展开侧边栏
        if (!shouldCollapse) {
            setIsCollapsed(false); // 使用新的状态设置函数
        } else {
            setIsCollapsed(true); // 使用新的状态设置函数
        }

        const recombineOpenKeys = (openKeys: string[]) => {
            let i = 0;
            let strPlus = '';
            let tempKeys: string[] = [];
            // 多级菜单循环处理
            while (i < openKeys.length) {
                strPlus += openKeys[i];
                tempKeys.push(strPlus);
                i++;
            }
            return tempKeys;
        };

        const getOpenAndSelectKeys = () => {
            return {
                openKeys: recombineOpenKeys(location.pathname.match(/[/](\w+)/gi) || []),
                selectedKey: location.pathname,
            };
        };

        if (pCollapsed !== collapsed) {
            setMenu(getOpenAndSelectKeys());
            tCollapsed.setSwitcher(!!pCollapsed);
            tFirstHide.setSwitcher(!!pCollapsed);
        }

        if (prePathname !== location.pathname) {
            setMenu(getOpenAndSelectKeys());
        }
    }, [prePathname, location.pathname, collapsed, tFirstHide, tCollapsed, pCollapsed]);

    const menuClick = (e: any) => {
        setMenu((state) => ({ ...state, selectedKey: e.key }));
        props.popoverHide?.(); // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
    };

    const openMenu: any = (v: string[]) => {
        setMenu((state) => ({ ...state, openKeys: v }));
        tFirstHide.turnOff();
    };
    //左侧边栏Menu之外的背景颜色
    const sidebarStyle: React.CSSProperties = {
        width: collapsed ? '0' : '165px', // 控制侧边栏宽度
        overflowX: 'hidden', // 隐藏溢出内容
        transition: 'width 0.3s ease', // 添加过渡效果
        background: menuTheme.background, // 使用配置中的背景颜色
        color: menuTheme.color, // 使用配置中的字体颜色
    };
    return (
        <Sider
            trigger={null}
            breakpoint="lg"
            collapsed={collapsed && isCollapsed}
            collapsedWidth={0}
            width={165}
            style={{
                ...sidebarStyle, // 使用新样式
                overflowY: 'auto',
                borderRight: '2px solid #E5E6EB',
                zIndex: 1,
            }}
        >
            <div className="logo-title-container" style={{
                padding: '1px',
                margin: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img src={logo} alt="Logo" style={{ marginTop:'30px',zoom: 0.4 }} />
                {/*<h2 style={{
                    fontWeight: 'bold', padding: '22px', margin: '10px 0px', color: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex', alignItems: 'center', fontSize: '16px'
                }}>
                替换为一张南网图片</h2>*/}
            </div>

            {(
                <SiderMenu style={{//只对可以展开的Item生效，如资产中心，风险管理
                    marginTop: '20px',
                    // background: menuTheme.background, // 使用配置中的背景颜色
                    // color: menuTheme.color,
                }}
                           menus={[...routes.menus, ...smenus]}
                           onClick={menuClick}
                           mode="inline"
                           selectedKeys={[menu.selectedKey]}
                           openKeys={firstHide ? [] : menu.openKeys}
                           onOpenChange={openMenu}
                />
            )}
        </Sider>
    );
};

export default withRouter(SiderCustom);
