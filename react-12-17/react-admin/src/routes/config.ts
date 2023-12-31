export interface IFMenuBase {
    key: string;
    title: string;
    icon?: string;
    component?: string;
    query?: string;
    requireAuth?: string;
    route?: string;
    /** 是否登录校验，true不进行校验（访客） */
    login?: boolean;
}

export interface IFMenu extends IFMenuBase {
    subs?: IFMenu[];
}

const menus: {
    menus: IFMenu[];
    others: IFMenu[] | [];
    [index: string]: any;
} = {
    menus: [
        // 菜单相关路由
        { key: '/app/dashboard/index', title: '安全概览', icon: 'mobile', component: 'Dashboard' },
        {
            key: '/app/AssetsCenter',
            title: '资产中心',
            icon: 'rocket',
            subs: [
                {
                    key: '/app/AssetsCenter/HostInventory',
                    title: '主机列表',
                    component: 'HostInventory',
                },
                {
                    key: '/app/AssetsCenter/AssetFingerprint',
                    title: '资产指纹',
                    component: 'AssetFingerprint',
                },
                {
                    key: '/app/AssetsCenter/ContainerCluster',
                    title: '容器集群',
                    component: 'ContainerCluster',
                },
            ],
        },
        {
            key: '/app/hcp', //影响菜单下拉
            title: '主机和容器防护',
            icon: 'copy',
            subs: [
                {
                    key: '/app/hcp/rqjc',
                    title: '入侵检测',
                    subs: [
                        {
                            key: '/app/hcp/rqjc/gjlb',
                            title: '告警列表',
                            component: 'hcpgjlb',
                        },
                        {
                            key: '/app/hcp/rqjc/bmd',
                            title: '白名单',
                            component: 'hcpbmd',
                        },
                    ],
                },
                {
                    key: '/app/hcp/fxff',
                    title: '风险防范',
                    subs: [
                        {
                            key: '/app/hcp/fxff/Ldlb',
                            title: '漏洞列表',
                            component: 'Ldlb',
                        },
                        {
                            key: '/app/hcp/fxff/jxjc',
                            title: '基线检查',
                            component: 'jxjc',
                        },
                    ],
                },
            ],
        },
        {
            key: '/app/ARP',
            title: '应用运行时防护',
            icon: 'area-chart',
            subs: [
                { key: '/app/ARP/status', title: '运行状态', component: 'status' },
                { key: '/app/ARP/configuration', title: '配置管理', component: 'configuration' },
                {
                    key: '/app/ARP/rqjc',
                    title: '入侵检测',
                    subs: [
                        {
                            key: '/app/ARP/rqjc/gjlb',
                            title: '告警列表',
                            component: 'ARPgjlb',
                        },
                        {
                            key: '/app/ARP/rqjc/bmd',
                            title: '白名单',
                            component: 'ARPbmd',
                        },
                    ],
                },

            ],
        },
        {
            key: '/app/CCP',
            title: '容器集群防护',
            icon: 'switcher',
            subs: [
                {
                    key: '/app/CCP/rqjc',
                    title: '入侵检测',
                    subs: [
                        {
                            key: '/app/CCP/rqjc/gjlb',
                            title: '告警列表',
                            component: 'CCPgjlb',
                        },
                        {
                            key: '/app/CCP/rqjc/bmd',
                            title: '白名单',
                            component: 'CCPbmd',
                        },
                    ],
                },
            ],
        },
        {
            key: '/app/auth',
            title: '权限管理',
            icon: 'safety',
            subs: [
                { key: '/app/auth/basic', title: '基础演示', component: 'AuthBasic' },
                {
                    key: '/app/auth/routerEnter',
                    title: '路由拦截',
                    component: 'RouterEnter',
                    requireAuth: 'auth/testPage',
                },
            ],
        },
        {
            key: '/app/VirusScanning',
            title: '病毒扫描',
            icon: 'star',
            component: 'VirusScanning',
        },
        {
            key: '/app/extension',
            title: '系统管理',
            icon: 'bars',
            subs: [
                {
                    key: '/app/extension/queryParams',
                    title: '问号形式参数',
                    component: 'QueryParams',
                    query: '?param1=1&param2=2',
                },
                {
                    key: '/app/extension/visitor',
                    title: '访客模式',
                    component: 'Visitor',
                    login: true,
                },
                {
                    key: '/app/extension/multiple',
                    title: '多级菜单',
                    subs: [
                        {
                            key: '/app/extension/multiple/child',
                            title: '多级菜单子菜单',
                            subs: [
                                {
                                    key: '/app/extension/multiple/child/child',
                                    title: '多级菜单子子菜单',
                                    component: 'MultipleMenu',
                                },
                            ],
                        },
                    ],
                },
                {
                    key: '/app/extension/env',
                    title: '环境配置',
                    component: 'Env',
                },
            ],
        },
        {
            key: '/app/auth',
            title: '系统监控',
            icon: 'safety',
            subs: [
                { key: '/app/auth/basic', title: '基础演示', component: 'AuthBasic' },
                {
                    key: '/app/auth/routerEnter',
                    title: '路由拦截',
                    component: 'RouterEnter',
                    requireAuth: 'auth/testPage',
                },
            ],
        },
    ],
    others: [], // 非菜单相关路由
};

export default menus;
