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
        { key: '/app/Dashboard', title: '安全概览', icon: 'mobile', component: 'Dashboard' },
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
            ],
        },
        {
            key: '/app/HostProtection', //影响菜单下拉
            title: '主机防护',
            icon: 'copy',
            subs: [
                // {
                //     key: '/app/HostProtection/TotalAlertList',
                //     title: '告警列表',
                //     component: 'TotalAlertList',
                // },
                {
                    key: '/app/HostProtection/MicroIsolation',
                    title: '文件隔离',
                    component: 'MicroIsolation',
                },
                {
                    key: '/app/HostProtection/memory-horse',
                    title: '内存马检测',
                    component: 'MemoryHorseDetection'
                },
                // {
                //     key: '/app/HostProtection/TotalWhiteList',
                //     title: '白名单',
                //     component: 'TotalWhiteList',
                // },
            ],
        },
        {
            key: '/app/RiskManagement', //影响菜单下拉
            title: '风险管理',
            icon: 'copy',
            subs: [
                {
                    key: '/app/RiskManagement/VulnerabilityList',
                    title: '漏洞检查',
                    component: 'VulnerabilityList',
                },
                {
                    key: '/app/RiskManagement/BaselineDetectList',
                    title: '基线检查',
                    component: 'BaselineDetectList',
                },
                { key: '/app/RiskManagement/honeypot', title: '蜜罐防御', component: 'HoneypotDefense' },
            ],
        },
        {
            key: '/app/VirusScanning',
            title: '病毒扫描',
            icon: 'star',
            subs: [
                {
                    key: '/app/VirusScanning/VirusScanning',
                    title: '病毒扫描',
                    component: 'VirusScanning',
                },
                {
                    key: '/app/VirusScanning/VirusScanningWhiteList',
                    title: '白名单',
                    component: 'VirusScanningWhiteList',
                },
            ],
        },
        
        // { key: '/app/honeypot', title: '蜜罐防御', component: 'HoneypotDefense' },
        { key: '/app/threat-hunting', title: '威胁分析', component: 'ThreatHunting' },
        {
            key: '/app/Management',
            title: '系统管理',
            icon: 'bars',
            subs: [
                {
                    key: '/app/Management/UserManagement',
                    title: '用户管理',
                    component: 'UserManagement',
                },
                {
                    key: '/app/Management/ScheduleTask',
                    title: '定时任务',
                    component: 'ScheduleTask',
                },
            ],
        },
        {
            key: '/app/auth',
            title: '系统监控',
            icon: 'safety',
            subs: [
                {
                    key: '/app/detailspage', 
                    title: '详情页面',
                    component: 'DetailsPage', // 组件名称
                    // 额外的配置项，如果有的话...
                },
                {
                    key: '/app/create_agent_task', 
                    title: '新建任务',
                    component: 'CreateAgentTaskPage', // 组件名称
                    // 额外的配置项，如果有的话...
                },
                {
                    key: '/app/create_virusscan_task', 
                    title: '新建病毒扫描任务',
                    component: 'CreateVirusScanTaskPage', // 组件名称
                    // 额外的配置项，如果有的话...
                },
                {
                    key: '/app/baseline_detail', 
                    title: '基线检查详情页面',
                    component: 'BaseLineDetectDetailsPage', // 组件名称
                    // 额外的配置项，如果有的话...
                },
                {
                    key: '/app/virusscan_detail', 
                    title: '病毒扫描详情页面',
                    component: 'VirusScanDetailsPage', // 组件名称
                    // 额外的配置项，如果有的话...
                },
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
    others: [
        {
            key: '/app/detailspage', 
            title: '详情页面',
            component: 'DetailsPage', // 组件名称
            // 额外的配置项，如果有的话...
        },
        {
            key: '/app/create_agent_task', 
            title: '新建任务',
            component: 'CreateAgentTaskPage', // 组件名称
            // 额外的配置项，如果有的话...
        },
        {
            key: '/app/create_virusscan_task', 
            title: '新建病毒扫描任务',
            component: 'CreateVirusScanTaskPage', // 组件名称
            // 额外的配置项，如果有的话...
        },
        {
            key: '/app/baseline_detail', 
            title: '基线检查详情页面',
            component: 'baseline_detail_age', // 组件名称
            // 额外的配置项，如果有的话...
        },
        {
            key: '/app/virusscan_detail', 
            title: '病毒扫描详情页面',
            component: 'virus_detail_age', // 组件名称
            // 额外的配置项，如果有的话...
        },
    ], // 非菜单相关路由
};

export default menus;

                //     key: '/app/Management/queryParams',
                //     title: '问号形式参数',
                //     component: 'QueryParams',
                //     query: '?param1=1&param2=2',
                // },
                // {
                //     key: '/app/Management/visitor',
                //     title: '访客模式',
                //     component: 'Visitor',
                //     login: true,
                // },
                // {
                //     key: '/app/Management/multiple',
                //     title: '多级菜单',
                //     subs: [
                //         {
                //             key: '/app/Management/multiple/child',
                //             title: '多级菜单子菜单',
                //             subs: [
                //                 {
                //                     key: '/app/Management/multiple/child/child',
                //                     title: '多级菜单子子菜单',
                //                     component: 'MultipleMenu',
                //                 },
                //             ],
                //         },
                //     ],
                // },
                // {
                //     key: '/app/Management/env',
                //     title: '环境配置',
                //     component: 'Env',
                // },


 // {
        //     key: '/app/ARP',
        //     title: '应用运行时防护',
        //     icon: 'area-chart',
        //     subs: [
        //         { key: '/app/ARP/status', title: '运行状态', component: 'status' },
        //         { key: '/app/ARP/configuration', title: '配置管理', component: 'configuration' },
        //         {
        //             key: '/app/ARP/InvasionDetect',
        //             title: '入侵检测',
        //             subs: [
        //                 {
        //                     key: '/app/ARP/InvasionDetect/ARPAlertList',
        //                     title: '告警列表',
        //                     component: 'ARPAlertList',
        //                 },
        //                 {
        //                     key: '/app/ARP/InvasionDetect/ARPWhiteList',
        //                     title: '白名单',
        //                     component: 'ARPWhiteList',
        //                 },
        //             ],
        //         },

        //     ],
        // },
        // {
        //     key: '/app/CCP',
        //     title: '容器集群防护',
        //     icon: 'switcher',
        //     subs: [
        //         {
        //             key: '/app/CCP/InvasionDetect',
        //             title: '入侵检测',
        //             subs: [
        //                 {
        //                     key: '/app/CCP/InvasionDetect/CCPAlertList',
        //                     title: '告警列表',
        //                     component: 'CCPAlertList',
        //                 },
        //                 {
        //                     key: '/app/CCP/InvasionDetect/CCPWhiteList',
        //                     title: '白名单',
        //                     component: 'CCPWhiteList',
        //                 },
        //             ],
        //         },
        //     ],
        // },
        // {
        //     key: '/app/auth',
        //     title: '权限管理',
        //     icon: 'safety',
        //     subs: [
        //         { key: '/app/auth/basic', title: '基础演示', component: 'AuthBasic' },
        //         {
        //             key: '/app/auth/routerEnter',
        //             title: '路由拦截',
        //             component: 'RouterEnter',
        //             requireAuth: 'auth/testPage',
        //         },
        //     ],
        // },
        // {
        //     key: '/app/VirusScanning',
        //     title: '病毒扫描',
        //     icon: 'star',
        //     component: 'VirusScanning',
        // },
        // {
        //     key: '/app/detailspage', 
        //     title: '详情页面',
        //     component: 'DetailsPage', // 组件名称
        //     // 额外的配置项，如果有的话...
        // },