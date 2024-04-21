/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';
import Echarts from './charts/Echarts';
import Recharts from './charts/Recharts';
import Icons from './ui/Icons';
import Buttons from './ui/Buttons';
import Spins from './ui/Spins';
import Modals from './ui/Modals';
import Notifications from './ui/Notifications';
import Tabs from './ui/Tabs';
import Banners from './ui/banners';
import Drags from './ui/Draggable';
import Dashboard from './Dashboard/Dashboard'
import HCPAlertList from './HostProtection/HostAlertList';
import HCPWhiteList from './HostProtection/HostWhiteList';
import ARPAlertList from './ARP/ARPAlertList';
import ARPWhiteList from './ARP/ARPWhiteList';
import CCPAlertList from './CCP/CCPAlertList';
import CCPWhiteList from './CCP/CCPWhiteList';
import configuration from './ARP/configuration';
import status from './ARP/status';
import VulnerabilityList from './HostProtection/VulnerabilityList';
import BaselineDetectList from './HostProtection/BaselineDetectList';
import HostInventory from './AssetsCenter/HostInventory';
//import ContainerCluster from './AssetsCenter/ContainerCluster'
import AssetFingerprint from './AssetsCenter/AssetFingerprint';
import AuthBasic from './auth/Basic';
import RouterEnter from './auth/RouterEnter';
import VirusScanning from './VirusScanning/VirusScanning';
import VirusScanningWhiteList from './VirusScanning/VirusScanningWhiteList';
import MapUi from './ui/map';
import QueryParams from './extension/QueryParams';
import Visitor from './extension/Visitor';
//import MultipleMenu from './extension/MultipleMenu';
import Sub1 from './smenu/Sub1';
import Sub2 from './smenu/Sub2';
import Env from './env';
import DetailsPage from './DetailsPage/DetailsPage';
import CreateAgentTaskPage from './pages/CreateTaskPage';
import CreateVirusScanTaskPage from './VirusScanning/CreateVirusScanTask';
import BaseLineDetectDetailsPage from './DetailsPage/BaseLineDetectDetailsPage';
import VirusScanDetailsPage from './DetailsPage/VirusScanDetailsPage';
import UserManagement from './extension/UserManagement';
import HoneypotDefense from './HostProtection/HoneypotDefense';
import MemoryHorseDetection from './HostProtection/MemoryHorseDetection';
import ThreatHunting from './HostProtection/ThreatHunting';
import MicroIsolation from './HostProtection/MicroIsolation';
import ScheduleTask from './extension/ScheduleTask';

const WysiwygBundle = Loadable({
    // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    UserManagement,
    Echarts,
    Recharts,
    Icons,
    Buttons,
    Spins,
    Modals,
    Notifications,
    Tabs,
    Banners,
    Drags,
    Dashboard,
    AssetFingerprint,
    HostInventory,
    //ContainerCluster,
    AuthBasic,
    RouterEnter,
    WysiwygBundle,
    VirusScanning,
    VirusScanningWhiteList,
    MapUi,
    QueryParams,
    Visitor,
    //MultipleMenu,
    Sub1,
    Sub2,
    Env,
    HCPAlertList,
    HCPWhiteList,
    ARPAlertList,
    ARPWhiteList,
    CCPAlertList,
    CCPWhiteList,
    configuration,
    status,
    VulnerabilityList,
    BaselineDetectList,
    DetailsPage,
    CreateAgentTaskPage,
    CreateVirusScanTaskPage,
    BaseLineDetectDetailsPage,
    VirusScanDetailsPage,
    HoneypotDefense,
    MemoryHorseDetection,
    ThreatHunting,
    MicroIsolation,
    ScheduleTask,
} as any;
