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
        { key: '/app/Dashboard', title: '安全概览', icon: 'dashboard', component: 'Dashboard' },
        {
            key: '/app/AssetsCenter',
            title: '资产中心',
            icon: 'database',
            subs: [
                {
                    key: '/app/AssetsCenter/HostInventory',
                    title: '主机列表',
                    icon: 'desktop',
                    component: 'HostInventory',
                },
                {
                    key: '/app/AssetsCenter/AssetFingerprint',
                    title: '资产指纹',
                    icon: 'fingerprint',
                    component: 'AssetFingerprint',
                },
            ],
        },
        {
            key: '/app/HostProtection', //影响菜单下拉
            title: '主机防护',
            icon: 'shield',
            subs: [
                {
                    key: '/app/HostProtection/MicroIsolation',
                    title: '文件隔离',
                    icon: 'lock',
                    component: 'MicroIsolation',
                },
                {
                    key: '/app/HostProtection/memory-horse',
                    title: '内存马检测',
                    icon: 'bug',
                    component: 'MemoryHorseDetection'
                },
            ],
        },
        {
            key: '/app/RiskManagement', //影响菜单下拉
            title: '风险管理',
            icon: 'warning',
            subs: [
                {
                    key: '/app/RiskManagement/VulnerabilityList',
                    title: '漏洞检查',
                    icon: 'bug',
                    component: 'VulnerabilityList',
                },
                {
                    key: '/app/RiskManagement/BaselineDetectList',
                    title: '基线检查',
                    icon: 'check-circle',
                    component: 'BaselineDetectList',
                },
                {
                    key: '/app/RiskManagement/honeypot',
                    title: '蜜罐防御',
                    icon: 'experiment',
                    component: 'HoneypotDefense'
                },
            ],
        },
        {
            key: '/app/VirusScanning',
            title: '病毒扫描',
            icon: 'scan',
            component: 'VirusScanning',
        },
        {
            key: '/app/threat-hunting',
            title: '威胁狩猎',
            icon: 'radar-chart',
            component: 'ThreatHunting'
        },
        {
            key: '/app/Provenance',
            title: '攻击溯源',
            icon: 'provenance',
            component: 'Provenance'
        },
        {
            key: '/app/Management',
            title: '系统管理',
            icon: 'setting',
            subs: [
                {
                    key: '/app/Management/ScheduleTask',
                    title: '定时任务',
                    icon: 'clock-circle',
                    component: 'ScheduleTask',
                },
                {
                    key: '/app/Management/UserManagement',
                    title: '用户管理',
                    icon: 'user',
                    component: 'UserManagement',
                },
            ],
        },
        // {
        //     key: '/app/auth',
        //     title: '系统监控',
        //     icon: 'monitor',
        //     subs: [
        //         {
        //             key: '/app/detailspage',
        //             title: '详情页面',
        //             icon: 'file',
        //             component: 'DetailsPage', // 组件名称
        //         },
        //         {
        //             key: '/app/create_agent_task',
        //             title: '新建任务',
        //             icon: 'plus-circle',
        //             component: 'CreateAgentTaskPage', // 组件名称
        //         },
        //         {
        //             key: '/app/create_virusscan_task',
        //             title: '新建病毒扫描任务',
        //             icon: 'plus-circle',
        //             component: 'CreateVirusScanTaskPage', // 组件名称
        //         },
        //         {
        //             key: '/app/baseline_detail',
        //             title: '基线检查详情页面',
        //             icon: 'info-circle',
        //             component: 'BaseLineDetectDetailsPage', // 组件名称
        //         },
        //         {
        //             key: '/app/virusscan_detail',
        //             title: '病毒扫描详情页面',
        //             icon: 'info-circle',
        //             component: 'VirusScanDetailsPage', // 组件名称
        //         },
        //         {
        //             key: '/app/auth/basic',
        //             title: '基础演示',
        //             icon: 'appstore',
        //             component: 'AuthBasic'
        //         },
        //         {
        //             key: '/app/auth/routerEnter',
        //             title: '路由拦截',
        //             icon: 'block',
        //             component: 'RouterEnter',
        //             requireAuth: 'auth/testPage',
        //         },
        //     ],
        // },
    ],
    others: [
        {
            key: '/app/detailspage',
            title: '详情页面',
            icon: 'file',
            component: 'DetailsPage', // 组件名称
        },
        {
            key: '/app/create_agent_task',
            title: '新建任务',
            icon: 'plus-circle',
            component: 'CreateAgentTaskPage', // 组件名称
        },
        {
            key: '/app/create_virusscan_task',
            title: '新建病毒扫描任务',
            icon: 'plus-circle',
            component: 'CreateVirusScanTaskPage', // 组件名称
        },
        // {
        //     key: '/app/baseline_detail',
        //     title: '基线检查详情页面',
        //     icon: 'info-circle',
        //     component: 'BaseLineDetectDetailsPage', // 组件名称
        // },
        // {
        //     key: '/app/virusscan_detail',
        //     title: '病毒扫描详情页面',
        //     icon: 'info-circle',
        //     component: 'VirusScanDetailsPage', // 组件名称
        // },
    ], // 非菜单相关路由
};


export default menus;
