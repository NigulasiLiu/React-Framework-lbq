// src/components/DataManager.tsx
import React, { createContext, useState, useEffect } from 'react';
import { templateData } from './SeperateData';
import useSortedData from './TopFiveDataProvider';
import { DataItem } from '../tableUtils';
import useExtractMetaData from './ExtractMetaData';
import useFilterOriginData, {FilteredDataResult,VulnDataItem,ReconstructedDataItem} from './useFilterOriginData';
import useExtractOrigin, {MetaDataResult} from './ExtractOriginData';
import { fetchDataFromAPI } from '../AssetsCenter/DataService';
import useFilterOriginData_new,{FilteredDataResult_new} from './useFilterOriginData_new';
import useTransformedData from '../HostProtection/useTransformedData';



export interface DataContextType {
  topFiveFimData: DataItem[];
  topFivePortCounts: DataItem[];
  n: number;
  agentOriginData:any[];
  agentSearchResults?:any[];

  vulnOriginData:any[];
  //vulnOriginDataReconstruct:ReconstructedDataItem;


  agentMetaData: MetaDataResult;
  fimMetaData: MetaDataResult;
  portMetaData: MetaDataResult;
  portMetaData2: MetaDataResult;

  processMetaData: MetaDataResult;
  topFiveProcessCounts: DataItem[];
  topFiveUserCounts: DataItem[];
  
  assetMetaData: MetaDataResult;
  assetMetaData2: MetaDataResult;
  assetMetaData_host_os: MetaDataResult;
  
  topFiveServiceCounts: DataItem[];
  topFiveProductCounts: DataItem[];

  linuxBaseLineCheckMetaData: MetaDataResult;
  linuxBaseLineCheckMetaData2: MetaDataResult;
  windowsBaseLineCheckMetaData: MetaDataResult;

  vulnMetaData: MetaDataResult;
  //vulnFilteredData: Map<string, FilteredDataResult_new[]>;
  transformedData: FilteredDataResult_new[],
};
export const DataContext = createContext<DataContextType | undefined>(undefined);

// 获取最大的五个typeCount的值和对应的valueName
const getTopFiveTypeCounts = (result: MetaDataResult): [string, number][] => {
  // 将 typeCount Map 转换为数组，然后排序
  const sortedTypeCounts = Array.from(result.typeCount)
    .sort((a, b) => b[1] - a[1]) // 根据计数降序排序
    .slice(0, 5); // 获取前五个

  return sortedTypeCounts;
};
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
  //const [vulnOriginDataReconstruct, setVulnOriginDataReconstruct] = useState<ReconstructedDataItem[]>([]);

  
  //const [agentSearchResults, setAgentSearchResults] = useState<any[]>([]);



  //const [searchResults, setSearchResults] = useState<any[]>([]);
  
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


  const topFiveFimData = useSortedData('filename','event_time','http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据
  const n = useExtractMetaData('ip','60.218.244.31','http://localhost:5000/api/asset_mapping/all');

  const agentMetaData=useExtractOrigin('status',agentOriginData);//各类status主机的数量

  const fimMetaData=useExtractOrigin('hostname',fimOriginData);

  const portMetaData = useExtractOrigin('port_state',portOriginData);
  const portMetaData2 = useExtractOrigin('port_number',portOriginData);
  const topFivePortCountsArray = getTopFiveTypeCounts(portMetaData2);

  const processMetaData = useExtractOrigin('userName',processOriginData);
  const topFiveUserCountsArray = getTopFiveTypeCounts(processMetaData);
  const processMetaData2 = useExtractOrigin('name',processOriginData);
  const topFiveProcessCountsArray = getTopFiveTypeCounts(processMetaData2);

  const assetMetaData = useExtractOrigin('service',assetOriginData);
  const assetMetaData2 = useExtractOrigin('product',assetOriginData);
  const assetMetaData_host_os = useExtractOrigin('os_version',assetOriginData);
  
  const topFiveServiceCountsArray = getTopFiveTypeCounts(assetMetaData);
  const topFiveProductCountsArray = getTopFiveTypeCounts(assetMetaData2);
  
  
  const linuxBaseLineCheckMetaData = useExtractOrigin('ip',linuxBaseLineCheckOriginData);
  const linuxBaseLineCheckMetaData2 = useExtractOrigin('status',linuxBaseLineCheckOriginData);
  const windowsBaseLineCheckMetaData = useExtractOrigin('ip',windowsBaseLineCheckOriginData);

  const vulnMetaData = useExtractOrigin('ip',vulnOriginData);
  //const vulnFilteredData = useFilterOriginData_new('ip', vulnOriginData);
  const transformedData = useTransformedData(vulnOriginData);
  //const agentSearchResults = useSearchOriginData(agentOriginData, ['host_name'], ['Host1'], ['os_version', 'status']);


  

  





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
    <DataContext.Provider value={{
      topFiveFimData,n,
      //agentSearchResults,

      agentOriginData,

      agentMetaData,
      fimMetaData,
      portMetaData,portMetaData2,topFivePortCounts,
      processMetaData,topFiveProcessCounts,topFiveUserCounts,
      assetMetaData,assetMetaData2, assetMetaData_host_os, topFiveServiceCounts,topFiveProductCounts,
      linuxBaseLineCheckMetaData,linuxBaseLineCheckMetaData2,windowsBaseLineCheckMetaData,

      vulnOriginData,
      //vulnOriginDataReconstruct,
      vulnMetaData,//vulnFilteredData,
      transformedData,

    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataManager;
