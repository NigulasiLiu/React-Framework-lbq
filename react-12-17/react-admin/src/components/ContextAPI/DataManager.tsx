// src/components/DataManager.tsx
import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { templateData } from './SeperateData';
import useSortedData from './TopFiveDataProvider';
import { convertAndFillData } from './SeperateData';
import { DataItem } from '../Columns';
import useExtractOrigin,{
    MetaDataResult, getTopFiveTypeCounts,
     getPastSevenDaysAlerts,
} from './ExtractOriginData';
import useAggregateUUIDs from './useAggregateUUIDs'
import { fetchDataFromAPI } from './DataService';
import { FilteredDataResult_new } from './useFilterOriginData_new';
import useTransformedData from '../HostProtection/useTransformedData';
import useCalculateAverage from './useCalculateAverage';
import { processData } from './DataService';
import { message } from 'antd';


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

    //vulnFilteredData: Map<string, FilteredDataResult_new[]>;
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

    bruteforceTTPsMetaData_uuid:MetaDataResult;
    privilegeescalationTTPsMetaData_uuid:MetaDataResult;
    defenseavoidanceTTPsMetaData_uuid:MetaDataResult;
    VirusMetaData_uuid:MetaDataResult;
    HoneyPotMetaData_uuid:MetaDataResult;

    //agentOriginData_2:Map<string, AgentInfoType>|undefined;
};
export const DataContext = createContext<DataContextType | undefined>(undefined);

interface SetDataFunctions {
    [key: string]: Dispatch<SetStateAction<any>>;
}


