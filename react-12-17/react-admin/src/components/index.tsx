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
import VulnerabilityList from './HostProtection/VulnerabilityList';
import BaselineDetectList from './HostProtection/BaselineDetectList';
import HostInventory from './AssetsCenter/HostInventory';
import AssetFingerprint from './AssetsCenter/AssetFingerprint';
import AuthBasic from './auth/Basic';
import RouterEnter from './auth/RouterEnter';
import VirusScanning from './VirusScanning/VirusScanning';
import VirusScanningWhiteList from './VirusScanning/VirusScanningWhiteList';
import MapUi from './ui/map';
//import MultipleMenu from './extension/MultipleMenu';
import Sub1 from './smenu/Sub1';
import Sub2 from './smenu/Sub2';
import Env from './env';
import DetailsPage from './DetailsPage/DetailsPage';
import CreateAgentTaskPage from './extension/CreateTaskPage'
import CreateVirusScanTaskPage from './VirusScanning/CreateVirusScanTask';
import BaseLineDetectDetailsPage from './DetailsPage/BaseLineDetectDetailsPage';
import VirusScanDetailsPage from './DetailsPage/VirusScanDetailsPage';
import UserManagement from './extension/UserManagement';
import HoneypotDefense from './HostProtection/HoneypotDefense';
import MemoryHorseDetection from './HostProtection/MemoryHorseDetection';
import ThreatHunting from './HostProtection/ThreatHunting';
import MicroIsolation from './HostProtection/MicroIsolation';
import ScheduleTask from './extension/ScheduleTask';
import TotalAlertList from './HostProtection/TotalAlertList';
import TotalWhiteList from './HostProtection/TotalWhiteList';


const WysiwygBundle = Loadable({
    // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    UserManagement,
    Dashboard,
    AssetFingerprint,
    HostInventory,

    AuthBasic,
    RouterEnter,
    WysiwygBundle,
    TotalAlertList,
    TotalWhiteList,
    VirusScanning,
    VirusScanningWhiteList,
    Env,
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
