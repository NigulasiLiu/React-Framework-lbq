// src/components/DataManager.tsx
import React, { createContext, useState, useEffect } from 'react';
import { templateData } from './SeperateData';
import useSortedData from './TopFiveDataProvider';
import { DataItem } from '../tableUtils';
import useFilterOriginData, {FilteredDataResult,VulnDataItem,ReconstructedDataItem} from './useFilterOriginData';
import useExtractOrigin, {MetaDataResult, getTopFiveTypeCounts, getCountPastSevenDays,getPastSevenDaysAlerts} from './ExtractOriginData';
import { fetchDataFromAPI } from '../AssetsCenter/DataService';
import useFilterOriginData_new,{FilteredDataResult_new} from './useFilterOriginData_new';
import useTransformedData from '../HostProtection/useTransformedData';
import useCalculateAverage from './useCalculateAverage';
import { processData, processVulnData } from '../AssetsCenter/DataService';



export interface DataContextType {

  fetchLatestData: (apiEndpoint: string, 
    searchField?: string, searchQuery?: string, rangeQuery?: string, 
    timeColumnIndex?: string[]) => Promise<any>;

  topFiveFimData: DataItem[];
  topFivePortCounts: DataItem[];
  
  agentOriginData:any[];
  agentSearchResults?:any[];

  vulnOriginData:any[];
  //vulnOriginDataReconstruct:ReconstructedDataItem;


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

  linuxBaseLineCheckMetaData__ip: MetaDataResult;
  linuxBaseLineCheckMetaData_status: MetaDataResult;
  windowsBaseLineCheckMetaData_ip: MetaDataResult;

  vulnMetaData_ip: MetaDataResult;
  vulnMetaData_scanTime: MetaDataResult;
  last7VulValue:number[];
  //vulnFilteredData: Map<string, FilteredDataResult_new[]>;
  transformedData: FilteredDataResult_new[],





  hostCount:number;
  vulnHostCount:number;
  blLinuxHostCount:number;
  blWindowsHostCount:number;

  blLinuxHostItemCount:number|undefined;
  blWindowsHostItemCount:number|undefined;
  blLinuxHostItemCount_pass:number;
  blWindowsHostItemCount_pass:number;

  agentOnlineCount:number;
  agentCPUuseMetaData:MetaDataResult;
  agentAVGCPUUse:string;
  agentMEMuseMetaData:MetaDataResult;
  agentAVGMEMUse:string;



};
export const DataContext = createContext<DataContextType | undefined>(undefined);



// const searchOriginData = (
//   originData:any[],      // The actual array of data objects
//   filterKeys:string[],      // Keys to filter by
//   filterValues:string[],    // Corresponding values for filtering
//   targetAttributes:string[] // Attributes to be included in the final result
// ) => {
//   // Filter data based on filterKeys and filterValues
//   const filteredData = originData.filter(item =>
//     filterKeys.every((key, index) => item[key] === filterValues[index])
//   );

//   // Extract only the target attributes from the filtered data
//   return filteredData.map(item => {
//     const resultItem:any = {};
//     targetAttributes.forEach(attr => {
//       resultItem[attr] = item[attr];
//     });
//     return resultItem;
//   });
// };




