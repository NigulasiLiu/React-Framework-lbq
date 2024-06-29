// src/components/DataManager.tsx
import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { templateData } from './SeperateData';
import CustomNotification from '../ui/CustomNotification';
import useSortedData from './TopFiveDataProvider';
import { convertAndFillData } from './SeperateData';
import { DataItem } from '../Columns';
import useExtractOrigin, {
    MetaDataResult, getTopFiveTypeCounts,
    getPastSevenDaysAlerts,
} from './ExtractOriginData';
import useAggregateUUIDs from './useAggregateUUIDs';
import { fetchDataFromAPI } from './DataService';
import { FilteredDataResult_new } from './useFilterOriginData_new';
import useTransformedData from '../HostProtection/useTransformedData';
import useCalculateAverage from './useCalculateAverage';
import { processData } from './DataService';
import {
    Agent_Data_API,
    Monitor_Data_API,
    Fim_Data_API,
    Vul_Data_API,
    Port_Data_API,
    Process_Data_API,
    Assets_Data_API,
    BaseLine_linux_Data_API,
    BaseLine_windows_Data_API,
    Task_Data_API,
    MemoryShell_API,
    Honey_API,
    Brute_TTPs_API,
    Privilege_TTPs_API,
    Defense_TTPs_API,
    Virus_Data_API,
    Isolate_Data_API,
    User_Data_API, interval_slow, interval_fast,
} from '../../service/config';
import ReactDOM from 'react-dom';


export interface DataContextType {
    refreshDataFromAPI: (apiEndpoint: string) => Promise<void>;

    fetchLatestData: (apiEndpoint: string,
                      searchField?: string, searchQuery?: string, rangeQuery?: string,
                      timeColumnIndex?: string[]) => Promise<any>;

    topFiveFimData: DataItem[];
    topFivePortCounts: DataItem[];

    agentOriginData: any[];

    monitoredOriginData: any[];
    fimOriginData: any[];

    agentSearchResults?: any[];
    portOriginData: any[];
    processOriginData: any[];
    assetOriginData: any[];
    linuxBaseLineCheckOriginData: any[];
    windowsBaseLineCheckOriginData: any[];
    vulnOriginData: any[];
    taskDetailsOriginData: any[];
    memHorseOriginData: any[];
    honeyPotOriginData: any[];

    bruteforceTTPsOriginData: any[];
    privilegeescalationTTPsOriginData: any[];
    defenseavoidanceTTPsOriginData: any[];

    usersOriginData: any[];
    virusOriginData: any[];
    isolationOriginData: any[];

    agentMetaData_status: MetaDataResult;
    fimMetaData_hostname: MetaDataResult;
    portMetaData_port_state: MetaDataResult;
    portMetaData_port_number: MetaDataResult;

    processMetaData_userName: MetaDataResult;
    topFiveProcessCounts: DataItem[];
    topFiveUserCounts: DataItem[];

    assetMetaData_service: MetaDataResult;
    assetMetaData_product: MetaDataResult;
    assetMetaData_os_version: MetaDataResult;

    topFiveServiceCounts: DataItem[];
    topFiveProductCounts: DataItem[];

    linuxBaseLineCheckMetaData_uuid: MetaDataResult;
    linuxBaseLineCheckMetaData_status: MetaDataResult;
    windowsBaseLineCheckMetaData_uuid: MetaDataResult;

    vulnMetaData_uuid: MetaDataResult;
    last7VulValue: number[];

    last7brutForceValue: number[];
    last7privValue: number[];
    last7defenceForceValue: number[];

    last7VirusValue: number[];

    last7HoneyPotValue: number[];

    transformedData: FilteredDataResult_new[],


    hostCount: number;
    vulnHostCount: number;
    blLinuxHostCount: number;
    blWindowsHostCount: number;

    TTPsHostCount: number;
    VirusHostCount: number;
    HoneyPotHostCount: number;


    blLinuxCheckNameCount: number;
    blWindowsCheckNameCount: number;

    blLinuxNeedAdjustmentItemCount: number | undefined;
    blWindowsNeedAdjustmentItemCount: number | undefined;
    blLinuxNeedAdjustmentItemCount_pass: number;
    blWindowsNeedAdjustmentItemCount_pass: number;

