// src/components/DataManager.tsx
import React, { createContext, useState, useEffect } from 'react';
import { templateData } from './SeperateData';
import useSortedData from './TopFiveDataProvider';
import { DataItem } from '../tableUtils';
import useExtractMetaData from './ExtractMetaData';
import useExtractMeta from './ExtractMeta';
import useExtractOrigin, {MetaDataResult} from './ExtractOriginData';
import { fetchDataFromAPI } from '../AssetsCenter/DataService';

export interface DataContextType {
  topFiveFimData: DataItem[];
  topFivePortCounts: DataItem[];
  n: number;

  agentMetaData: MetaDataResult;
  fimMetaData: MetaDataResult;
  portMetaData: MetaDataResult;
  portMetaData2: MetaDataResult;

  processMetaData: MetaDataResult;
  topFiveProcessCounts: DataItem[];
  topFiveUserCounts: DataItem[];
  
  assetMetaData: MetaDataResult;
  assetMetaData2: MetaDataResult;
  topFiveServiceCounts: DataItem[];
  topFiveProductCounts: DataItem[];

  linuxBaseLineCheckMetaData: MetaDataResult;
  linuxBaseLineCheckMetaData2: MetaDataResult;
  windowsBaseLineCheckMetaData: MetaDataResult;

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

const DataManager: React.FC = ({ children }) => {
  const [agentOriginData, setAgentOriginData] = useState<any>();
  const [fimOriginData, setFimOriginData] = useState<any>();
  const [portOriginData, setPortOriginData] = useState<any>();
  const [processOriginData, setProcessOriginData] = useState<any>();
  const [assetOriginData, setAssetOriginData] = useState<any>();
  const [linuxBaseLineCheckOriginData, setlinuxBLCheckOriginData] = useState<any>();
  const [windowsBaseLineCheckOriginData, setwindowsBLCheckOriginData] = useState<any>();
  
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
        setAgentOriginData(agentOriginData);
        setFimOriginData(fimOriginData);
        setPortOriginData(portOriginData);
        setProcessOriginData(processOriginData);
        setAssetOriginData(assetOriginData);
        setlinuxBLCheckOriginData(linuxBaseLineCheckOriginData);
        setwindowsBLCheckOriginData(windowsBaseLineCheckOriginData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    
    fetchData();
  }, []);

  const topFiveFimData = useSortedData('filename','event_time','http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据
  const n = useExtractMetaData('ip','60.218.244.31','http://localhost:5000/api/asset_mapping/all');

  const agentMetaData=useExtractOrigin('status',agentOriginData);

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
  const topFiveServiceCountsArray = getTopFiveTypeCounts(assetMetaData);
  const topFiveProductCountsArray = getTopFiveTypeCounts(assetMetaData2);
  
  
  const linuxBaseLineCheckMetaData = useExtractOrigin('ip',linuxBaseLineCheckOriginData);
  const linuxBaseLineCheckMetaData2 = useExtractOrigin('adjustment_requirement',linuxBaseLineCheckOriginData);
  const windowsBaseLineCheckMetaData = useExtractOrigin('ip',windowsBaseLineCheckOriginData);


// 转换sortedTypeCounts到DataItem类型
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
      agentMetaData,
      fimMetaData,
      portMetaData,portMetaData2,topFivePortCounts,
      processMetaData,topFiveProcessCounts,topFiveUserCounts,
      assetMetaData,assetMetaData2,topFiveServiceCounts,topFiveProductCounts,
      linuxBaseLineCheckMetaData,linuxBaseLineCheckMetaData2,windowsBaseLineCheckMetaData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataManager;
