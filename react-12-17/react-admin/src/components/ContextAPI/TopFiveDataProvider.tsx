// src/hooks/useSortedData.tsx
import { useState, useEffect } from 'react';
import { fetchDataFromAPI, processData } from '../AssetsCenter/DataService';
import { DataItem, GenericDataItem } from '../tableUtils';
import { templateData } from './SeperateData';

const useSortedData = (columnName:string, sortKey: string, apiEndpoint: string) => {
  const [sortedData, setSortedData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchAndSortData = async () => {
      console.log('Fetching data...');
      try {
        const rawData = await fetchDataFromAPI({ apiEndpoint });
        const sortedGenericData = rawData.sort((a, b) => {
          const aValue = a[sortKey] ?? -Infinity;
          const bValue = b[sortKey] ?? -Infinity;
          return bValue - aValue;
        }).slice(0, 5);
        
        const processedData = processData(sortedGenericData, [sortKey]);
        const sortedDataItems = processedData.map((item, index) => ({
          ...templateData[index],
          id: item[columnName], // 假设 'columnName' 是我们想要的 'id'
          value: item[sortKey], // 使用动态字段 [sortKey] 作为 'value'
        }));
        setSortedData(sortedDataItems);
        console.log('Data set:', sortedDataItems);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchAndSortData();
  }, [sortKey, apiEndpoint]);

  return sortedData;
};

export default useSortedData;
