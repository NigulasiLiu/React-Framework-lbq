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

  portMetaData: MetaDataResult;
  portMetaData2: MetaDataResult;

  processMetaData: MetaDataResult;
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

  useEffect(() => {
    const fetchData = async () => {
      try {

        const agentOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/agent/all'});
        const fimOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/FileIntegrityInfo/all'});
        const portOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/portinfo/all'});
        const processOriginData = await fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/process/all'});
        setAgentOriginData(agentOriginData);
        setFimOriginData(fimOriginData);
        setPortOriginData(portOriginData);
        setProcessOriginData(processOriginData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    
    fetchData();
  }, []);

  const topFiveFimData = useSortedData('filename','event_time','http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据
  const n = useExtractMetaData('ip','60.218.244.31','http://localhost:5000/api/asset_mapping/all');

  const agentMetaData=useExtractOrigin('status',agentOriginData);

  const fimMetaData=useExtractOrigin('',fimOriginData);

  const portMetaData=useExtractOrigin('port_state',portOriginData);
  const portMetaData2 = useExtractOrigin('port_number',portOriginData);
  const topFivePortCountsArray = getTopFiveTypeCounts(portMetaData2);
// 转换sortedTypeCounts到DataItem类型
  const topFivePortCounts: DataItem[] = topFivePortCountsArray.map(([valueName, value], index) => ({
    ...templateData[index], // 复制模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));
  
  const processMetaData=useExtractOrigin('userName',processOriginData);
  
  // try{
  //   const agentOriginData = fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/agent/all'});
  //   const fimOriginData = fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/FileIntegrityInfo/all'});
  //   const portOriginData = fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/portinfo/all'});
  //   const processOriginData = fetchDataFromAPI({apiEndpoint:'http://localhost:5000/api/process/all'});

  //   const agentMetaData=useExtractOrigin('status',agentOriginData );
  //   const portMetaData=useExtractMeta('status','http://localhost:5000/api/portinfo/all' );
  //   const processMetaData=useExtractMeta('userName','http://localhost:5000/api/process/all' );
  // }catch (error) {
  //   console.error('Failed to fetch and count data:', error);
  // }

  // const topFiveFimData = useSortedData('filename','event_time','http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据
  // const n = useExtractMetaData('ip','60.218.244.31','http://localhost:5000/api/asset_mapping/all');


  return (
    <DataContext.Provider value={{
      topFiveFimData,n,
      agentMetaData,
      portMetaData,portMetaData2,topFivePortCounts,
      processMetaData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataManager;
