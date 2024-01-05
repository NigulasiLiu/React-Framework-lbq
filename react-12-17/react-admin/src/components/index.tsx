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
import Dashboard from './dashboard/Dashboard';
import hcpgjlb from './hcp/gjlb';
import hcpbmd from './hcp/bmd';
import ARPgjlb from './ARP/rqjc/gjlb';
import ARPbmd from './ARP/rqjc/bmd';
import CCPgjlb from './CCP/rqjc/gjlb';
import CCPbmd from './CCP/rqjc/bmd';
import configuration from './ARP/configuration';
import status from './ARP/status';
import Ldlb from './hcp/Ldlb';
import jxjc from './hcp/jxjc';
import HostInventory from './AssetsCenter/HostInventory';
import ContainerCluster from './AssetsCenter/ContainerCluster'
import AssetFingerprint from './AssetsCenter/AssetFingerprint';
import AuthBasic from './auth/Basic';
import RouterEnter from './auth/RouterEnter';
import VirusScanning from './cssmodule';
import MapUi from './ui/map';
import QueryParams from './extension/QueryParams';
import Visitor from './extension/Visitor';
import MultipleMenu from './extension/MultipleMenu';
import Sub1 from './smenu/Sub1';
import Sub2 from './smenu/Sub2';
import Env from './env';

const WysiwygBundle = Loadable({
    // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
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
    ContainerCluster,
    AuthBasic,
    RouterEnter,
    WysiwygBundle,
    VirusScanning,
    MapUi,
    QueryParams,
    Visitor,
    MultipleMenu,
    Sub1,
    Sub2,
    Env,
    hcpgjlb,
    hcpbmd,
    ARPgjlb,
    ARPbmd,
    CCPgjlb,
    CCPbmd,
    configuration,
    status,
    Ldlb,
    jxjc
} as any;
