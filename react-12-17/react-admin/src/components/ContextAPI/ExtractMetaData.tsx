// src/hooks/useExtractMetaData.tsx
import { useState, useEffect } from 'react';
import { fetchDataFromAPI } from '../AssetsCenter/DataService';

const useExtractMetaData = (columnName: string, countKey: string, apiEndpoint: string) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchDataAndCount = async () => {
      console.log(`Fetching data from ${apiEndpoint} and counting entries...`);
      try {
        const data = await fetchDataFromAPI({ apiEndpoint });
        // 计算字段名为 columnName 且值为 countKey 的条目数量
        const countResult = data.reduce((acc: number, item: any) => {
          return item[columnName] === countKey ? acc + 1 : acc;
        }, 0);

        setCount(countResult);
        console.log(`Count of entries where ${columnName} is ${countKey}:`, countResult);
      } catch (error) {
        console.error('Failed to fetch and count data:', error);
      }
    };

    fetchDataAndCount();
  }, [columnName, countKey, apiEndpoint]); // 依赖数组确保任何参数变化都会重新计算

  return count;
};

export default useExtractMetaData;