    agentOnlineCount: number;
    agentCPUuseMetaData: MetaDataResult;
    agentAVGCPUUse: string;
    agentMEMuseMetaData: MetaDataResult;
    agentAVGMEMUse: string;

    bruteforceTTPsMetaData_uuid: MetaDataResult;
    privilegeescalationTTPsMetaData_uuid: MetaDataResult;
    defenseavoidanceTTPsMetaData_uuid: MetaDataResult;
    VirusMetaData_uuid: MetaDataResult;
    HoneyPotMetaData_uuid: MetaDataResult;

    //agentOriginData_2:Map<string, AgentInfoType>|undefined;
};
export const DataContext = createContext<DataContextType | undefined>(undefined);

interface SetDataFunctions {
    [key: string]: Dispatch<SetStateAction<any>>;
}
// API 端点和全局变量名称的映射表
const apiEndpointToVariableName: { [key: string]: string } = {
    [Agent_Data_API as string]: 'Agent_Data_API',
    [Monitor_Data_API as string]: 'Monitor_Data_API',
    [Fim_Data_API as string]: 'Fim_Data_API',
    [Vul_Data_API as string]: 'Vul_Data_API',
    [Port_Data_API as string]: 'Port_Data_API',
    [Process_Data_API as string]: 'Process_Data_API',
    [Assets_Data_API as string]: 'Assets_Data_API',
    [BaseLine_linux_Data_API as string]: 'BaseLine_linux_Data_API',
    [BaseLine_windows_Data_API as string]: 'BaseLine_windows_Data_API',
    [Task_Data_API as string]: 'Task_Data_API',
    [MemoryShell_API as string]: 'MemoryShell_API',
    [Honey_API as string]: 'Honey_API',
    [Brute_TTPs_API as string]: 'Brute_TTPs_API',
    [Privilege_TTPs_API as string]: 'Privilege_TTPs_API',
    [Defense_TTPs_API as string]: 'Defense_TTPs_API',
    [User_Data_API as string]: 'User_Data_API',
    [Virus_Data_API as string]: 'Virus_Data_API',
    [Isolate_Data_API as string]: 'Isolate_Data_API',
};


