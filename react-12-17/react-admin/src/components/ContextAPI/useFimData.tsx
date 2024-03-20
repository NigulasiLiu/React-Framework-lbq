// src/components/useFimData.tsx
import { useState, useEffect } from 'react';
import { fetchDataFromAPI, processData } from '../AssetsCenter/DataService';
import { DataItem, GenericDataItem, } from '../tableUtils';
import { templateData } from './SeperateData';


const sortAndExtractTopFive = (data: GenericDataItem[], sortKey: string): GenericDataItem[] => {
    return data.sort((a, b) => {
      // 假设所有数据都有 sortKey 指定的属性，并且它们的值可以直接用于排序
      // 这里使用了可选链操作符和 nullish coalescing 操作符来处理 undefined 或 null 的情况
      const aValue = a[sortKey] ?? -Infinity;
      const bValue = b[sortKey] ?? -Infinity;
      return bValue - aValue;
    }).slice(0, 5);
};

export const useFimData = () => {
  const [topFiveData, setTopFiveData] = useState<DataItem[]>([]); // Updated to use DataItem[] type

  useEffect(() => {
    const fetchFimData = async () => {
        console.log('Fetching data...');
      try {
        const rawData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/FileIntegrityInfo/all' });
        //排序
        const sortedTopFiveGenericData = sortAndExtractTopFive(rawData,'event_time');
        //去除unix时间戳
        const processedData = processData(sortedTopFiveGenericData, ['event_time']);
        // Convert and update state
        const sortedTopFiveDataItems = processedData.map((item, index) => ({
          ...templateData[index],
          id: item.filename, // Assuming 'filename' is the desired 'id'
          value: item.event_time, // Assuming 'event_time' is the desired 'value'
        }));
        setTopFiveData(sortedTopFiveDataItems);
        console.log('Data set:', sortedTopFiveDataItems);
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Optionally handle error state
      }
    };

    fetchFimData();
  }, []);

  return topFiveData;
};