const DataManager: React.FC = ({ children }) => {
    const [agentOriginData, setAgentOriginData] = useState<any>();
    const [taskDetailsOriginData, settaskDetailsOriginData] = useState<any>({});

    const [monitoredOriginData, setMonitoredOriginData] = useState<any>({});
    const [fimOriginData, setFimOriginData] = useState<any>({});

    const [portOriginData, setPortOriginData] = useState<any>({});
    const [processOriginData, setProcessOriginData] = useState<any>({});
    const [assetOriginData, setAssetOriginData] = useState<any>({});
    const [linuxBaseLineCheckOriginData, setlinuxBLCheckOriginData] = useState<any>({});
    const [windowsBaseLineCheckOriginData, setwindowsBLCheckOriginData] = useState<any>({});

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
        'http://localhost:5000/api/agent/all': setAgentOriginData,

        'http://localhost:5000/api/monitored/all': setMonitoredOriginData,
        'http://localhost:5000/api/FileIntegrityInfo/all': setFimOriginData,

        'http://localhost:5000/api/vulndetetion/all': setVulnOriginData,
        'http://localhost:5000/api/portinfo/all': setPortOriginData,
        'http://localhost:5000/api/process/all': setProcessOriginData,
        'http://localhost:5000/api/asset_mapping/all': setAssetOriginData,
        'http://localhost:5000/api/baseline_check/linux/all': setlinuxBLCheckOriginData,
        'http://localhost:5000/api/baseline_check/windows/all': setwindowsBLCheckOriginData,
        'http://localhost:5000/api/taskdetail/all': settaskDetailsOriginData,
        'http://localhost:5000/api/memoryshell/all': setmemHorseOriginData,
        'http://localhost:5000/api/honeypot/all': sethoneyPotOriginData,

        'http://localhost:5000/api/brute-force/all': setbruteforceTTPsOriginData,
        'http://localhost:5000/api/privilege-escalation/all': setprivilegeescalationTTPsOriginData,
        'http://localhost:5000/api/defense-avoidance/all': setdefenseavoidanceTTPsOriginData,

        'http://localhost:5000/api/users/all': setUsersOriginData,

        'http://localhost:5000/api/virus/all': setVirusOriginData,
        'http://localhost:5000/api/isolate/all': setIsolationOriginData,
        // 添加其他API端点和对应的设置函数
    };

    // 通用的数据刷新函数
    const refreshDataFromAPI = async (apiEndpoint: string) => {
        try {
            const data = await fetchDataFromAPI({ apiEndpoint });
            // 根据API端点调用对应的设置状态函数
            const setDataFunction = setDataFunctions[apiEndpoint];
            if (setDataFunction) {
                setDataFunction(data); // 更新状态
                // message.success(apiEndpoint + ' Data refreshed successfully');
            } else {
                console.error('No matching function found for the API endpoint');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            message.error('Failed to refresh' + { apiEndpoint } + 'data');
        }
    };

    useEffect(() => {

        refreshDataFromAPI('http://localhost:5000/api/agent/all');

        refreshDataFromAPI('http://localhost:5000/api/monitored/all');
        refreshDataFromAPI('http://localhost:5000/api/FileIntegrityInfo/all');

        refreshDataFromAPI('http://localhost:5000/api/portinfo/all');
        refreshDataFromAPI('http://localhost:5000/api/process/all');
        refreshDataFromAPI('http://localhost:5000/api/asset_mapping/all');
        refreshDataFromAPI('http://localhost:5000/api/baseline_check/linux/all');
        refreshDataFromAPI('http://localhost:5000/api/baseline_check/windows/all');
        refreshDataFromAPI('http://localhost:5000/api/vulndetetion/all');
        refreshDataFromAPI('http://localhost:5000/api/taskdetail/all');
        refreshDataFromAPI('http://localhost:5000/api/memoryshell/all');
        refreshDataFromAPI('http://localhost:5000/api/honeypot/all');

        refreshDataFromAPI('http://localhost:5000/api/brute-force/all');
        refreshDataFromAPI('http://localhost:5000/api/privilege-escalation/all');
        refreshDataFromAPI('http://localhost:5000/api/defense-avoidance/all');


        refreshDataFromAPI('http://localhost:5000/api/users/all');
        refreshDataFromAPI('http://localhost:5000/api/isolate/all');

        refreshDataFromAPI('http://localhost:5000/api/virus/all');


        // const fetchData = async () => {
        //   try {
        //     const agentOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/agent/all' });
        //     const fimOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/FileIntegrityInfo/all' });
        //     const portOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/portinfo/all' });
        //     const processOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/process/all' });
        //     const assetOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/asset_mapping/all' });
        //     const linuxBaseLineCheckOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/baseline_check/linux/all' });
        //     const windowsBaseLineCheckOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/baseline_check/windows/all' });
        //     const vulnOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/vulndetetion/all' });
        //     const taskDetailsOriginData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/taskdetail/all' });
        //     //settaskRecordOriginData(taskRecordOriginData);
        //     settaskDetailsOriginData(taskDetailsOriginData);
        //     setAgentOriginData(agentOriginData);
        //     setFimOriginData(fimOriginData);
        //     setPortOriginData(portOriginData);
        //     setProcessOriginData(processOriginData);
        //     setAssetOriginData(assetOriginData);
        //     setlinuxBLCheckOriginData(linuxBaseLineCheckOriginData);
        //     setwindowsBLCheckOriginData(windowsBaseLineCheckOriginData);
        //     setVulnOriginData(vulnOriginData);
        //   } catch (error) {
        //     console.error('Failed to fetch initial data:', error);
        //   }
        // };
        // fetchData();
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
    const topFiveFimData = useSortedData('filename', 'event_time', 'http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据


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
    //const vulnFilteredData = useFilterOriginData_new('ip', vulnOriginData);
    //const agentSearchResults = useSearchOriginData(agentOriginData, ['host_name'], ['Host1'], ['os_version', 'status']);

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

    const last7VirusValue = [1];
    //主机数量
    const hostCount = agentOriginData?.flat().length;
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
        defenseavoidanceTTPsMetaData_uuid
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

            topFiveFimData,
            //agentSearchResults,
            agentCPUuseMetaData,
            agentAVGCPUUse,
            agentMEMuseMetaData,
            agentAVGMEMUse,

            agentOriginData,
            processOriginData,
            assetOriginData,
            portOriginData,
            windowsBaseLineCheckOriginData,
            linuxBaseLineCheckOriginData,
            fimOriginData,
            monitoredOriginData,
            vulnOriginData,
            taskDetailsOriginData,
            memHorseOriginData,
            honeyPotOriginData,

            bruteforceTTPsOriginData,
            privilegeescalationTTPsOriginData,
            defenseavoidanceTTPsOriginData,

            usersOriginData,
            virusOriginData,
            isolationOriginData,


            agentMetaData_status,
            agentOnlineCount,
            fimMetaData_hostname,
            portMetaData_port_state,
            portMetaData_port_number,
            topFivePortCounts,
            processMetaData_userName,
            topFiveProcessCounts,
            topFiveUserCounts,
            assetMetaData_service,
            assetMetaData_product,
            assetMetaData_os_version,
            topFiveServiceCounts,
            topFiveProductCounts,
            linuxBaseLineCheckMetaData_uuid,
            linuxBaseLineCheckMetaData_status,
            windowsBaseLineCheckMetaData_uuid,

            //vulnOriginDataReconstruct,
            vulnMetaData_uuid,//vulnFilteredData,

            last7VulValue,
            last7brutForceValue,
            last7privValue,
            last7defenceForceValue,
            last7VirusValue,
            last7HoneyPotValue,

            transformedData,

            hostCount,
            vulnHostCount,
            blLinuxHostCount,
            blWindowsHostCount,

            TTPsHostCount,
            VirusHostCount,
            HoneyPotHostCount,

            blLinuxNeedAdjustmentItemCount,
            blWindowsNeedAdjustmentItemCount,
            blLinuxNeedAdjustmentItemCount_pass,
            blWindowsNeedAdjustmentItemCount_pass,

            blLinuxCheckNameCount,
            blWindowsCheckNameCount,

            bruteforceTTPsMetaData_uuid,
            privilegeescalationTTPsMetaData_uuid,
            defenseavoidanceTTPsMetaData_uuid,
            VirusMetaData_uuid,
            HoneyPotMetaData_uuid,

        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataManager;