const DataManager: React.FC = ({ children }) => {
    const [agentOriginData, setAgentOriginData] = useState<any>([]);
    const [taskDetailsOriginData, settaskDetailsOriginData] = useState<any>([]);

    const [monitoredOriginData, setMonitoredOriginData] = useState<any>([]);
    const [fimOriginData, setFimOriginData] = useState<any>([]);

    const [portOriginData, setPortOriginData] = useState<any>([]);
    const [processOriginData, setProcessOriginData] = useState<any>([]);
    const [assetOriginData, setAssetOriginData] = useState<any>([]);
    const [linuxBaseLineCheckOriginData, setlinuxBLCheckOriginData] = useState<any>([]);
    const [windowsBaseLineCheckOriginData, setwindowsBLCheckOriginData] = useState<any>([]);

    const [vulnOriginData, setVulnOriginData] = useState<any>([]);

    const [memHorseOriginData, setmemHorseOriginData] = useState<any>([]);
    const [honeyPotOriginData, sethoneyPotOriginData] = useState<any>([]);

    const [bruteforceTTPsOriginData, setbruteforceTTPsOriginData] = useState<any>([]);
    const [privilegeescalationTTPsOriginData, setprivilegeescalationTTPsOriginData] = useState<any>([]);
    const [defenseavoidanceTTPsOriginData, setdefenseavoidanceTTPsOriginData] = useState<any>([]);

    const [usersOriginData, setUsersOriginData] = useState<any>([]);
    const [virusOriginData, setVirusOriginData] = useState<any>([]);
    const [isolationOriginData, setIsolationOriginData] = useState<any>([]);
    // 数据更新函数映射表
    const setDataFunctions: SetDataFunctions = {
        [Agent_Data_API as string]: setAgentOriginData,
        [Monitor_Data_API as string]: setMonitoredOriginData,
        [Fim_Data_API as string]: setFimOriginData,
        [Vul_Data_API as string]: setVulnOriginData,
        [Port_Data_API as string]: setPortOriginData,
        [Process_Data_API as string]: setProcessOriginData,
        [Assets_Data_API as string]: setAssetOriginData,
        [BaseLine_linux_Data_API as string]: setlinuxBLCheckOriginData,
        [BaseLine_windows_Data_API as string]: setwindowsBLCheckOriginData,
        [Task_Data_API as string]: settaskDetailsOriginData,
        [MemoryShell_API as string]: setmemHorseOriginData,
        [Honey_API as string]: sethoneyPotOriginData,

        [Brute_TTPs_API as string]: setbruteforceTTPsOriginData,
        [Privilege_TTPs_API as string]: setprivilegeescalationTTPsOriginData,
        [Defense_TTPs_API as string]: setdefenseavoidanceTTPsOriginData,

        [User_Data_API as string]: setUsersOriginData,

        [Virus_Data_API as string]: setVirusOriginData,
        [Isolate_Data_API as string]: setIsolationOriginData,
        // 添加其他API端点和对应的设置函数
    };

    // 通用的数据刷新函数
    const refreshDataFromAPI = async (apiEndpoint: string) => {
        try {
            const data = await fetchDataFromAPI({ apiEndpoint });
            // 根据API端点调用对应的设置状态函数
            const setDataFunction = setDataFunctions[apiEndpoint];
            //用于notification显示的字符串
            const variableName = apiEndpointToVariableName[apiEndpoint];
            if (setDataFunction) {
                setDataFunction(data); // 更新状态
                // message.success(apiEndpoint + ' Data refreshed successfully');
                // CustomNotification.successNotification(variableName);

            } else {
                console.error('No matching function found for the API endpoint');
                CustomNotification.openNotification('error', `No matching function found for the API endpoint ${variableName}`);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // message.error('获取接口' + { apiEndpoint } + '数据失败');
            CustomNotification.openNotification2('error', `获取接口 ${apiEndpointToVariableName[apiEndpoint]} 数据失败`);
        }
    };

    useEffect(() => {

        refreshDataFromAPI(Agent_Data_API);

        refreshDataFromAPI(Monitor_Data_API);
        refreshDataFromAPI(Fim_Data_API);

        refreshDataFromAPI(Port_Data_API);
        refreshDataFromAPI(Process_Data_API);
        refreshDataFromAPI(Assets_Data_API);
        refreshDataFromAPI(BaseLine_linux_Data_API);
        refreshDataFromAPI(BaseLine_windows_Data_API);
        refreshDataFromAPI(Vul_Data_API);
        refreshDataFromAPI(Task_Data_API);
        refreshDataFromAPI(MemoryShell_API);
        refreshDataFromAPI(Honey_API);

        refreshDataFromAPI(Brute_TTPs_API);
        refreshDataFromAPI(Privilege_TTPs_API);
        refreshDataFromAPI(Defense_TTPs_API);


        refreshDataFromAPI(User_Data_API);
        refreshDataFromAPI(Isolate_Data_API);

        refreshDataFromAPI(Virus_Data_API);


        const interval_1 = setInterval(() => {
            refreshDataFromAPI(Agent_Data_API);
            refreshDataFromAPI(Monitor_Data_API);
            refreshDataFromAPI(Fim_Data_API);
            refreshDataFromAPI(Port_Data_API);
            refreshDataFromAPI(Process_Data_API);
            refreshDataFromAPI(Assets_Data_API);
            refreshDataFromAPI(User_Data_API);
            refreshDataFromAPI(Task_Data_API);
            // refreshDataFromAPI(BaseLine_linux_Data_API);
            // refreshDataFromAPI(BaseLine_windows_Data_API);
            // refreshDataFromAPI(Vul_Data_API);
            // refreshDataFromAPI(Virus_Data_API);
            // refreshDataFromAPI(MemoryShell_API);
            // refreshDataFromAPI(Honey_API);
            // refreshDataFromAPI(Brute_TTPs_API);
            // refreshDataFromAPI(Privilege_TTPs_API);
            // refreshDataFromAPI(Defense_TTPs_API);
            // refreshDataFromAPI(Isolate_Data_API);
        }, interval_fast); // 240s,4min

        const interval_2 = setInterval(() => {
            refreshDataFromAPI(BaseLine_linux_Data_API);
            refreshDataFromAPI(BaseLine_windows_Data_API);
            refreshDataFromAPI(Vul_Data_API);
            refreshDataFromAPI(Virus_Data_API);
            refreshDataFromAPI(MemoryShell_API);
            refreshDataFromAPI(Honey_API);
            refreshDataFromAPI(Brute_TTPs_API);
            refreshDataFromAPI(Privilege_TTPs_API);
            refreshDataFromAPI(Defense_TTPs_API);
            refreshDataFromAPI(Isolate_Data_API);
        }, interval_slow); // 960s,16min

        return () => {
            clearInterval(interval_1);
            clearInterval(interval_2);
        };

    }, []);

    const fetchLatestData = async (apiEndpoint: string, searchField = '', searchQuery = '', rangeQuery = '', timeColumnIndex: string[] = []) => {
        try {
            // 修改queryParams的构造逻辑
            let finalEndpoint = `${apiEndpoint}`;
            console.log('finalEndpoint:' + finalEndpoint);
            const rawData = await fetchDataFromAPI({ apiEndpoint: finalEndpoint });
            // 检查message字段是否是数组，如果不是，则将其转换为包含该对象的数组
            const messageData = Array.isArray(rawData) ? rawData : [rawData];
            const processedData = processData(messageData, timeColumnIndex);
            return processedData;
        } catch (error) {
            console.error('Error fetching data:', error);
            return []; // 在出错时返回空数组或适当的错误处理
        }
    };

    //agent信息
    const agentMetaData_status = useExtractOrigin('status', agentOriginData);//各类status主机的数量
    const agentOnlineCount = agentMetaData_status.typeCount.get('Online') || -1;

    const agentCPUuseMetaData = useExtractOrigin('cpu_use', agentOriginData);//各类status主机的数量
    const agentMEMuseMetaData = useExtractOrigin('mem_use', agentOriginData);//各类status主机的数量
    const agentAVGCPUUse = (((useCalculateAverage('cpu_use', agentOriginData).average) || 0) * 100).toString().slice(0, 4) + '%';
    const agentAVGMEMUse = (((useCalculateAverage('mem_use', agentOriginData).average) || 0) * 100).toString().slice(0, 4) + 'GB';


    //完整性检验信息
    const fimMetaData_hostname = useExtractOrigin('hostname', fimOriginData);
    const topFiveFimData = useSortedData('filename', 'event_time', Fim_Data_API); // 这将返回DataItem[]类型的数据


    //端口信息
    const portMetaData_port_state = useExtractOrigin('port_state', portOriginData);
    const portMetaData_port_number = useExtractOrigin('port_number', portOriginData);
    const topFivePortCountsArray = getTopFiveTypeCounts(portMetaData_port_number);

    //运行进程信息
    const processMetaData_userName = useExtractOrigin('userName', processOriginData);
    const topFiveUserCountsArray = getTopFiveTypeCounts(processMetaData_userName);
    const processMetaData_name = useExtractOrigin('name', processOriginData);
    const topFiveProcessCountsArray = getTopFiveTypeCounts(processMetaData_name);

    //资产测绘信息
    const assetMetaData_service = useExtractOrigin('service', assetOriginData);
    const assetMetaData_product = useExtractOrigin('product', assetOriginData);
    const assetMetaData_os_version = useExtractOrigin('os_version', assetOriginData);

    //系统服务，系统应用信息
    const topFiveServiceCountsArray = getTopFiveTypeCounts(assetMetaData_service);
    const topFiveProductCountsArray = getTopFiveTypeCounts(assetMetaData_product);

    //基线检查信息
    const linuxBaseLineCheckMetaData_uuid = useExtractOrigin('uuid', linuxBaseLineCheckOriginData);
    const linuxBaseLineCheckMetaData_check_name = useExtractOrigin('check_name', linuxBaseLineCheckOriginData);
    const linuxBaseLineCheckMetaData_adjustment_requirement = useExtractOrigin('adjustment_requirement', linuxBaseLineCheckOriginData);
    const linuxBaseLineCheckMetaData_status = useExtractOrigin('status', linuxBaseLineCheckOriginData);

    const windowsBaseLineCheckMetaData_uuid = useExtractOrigin('uuid', windowsBaseLineCheckOriginData);
    const windowsBaseLineCheckMetaData_check_name = useExtractOrigin('check_name', windowsBaseLineCheckOriginData);
    const windowsBaseLineCheckMetaData_adjustment_requirement = useExtractOrigin('adjustment_requirement', windowsBaseLineCheckOriginData);

    const blLinuxHostCount = linuxBaseLineCheckMetaData_uuid.typeCount.size;
    const blWindowsHostCount = windowsBaseLineCheckMetaData_uuid.typeCount.size;
    const blLinuxCheckNameCount = linuxBaseLineCheckMetaData_check_name.tupleCount;
    const blWindowsCheckNameCount = windowsBaseLineCheckMetaData_check_name.tupleCount;

    const blLinuxNeedAdjustmentItemCount = linuxBaseLineCheckMetaData_adjustment_requirement.typeCount.get('建议调整') || 0;
    const blWindowsNeedAdjustmentItemCount = windowsBaseLineCheckMetaData_adjustment_requirement.typeCount.get('建议调整') || 0;

    const blLinuxNeedAdjustmentItemCount_pass = linuxBaseLineCheckMetaData_adjustment_requirement.tupleCount;
    const blWindowsNeedAdjustmentItemCount_pass = windowsBaseLineCheckMetaData_adjustment_requirement.tupleCount;


    //漏洞 信息
    const vulnMetaData_uuid = useExtractOrigin('uuid', vulnOriginData);
    const vulnMetaData_scanTime = useExtractOrigin('scanTime', vulnOriginData);
    const transformedData = useTransformedData(vulnOriginData);

    //病毒扫描
    const virusScanMetaData_uuid = useExtractOrigin('uuid', virusOriginData);

    //last7信息
    const last7VulValue = getPastSevenDaysAlerts(vulnMetaData_scanTime);
    const brutForce_scan_time = useExtractOrigin('scan_time', bruteforceTTPsOriginData);
    const priv_atk_Time = useExtractOrigin('atk_time', privilegeescalationTTPsOriginData);
    const defence_atk_Time = useExtractOrigin('atk_time', defenseavoidanceTTPsOriginData);
    const last7brutForceValue = getPastSevenDaysAlerts(brutForce_scan_time);
    const last7privValue = getPastSevenDaysAlerts(priv_atk_Time);
    const last7defenceForceValue = getPastSevenDaysAlerts(defence_atk_Time);

    const honeypot_atk_Time = useExtractOrigin('atk_time', honeyPotOriginData);
    const last7HoneyPotValue = getPastSevenDaysAlerts(honeypot_atk_Time);

    // const virus_scan_time = useExtractOrigin('scan_time', virusOriginData);
    // const last7VirusValue = getPastSevenDaysAlerts(virus_scan_time);
    const last7VirusValue = [0,0,0,0,0,0,0];
    //主机数量
    const hostCount = (Array.isArray(agentOriginData) ? agentOriginData : [agentOriginData]).flat().length;
    const vulnHostCount = vulnMetaData_uuid.typeCount.size;

    //告警相关，首先计算各类告警涉及到的主机数量
    // const TTPsMetaData_uuid = useExtractOrigin('uuid',
    //     bruteforceTTPsOriginData.concat(privilegeescalationTTPsOriginData).concat(defenseavoidanceTTPsOriginData));
    const bruteforceTTPsMetaData_uuid = useExtractOrigin('uuid', bruteforceTTPsOriginData);
    const privilegeescalationTTPsMetaData_uuid = useExtractOrigin('uuid', privilegeescalationTTPsOriginData);
    const defenseavoidanceTTPsMetaData_uuid = useExtractOrigin('uuid', defenseavoidanceTTPsOriginData);

    const VirusMetaData_uuid = useExtractOrigin('uuid', virusOriginData);
    const HoneyPotMetaData_uuid = useExtractOrigin('uuid', honeyPotOriginData);

    const VirusHostCount = VirusMetaData_uuid.typeCount.size;
    const HoneyPotHostCount = HoneyPotMetaData_uuid.typeCount.size;
    // const TTPsHostCount = bruteforceTTPsMetaData_uuid.typeCount.size
    //     + privilegeescalationTTPsMetaData_uuid.typeCount.size
    //     + defenseavoidanceTTPsMetaData_uuid.typeCount.size;
    const TTPsHostCount = useAggregateUUIDs([
        bruteforceTTPsMetaData_uuid,
        privilegeescalationTTPsMetaData_uuid,
        defenseavoidanceTTPsMetaData_uuid,
    ]);

    //top5表单
    const topFivePortCounts = convertAndFillData(topFivePortCountsArray, templateData);
    const topFiveServiceCounts = convertAndFillData(topFiveServiceCountsArray, templateData);
    const topFiveProductCounts = convertAndFillData(topFiveProductCountsArray, templateData);
    const topFiveUserCounts = convertAndFillData(topFiveUserCountsArray, templateData);
    const topFiveProcessCounts = convertAndFillData(topFiveProcessCountsArray, templateData);


    return (
        <DataContext.Provider value={{
            fetchLatestData,
            refreshDataFromAPI,

            topFiveFimData: topFiveFimData || [],
            agentCPUuseMetaData: agentCPUuseMetaData || { typeCount: new Map(), tupleCount: 0 },
            agentAVGCPUUse: agentAVGCPUUse || '0%',
            agentMEMuseMetaData: agentMEMuseMetaData || { typeCount: new Map(), tupleCount: 0 },
            agentAVGMEMUse: agentAVGMEMUse || '0GB',

            agentOriginData: agentOriginData || [],
            processOriginData: processOriginData || [],
            assetOriginData: assetOriginData || [],
            portOriginData: portOriginData || [],
            windowsBaseLineCheckOriginData: windowsBaseLineCheckOriginData || [],
            linuxBaseLineCheckOriginData: linuxBaseLineCheckOriginData || [],
            fimOriginData: fimOriginData || [],
            monitoredOriginData: monitoredOriginData || [],
            vulnOriginData: vulnOriginData || [],
            taskDetailsOriginData: taskDetailsOriginData || [],
            memHorseOriginData: memHorseOriginData || [],
            honeyPotOriginData: honeyPotOriginData || [],
            bruteforceTTPsOriginData: bruteforceTTPsOriginData || [],
            privilegeescalationTTPsOriginData: privilegeescalationTTPsOriginData || [],
            defenseavoidanceTTPsOriginData: defenseavoidanceTTPsOriginData || [],
            usersOriginData: usersOriginData || [],
            virusOriginData: virusOriginData || [],
            isolationOriginData: isolationOriginData || [],

            agentMetaData_status: agentMetaData_status || { typeCount: new Map(), tupleCount: 0 },
            agentOnlineCount: agentOnlineCount || 0,
            fimMetaData_hostname: fimMetaData_hostname || { typeCount: new Map(), tupleCount: 0 },
            portMetaData_port_state: portMetaData_port_state || { typeCount: new Map(), tupleCount: 0 },
            portMetaData_port_number: portMetaData_port_number || { typeCount: new Map(), tupleCount: 0 },
            topFivePortCounts: topFivePortCounts || [],
            processMetaData_userName: processMetaData_userName || { typeCount: new Map(), tupleCount: 0 },
            topFiveProcessCounts: topFiveProcessCounts || [],
            topFiveUserCounts: topFiveUserCounts || [],
            assetMetaData_service: assetMetaData_service || { typeCount: new Map(), tupleCount: 0 },
            assetMetaData_product: assetMetaData_product || { typeCount: new Map(), tupleCount: 0 },
            assetMetaData_os_version: assetMetaData_os_version || { typeCount: new Map(), tupleCount: 0 },
            topFiveServiceCounts: topFiveServiceCounts || [],
            topFiveProductCounts: topFiveProductCounts || [],
            linuxBaseLineCheckMetaData_uuid: linuxBaseLineCheckMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            linuxBaseLineCheckMetaData_status: linuxBaseLineCheckMetaData_status || { typeCount: new Map(), tupleCount: 0 },
            windowsBaseLineCheckMetaData_uuid: windowsBaseLineCheckMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            vulnMetaData_uuid: vulnMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            last7VulValue: last7VulValue || [0, 0, 0, 0, 0, 0, 0],
            last7brutForceValue: last7brutForceValue || [0, 0, 0, 0, 0, 0, 0],
            last7privValue: last7privValue || [0, 0, 0, 0, 0, 0, 0],
            last7defenceForceValue: last7defenceForceValue || [0, 0, 0, 0, 0, 0, 0],
            last7VirusValue: last7VirusValue || [0, 0, 0, 0, 0, 0, 0],
            last7HoneyPotValue: last7HoneyPotValue || [0, 0, 0, 0, 0, 0, 0],

            transformedData: transformedData || [],

            hostCount: hostCount || 0,
            vulnHostCount: vulnHostCount || 0,
            blLinuxHostCount: blLinuxHostCount || 0,
            blWindowsHostCount: blWindowsHostCount || 0,

            TTPsHostCount: TTPsHostCount || 0,
            VirusHostCount: VirusHostCount || 0,
            HoneyPotHostCount: HoneyPotHostCount || 0,

            blLinuxNeedAdjustmentItemCount: blLinuxNeedAdjustmentItemCount || 0,
            blWindowsNeedAdjustmentItemCount: blWindowsNeedAdjustmentItemCount || 0,
            blLinuxNeedAdjustmentItemCount_pass: blLinuxNeedAdjustmentItemCount_pass || 0,
            blWindowsNeedAdjustmentItemCount_pass: blWindowsNeedAdjustmentItemCount_pass || 0,

            blLinuxCheckNameCount: blLinuxCheckNameCount || 0,
            blWindowsCheckNameCount: blWindowsCheckNameCount || 0,

            bruteforceTTPsMetaData_uuid: bruteforceTTPsMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            privilegeescalationTTPsMetaData_uuid: privilegeescalationTTPsMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            defenseavoidanceTTPsMetaData_uuid: defenseavoidanceTTPsMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            VirusMetaData_uuid: VirusMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
            HoneyPotMetaData_uuid: HoneyPotMetaData_uuid || { typeCount: new Map(), tupleCount: 0 },
        }}>
            {children}
        </DataContext.Provider>
        // <DataContext.Provider value={{
        //     fetchLatestData,
        //     refreshDataFromAPI,
        //
        //     topFiveFimData,
        //     //agentSearchResults,
        //     agentCPUuseMetaData,
        //     agentAVGCPUUse,
        //     agentMEMuseMetaData,
        //     agentAVGMEMUse,
        //
        //     agentOriginData,
        //     processOriginData,
        //     assetOriginData,
        //     portOriginData,
        //     windowsBaseLineCheckOriginData,
        //     linuxBaseLineCheckOriginData,
        //     fimOriginData,
        //     monitoredOriginData,
        //     vulnOriginData,
        //     taskDetailsOriginData,
        //     memHorseOriginData,
        //     honeyPotOriginData,
        //
        //     bruteforceTTPsOriginData,
        //     privilegeescalationTTPsOriginData,
        //     defenseavoidanceTTPsOriginData,
        //
        //     usersOriginData,
        //     virusOriginData,
        //     isolationOriginData,
        //
        //
        //     agentMetaData_status,
        //     agentOnlineCount,
        //     fimMetaData_hostname,
        //     portMetaData_port_state,
        //     portMetaData_port_number,
        //     topFivePortCounts,
        //     processMetaData_userName,
        //     topFiveProcessCounts,
        //     topFiveUserCounts,
        //     assetMetaData_service,
        //     assetMetaData_product,
        //     assetMetaData_os_version,
        //     topFiveServiceCounts,
        //     topFiveProductCounts,
        //     linuxBaseLineCheckMetaData_uuid,
        //     linuxBaseLineCheckMetaData_status,
        //     windowsBaseLineCheckMetaData_uuid,
        //
        //     //vulnOriginDataReconstruct,
        //     vulnMetaData_uuid,//vulnFilteredData,
        //
        //     last7VulValue,
        //     last7brutForceValue,
        //     last7privValue,
        //     last7defenceForceValue,
        //     last7VirusValue,
        //     last7HoneyPotValue,
        //
        //     transformedData,
        //
        //     hostCount,
        //     vulnHostCount,
        //     blLinuxHostCount,
        //     blWindowsHostCount,
        //
        //     TTPsHostCount,
        //     VirusHostCount,
        //     HoneyPotHostCount,
        //
        //     blLinuxNeedAdjustmentItemCount,
        //     blWindowsNeedAdjustmentItemCount,
        //     blLinuxNeedAdjustmentItemCount_pass,
        //     blWindowsNeedAdjustmentItemCount_pass,
        //
        //     blLinuxCheckNameCount,
        //     blWindowsCheckNameCount,
        //
        //     bruteforceTTPsMetaData_uuid,
        //     privilegeescalationTTPsMetaData_uuid,
        //     defenseavoidanceTTPsMetaData_uuid,
        //     VirusMetaData_uuid,
        //     HoneyPotMetaData_uuid,
        //
        // }}>
        //     {children}
        // </DataContext.Provider>
    );
};

export default DataManager;
