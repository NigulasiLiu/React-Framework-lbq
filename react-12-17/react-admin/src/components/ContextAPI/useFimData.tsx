// // src/components/useFimData.tsx
// import { useState, useEffect } from 'react';
// import { fetchDataFromAPI, processData} from '../AssetsCenter/DataService';
// import { DataItem } from '../tableUtils';
// interface GenericDataItem {
//   [key: string]: any;
// }
// const templateData: DataItem[] = [
//     { key: '1', id: '', value: 0, color: '#F24040' },
//     { key: '2', id: '', value: 0, color: '#F77237' },
//     { key: '3', id: '', value: 0, color: '#E5BA4A' },
//     { key: '4', id: '', value: 0, color: '#F2F3F5' },
//     { key: '5', id: '', value: 0, color: '#F2F3F5' },
//   ];
// const sortAndExtractTopFive = (data: GenericDataItem[]): GenericDataItem[] => {
//   // 假设我们根据某个属性进行排序，这里用 "value" 作为示例
//   return data.sort((a, b) => b.value - a.value).slice(0, 5);
// };
// // const sortAndExtractTopFive = (data: GenericDataItem[]) => {
// //     const timeColumn = this.props.columns.find(column => column.title === this.props.timeColumnIndex);
// //     if (timeColumn && timeColumn.dataIndex) {
// //       const sorted = [...data].sort((a, b) => {
// //         return b[timeColumn.dataIndex] - a[timeColumn.dataIndex];
// //       }).slice(0, 5); // 取排序后的前五条数据

// //       this.setState({ topFiveSortedData: sorted });
// //     }
// //   };
// const topFiveData_default: GenericDataItem[] = [
//     // 假设这是从某处获取的 topFiveData
//     { filename: 'nginx', event_time: 1 },
//     { filename: 'bash', event_time: 1 },
//     { filename: 'java', event_time: 1 },
//     { filename: 'nginx uploader', event_time: 1 },
//     { filename: 'prometheus', event_time: 1 },
//   ];
// export const useFimData = () => {
//   const [topFiveData, setTopFiveData] = useState<DataItem[]>([]);

//     // 转换函数
//     const convertToDataItems = (topFiveData: GenericDataItem[], propNameI: string, propNameJ: string): DataItem[] => {
//     return topFiveData.map((item, index) => ({
//     ...templateData[index], // 复制 key 和 color
//     id: item[propNameI], // 假设第 i 项属性值替换 id
//     value: item[propNameJ], // 假设第 j 项属性值替换 value
//     }));
// };
//   useEffect(() => {
//     const fetchFimData = async () => {
//       try {
//         //const response = await fetch('http://localhost:5000/api/FileIntegrityInfo/all');
//         const rawData = await fetchDataFromAPI({ apiEndpoint: 'http://localhost:5000/api/FileIntegrityInfo/all'});
//         const processedData = processData(rawData, ['event_time']);
//         //const data: GenericDataItem[] = await response.json();
//         // 应用 sortAndExtractTopFive 函数处理数据
//         const sortedTopFiveData = sortAndExtractTopFive(processedData);
//         setTopFiveData(sortedTopFiveData);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       }
//     };

//     fetchFimData();
//     setTopFiveData(convertToDataItems(topFiveData?topFiveData:topFiveData_default, 'filename', 'event_time'));
//   }, []);

//   return topFiveData;
// };
// src/components/useFimData.tsx
import { useState, useEffect } from 'react';
import { fetchDataFromAPI, processData } from '../AssetsCenter/DataService';
import { DataItem } from '../tableUtils';

interface GenericDataItem {
  [key: string]: any;
}

const templateData: DataItem[] = [
  { key: '1', id: '', value: 0, color: '#F24040' },
  { key: '2', id: '', value: 0, color: '#F77237' },
  { key: '3', id: '', value: 0, color: '#E5BA4A' },
  { key: '4', id: '', value: 0, color: '#F2F3F5' },
  { key: '5', id: '', value: 0, color: '#F2F3F5' },
];
// const sortAndExtractTopFive = (data: GenericDataItem[]) => {
//     const timeColumn = this.props.columns.find(column => column.title === this.props.timeColumnIndex);
//     if (timeColumn && timeColumn.dataIndex) {
//       const sorted = [...data].sort((a, b) => {
//         return b[timeColumn.dataIndex] - a[timeColumn.dataIndex];
//       }).slice(0, 5); // 取排序后的前五条数据

//       this.setState({ topFiveSortedData: sorted });
//     }
//   };
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
