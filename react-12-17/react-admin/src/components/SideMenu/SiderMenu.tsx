// import React from 'react';
// import { Menu } from 'antd';
// import { Link } from 'react-router-dom';
// import { IFMenu } from '../../routes/config'; // 确保这个路径是正确的
// import { MenuProps } from 'antd/lib/menu';
//
// // 渲染单个菜单项
// const renderMenuItem = (
//     item: IFMenu // item.route 菜单单独跳转的路由
// ) => (//className="menu-item"
//     <Menu.Item key={item.key} >
//         <Link to={(item.route || item.key) + (item.query || '')}>
//             <span className="nav-text" style={{
//                 fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',}}>{item.title}</span>
//         </Link>
//     </Menu.Item>
// );
//
// // 渲染有子菜单的菜单项
// const renderSubMenu = (item: IFMenu) => {
//     return (
//         <Menu.SubMenu
//             key={item.key}
//             title={<span className="nav-text" style={{
//                 fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',}}>{item.title}</span>}
//             //className="submenu-item"
//         >
//             {item.subs!.map(renderMenu)}
//         </Menu.SubMenu>
//     );
// };
//
// // 递归渲染菜单项和子菜单
// const renderMenu = (item: IFMenu) => {
//     return item.subs && item.subs.length > 0
//         ? renderSubMenu(item)
//         : renderMenuItem(item);
// };
//
// // SiderMenu 组件和之前一样
//
//
// type SiderMenuProps = MenuProps & {
//     menus: IFMenu[];
// };
//
// const SiderMenu = ({ menus, ...props }: SiderMenuProps) => {
//     return (
//       <div className="sider-menu"> {/* 应用了带有轮廓线的样式 style={{fontSize: '13px',}}*/}
//         <Menu {...props} mode="inline" >
//           {menus.map(renderMenu)}
//         </Menu>
//       </div>
//     );
//   };
// export default React.memo(SiderMenu);
import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { IFMenu } from '../../routes/config'; // 确保这个路径是正确的
import { MenuProps } from 'antd/lib/menu';

// 渲染单个菜单项
const renderMenuItem = (
    item: IFMenu // item.route 菜单单独跳转的路由
) => (
    <Menu.Item key={item.key}>
        <Link to={(item.route || item.key) + (item.query || '')}>
            <span style={{
                fontFamily: '宋体, SimHei, Arial, sans-serif',
                // color: '#FFFFFF', // 常态字体颜色
            }}>{item.title}</span>
        </Link>
    </Menu.Item>
);

// 渲染有子菜单的菜单项
const renderSubMenu = (item: IFMenu) => {
    return (
        <Menu.SubMenu
            key={item.key}
            title={<span style={{
                fontFamily: '宋体, SimHei, Arial, sans-serif',
                color: '#FFFFFF', // 常态字体颜色
            }}>{item.title}</span>}
        >
            {item.subs!.map(renderMenu)}
        </Menu.SubMenu>
    );
};

// 递归渲染菜单项和子菜单
const renderMenu = (item: IFMenu) => {
    return item.subs && item.subs.length > 0
        ? renderSubMenu(item)
        : renderMenuItem(item);
};

// SiderMenu 组件
type SiderMenuProps = MenuProps & {
    menus: IFMenu[];
};

const SiderMenu = ({ menus, ...props }: SiderMenuProps) => {
    return (
        <div className="sider-menu">
            <Menu
                {...props}
                mode="inline"
                style={{
                    backgroundColor: '#002C6E', // 常态背景颜色
                }}
                theme="dark"
            >
                {menus.map(renderMenu)}
            </Menu>
        </div>
    );
};

export default React.memo(SiderMenu);
