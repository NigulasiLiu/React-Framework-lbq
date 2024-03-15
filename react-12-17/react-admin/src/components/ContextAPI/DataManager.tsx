// src/components/DataManager.tsx
import React, { createContext } from 'react';
import { useFimData } from './useFimData';
import { DataItem } from '../tableUtils';

export const DataContext = React.createContext<DataItem[] | undefined>(undefined);

// // 更新DataContext的类型定义，使之与DataItem[]匹配
// export const DataContext = createContext<DataItem[] | undefined>(undefined);

const DataManager: React.FC = ({ children }) => {
  const topFiveData = useFimData(); // 这将返回DataItem[]类型的数据

  return (
    <DataContext.Provider value={topFiveData}>
      {children}
    </DataContext.Provider>
  );
};

export default DataManager;
