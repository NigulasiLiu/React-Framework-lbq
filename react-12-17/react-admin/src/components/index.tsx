/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';
import Dashboard from './Dashboard/Dashboard'
import VulnerabilityList from './RiskManagement/VulnerabilityList';
import BaselineDetectList from './RiskManagement/BaselineDetectList';
import HostInventory from './AssetsCenter/HostInventory';
import AssetFingerprint from './AssetsCenter/AssetFingerprint';
import AuthBasic from './auth/Basic';
import Provenance from './Provenance/ProvenanceMain';
import VirusScanning from './VirusScanning/VirusScanning';
import Env from './env';
import DetailsPage from './DetailsPage/DetailsPage';
import CreateAgentTaskPage from './Management/CreateTaskPage'
import CreateVirusScanTaskPage from './VirusScanning/CreateVirusScanTask';
import BaseLineDetectDetailsPage from './DetailsPage/BaseLineDetectDetailsPage';
import VirusScanDetailsPage from './DetailsPage/VirusScanDetailsPage';
import UserManagement from './Management/UserManagement';
import HoneypotDefense from './RiskManagement/HoneypotDefense';
import MemoryShell from './HostProtection/MemoryShell';
import ThreatHunting from './HostProtection/ThreatHunting';
import MicroIsolation from './HostProtection/MicroIsolation';
import ScheduleTask from './Management/ScheduleTask';
import InstantTask from './Management/InstantTask';


const WysiwygBundle = Loadable({
    // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    UserManagement,
    InstantTask,
    Dashboard,
    AssetFingerprint,
    HostInventory,
    Provenance,
    WysiwygBundle,
    VirusScanning,
    Env,
    VulnerabilityList,
    BaselineDetectList,
    DetailsPage,
    CreateAgentTaskPage,
    CreateVirusScanTaskPage,
    BaseLineDetectDetailsPage,
    VirusScanDetailsPage,
    HoneypotDefense,
    MemoryHorseDetection: MemoryShell,
    ThreatHunting,
    MicroIsolation,
    ScheduleTask,
} as any;