const DataManager: React.FC = ({ children }) => {
  const [agentOriginData, setAgentOriginData] = useState<any>();

  const [fimOriginData, setFimOriginData] = useState<any>({});
  const [portOriginData, setPortOriginData] = useState<any>({});
  const [processOriginData, setProcessOriginData] = useState<any>({});
  const [assetOriginData, setAssetOriginData] = useState<any>({});
  const [linuxBaseLineCheckOriginData, setlinuxBLCheckOriginData] = useState<any>({});
  const [windowsBaseLineCheckOriginData, setwindowsBLCheckOriginData] = useState<any>({});

  const [vulnOriginData, setVulnOriginData] = useState<any>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        const agentOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/agent/all'});

        const fimOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/FileIntegrityInfo/all'});
        const portOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/portinfo/all'});
        const processOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/process/all'});
        const assetOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/asset_mapping/all'});
        const linuxBaseLineCheckOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/baseline_check/linux/all'});
        const windowsBaseLineCheckOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/baseline_check/windows/all'});
        
        const vulnOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/vulndetetion/all'});
        setVulnOriginData(vulnOriginData);
        //const reformedData = reformatVulnData(vulnOriginData); // 调用重构函数
        //setVulnOriginDataReconstruct(reformedData); // 更新重构后的数据状态
        setAgentOriginData(agentOriginData);

        setFimOriginData(fimOriginData);
        setPortOriginData(portOriginData);
        setProcessOriginData(processOriginData);
        setAssetOriginData(assetOriginData);
        setlinuxBLCheckOriginData(linuxBaseLineCheckOriginData);
        setwindowsBLCheckOriginData(windowsBaseLineCheckOriginData);
        setVulnOriginData(vulnOriginData);
        
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    
    fetchData();
  }, []);
  // 定义数据重构函数

  const fetchLatestData = async (apiEndpoint: string, searchField = '', searchQuery = '', rangeQuery = '', timeColumnIndex: string[] = []) => {
    try {
        // 修改queryParams的构造逻辑
        let finalEndpoint = `${apiEndpoint}`;
        if (searchField === 'all') {
            finalEndpoint += '/all';
        } else if (searchField && searchQuery) {
            const queryParams = `?${encodeURIComponent(searchField)}=${encodeURIComponent(searchQuery)}`;
            finalEndpoint += queryParams;
        }
        
        // 如果有rangeQuery，追加到finalEndpoint
        if (rangeQuery) {
            // 确保rangeQuery以'?'或'&'开头，以正确追加到finalEndpoint
            if (!rangeQuery.startsWith('?') && !rangeQuery.startsWith('&')) {
                rangeQuery = '&' + rangeQuery; // 假设rangeQuery需要以'&'开头追加
            }
            finalEndpoint += rangeQuery;
        }

        const rawData = await fetchDataFromAPI({ apiEndpoint: finalEndpoint });
        // 检查message字段是否是数组，如果不是，则将其转换为包含该对象的数组
        const messageData = Array.isArray(rawData) ? rawData : [rawData];
        const processedData = processData(messageData, timeColumnIndex);
        if(apiEndpoint.includes("vulndetetion")) console.log("is vuln list!!!!!!!!")
        const result = apiEndpoint.includes("vulndetetion")?processVulnData(processedData):processedData;
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // 在出错时返回空数组或适当的错误处理
    }
};

  const topFiveFimData = useSortedData('filename','event_time','http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据

  const agentMetaData_status=useExtractOrigin('status',agentOriginData);//各类status主机的数量
  const agentOnlineCount = agentMetaData_status.typeCount.get("Online") || -1;

  const agentCPUuseMetaData=useExtractOrigin('cpu_use',agentOriginData);//各类status主机的数量
  const agentMEMuseMetaData=useExtractOrigin('mem_use',agentOriginData);//各类status主机的数量
  const agentAVGCPUUse = (((useCalculateAverage('cpu_use',agentOriginData).average)||0)*100).toString()+'%';
  const agentAVGMEMUse = (((useCalculateAverage('mem_use',agentOriginData).average)||0)*100).toString()+'GB';

  const fimMetaData_hostname=useExtractOrigin('hostname',fimOriginData);

  const portMetaData_port_state = useExtractOrigin('port_state',portOriginData);
  const portMetaData_port_number = useExtractOrigin('port_number',portOriginData);
  const topFivePortCountsArray = getTopFiveTypeCounts(portMetaData_port_number);

  const processMetaData_userName = useExtractOrigin('userName',processOriginData);
  const topFiveUserCountsArray = getTopFiveTypeCounts(processMetaData_userName);
  const processMetaData_name = useExtractOrigin('name',processOriginData);
  const topFiveProcessCountsArray = getTopFiveTypeCounts(processMetaData_name);

  const assetMetaData_service = useExtractOrigin('service',assetOriginData);
  const assetMetaData_product = useExtractOrigin('product',assetOriginData);
  const assetMetaData_os_version = useExtractOrigin('os_version',assetOriginData);
  
  const topFiveServiceCountsArray = getTopFiveTypeCounts(assetMetaData_service);
  const topFiveProductCountsArray = getTopFiveTypeCounts(assetMetaData_product);
  
  
  const linuxBaseLineCheckMetaData__ip = useExtractOrigin('ip',linuxBaseLineCheckOriginData);
  const linuxBaseLineCheckMetaData_status = useExtractOrigin('status',linuxBaseLineCheckOriginData);
  const linuxBaseLineCheckMetaData_adjustment_requirement = useExtractOrigin('adjustment_requirement',linuxBaseLineCheckOriginData);

  const windowsBaseLineCheckMetaData_ip = useExtractOrigin('ip',windowsBaseLineCheckOriginData);
  const windowsBaseLineCheckMetaData_adjustment_requirement = useExtractOrigin('adjustment_requirement',windowsBaseLineCheckOriginData);

  const vulnMetaData_ip = useExtractOrigin('ip',vulnOriginData);
  const vulnMetaData_scanTime = useExtractOrigin('scanTime',vulnOriginData);
  const last7VulValue = getPastSevenDaysAlerts(vulnMetaData_scanTime)
  //const vulnFilteredData = useFilterOriginData_new('ip', vulnOriginData);
  const transformedData = useTransformedData(vulnOriginData);
  //const agentSearchResults = useSearchOriginData(agentOriginData, ['host_name'], ['Host1'], ['os_version', 'status']);




  const hostCount = agentMetaData_status.tupleCount;
  const vulnHostCount = vulnMetaData_ip.tupleCount;
  const blLinuxHostCount = linuxBaseLineCheckMetaData__ip.typeCount.size;
  const blWindowsHostCount = windowsBaseLineCheckMetaData_ip.typeCount.size;
  const blLinuxHostItemCount = linuxBaseLineCheckMetaData_adjustment_requirement.typeCount.get("建议调整");
  const blWindowsHostItemCount = windowsBaseLineCheckMetaData_adjustment_requirement.typeCount.get("建议调整");
  const blLinuxHostItemCount_pass = linuxBaseLineCheckMetaData_adjustment_requirement.tupleCount;
  const blWindowsHostItemCount_pass = windowsBaseLineCheckMetaData_adjustment_requirement.tupleCount;









  


 

// 转换sortedTypeCounts到DataItem类型,OverViewPanel的TopFive数据展示
  const topFivePortCounts: DataItem[] = topFivePortCountsArray.map(([valueName, value], index) => ({
    ...templateData[index], // 复制模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));
  const topFiveServiceCounts: DataItem[] = topFiveServiceCountsArray.map(([valueName, value], index) => ({
    ...templateData[index], // 复制模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));
  const topFiveProductCounts: DataItem[] = topFiveProductCountsArray.map(([valueName, value], index) => ({
    ...templateData[index], // 复制模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));
  const topFiveUserCounts: DataItem[] = topFiveUserCountsArray.map(([valueName, value], index) => ({
    ...templateData[index], // 复制模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));
  const topFiveProcessCounts: DataItem[] = topFiveProcessCountsArray.map(([valueName, value], index) => ({
    ...templateData[index], // 复制模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));

  
  return (
    <DataContext.Provider value={{fetchLatestData,
      topFiveFimData,
      //agentSearchResults,
      agentCPUuseMetaData,
      agentAVGCPUUse,
      agentMEMuseMetaData,
      agentAVGMEMUse,

      agentOriginData,

      agentMetaData_status,
      agentOnlineCount,
      fimMetaData_hostname,
      portMetaData_port_state,portMetaData_port_number,topFivePortCounts,
      processMetaData_userName,topFiveProcessCounts,topFiveUserCounts,
      assetMetaData_service,assetMetaData_product, assetMetaData_os_version, topFiveServiceCounts,topFiveProductCounts,
      linuxBaseLineCheckMetaData__ip,linuxBaseLineCheckMetaData_status,windowsBaseLineCheckMetaData_ip,

      vulnOriginData,
      //vulnOriginDataReconstruct,
      vulnMetaData_ip,//vulnFilteredData,
      vulnMetaData_scanTime,
      last7VulValue,
      transformedData,

      hostCount,
      vulnHostCount,
      blLinuxHostCount,
      blWindowsHostCount,
      blLinuxHostItemCount,
      blWindowsHostItemCount,
      blLinuxHostItemCount_pass,
      blWindowsHostItemCount_pass,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataManager;
