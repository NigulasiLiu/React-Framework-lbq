// src/components/DataManager.tsx
import React, { createContext } from 'react';
import { useFimData } from './useFimData';
import useSortedData from './TopFiveDataProvider';
import { DataItem } from '../tableUtils';
import useExtractMetaData from './ExtractMetaData';
import useExtractMeta, {MetaDataResult } from './ExtractMeta';

export interface DataContextType {
  topFiveFimData: DataItem[];
  n: number;
  metaData: MetaDataResult;
};
export const DataContext = createContext<DataContextType | undefined>(undefined);
//export const DataContext = React.createContext<DataItem[] | undefined>(undefined);

// // 更新DataContext的类型定义，使之与DataItem[]匹配
// export const DataContext = createContext<DataItem[] | undefined>(undefined);

const DataManager: React.FC = ({ children }) => {
  //const topFiveData = useFimData(); // 这将返回DataItem[]类型的数据
  const topFiveFimData = useSortedData('filename','event_time','http://localhost:5000/api/FileIntegrityInfo/all'); // 这将返回DataItem[]类型的数据
  const n = useExtractMetaData('ip','60.218.244.31','http://localhost:5000/api/asset_mapping/all');
  const metaData=useExtractMeta('hostIP','http://localhost:5000/api/FileIntegrityInfo/all' )

  return (
    <DataContext.Provider value={{topFiveFimData,n,metaData}}>
      {children}
    </DataContext.Provider>
  );
};

export default DataManager;
