// FetchAPIDataTable.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchDataFromAPI, processData } from './DataService';
import CustomDataTable from './CustomDataTable';

interface FetchAPIDataTableProps {
    apiEndpoint: string;

    columns: any[];
    timeColumnIndex: string[];
    currentPanel:string;
    // ... 其他需要的 props
}

export const FetchAPIDataTable: React.FC<FetchAPIDataTableProps> = ({ apiEndpoint, columns, timeColumnIndex,currentPanel, ...otherProps }) => {
  const [data, setData] = useState<any[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rangeQuery, setRangeQuery] = useState<string>('');

  const handleUpdateSearchField = (field: string) => {
    setSearchField(field);
    // 可以在这里调用 fetchLatestData 以立即更新数据
  };
  const handleUpdateSearchQuery = (query: string) => {
      setSearchQuery(query);
      // 可以在这里调用 fetchLatestData 以立即更新数据
  };
  const onUpdateRangeField = (rangeQueryParams: string) => {
    setRangeQuery(rangeQueryParams);
    // 可以在这里调用 fetchLatestData 以立即更新数据
  };
  // 更新 handleFetchLatestData 以接受搜索字段和搜索查询
  const handleFetchLatestData = (field: string, query: string, rangeQueryParams:string) => {
    fetchLatestData(field, query, rangeQueryParams);
  };

  // const fetchLatestData = async () => {
  //   try {
  //       const rawData = await fetchDataFromAPI({ apiEndpoint, sqlTableName, fields });
  //       const processedData = processData(rawData, timeColumnIndex);
  //       setData(processedData);
  //   } catch (error) {
  //       console.error('Error fetching data:', error);
  //   }
  // };
  // 用于构建查询参数
  
  const buildQueryParams = (searchField:string, searchQuery:string) => {
    let queryParams = '';
    if (searchField && searchQuery) {
        queryParams = `?${encodeURIComponent(searchField)}=${encodeURIComponent(searchQuery)}`;
        //queryParams = `?${searchField}=${searchQuery}`;
    }
    return queryParams;
  };

  const fetchLatestData = useCallback(async (searchField:string, searchQuery:string, rangeQuery:string) => {
    try {
        // 构建查询参数，范围查询(rangePicker)时，searchField为空,searchQuery是已经构造好的语句
        const finalEndpoint = rangeQuery.length?
          `${apiEndpoint}${rangeQuery}`:`${apiEndpoint}${buildQueryParams(searchField, searchQuery)}`;

        const rawData = await fetchDataFromAPI({ apiEndpoint: finalEndpoint});
        const processedData = processData(rawData, timeColumnIndex);
        setData(processedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }, [apiEndpoint, timeColumnIndex]);

  useEffect(() => {
    fetchLatestData(searchField, searchQuery, rangeQuery);
}, [apiEndpoint, searchField, searchQuery, rangeQuery, fetchLatestData]);

    //const timeColumnIndexChecked = this.props.timeColumnIndex?.length > 0 ? this.props.timeColumnIndex : [];
    // 假设 columns 是根据数据动态生成的，或者可以从 props 传入
    //const columns:any = []; // 根据需要定义列
    // 使用 useCallback 包装 fetchLatestData
    // const fetchLatestData = useCallback(async (searchField: string, searchQuery: string) => {
    //   try {
    //       const queryParams = buildQueryParams(searchField, searchQuery);
    //       const finalEndpoint = `${apiEndpoint}${queryParams}`;

    //       const rawData = await fetchDataFromAPI({ apiEndpoint: finalEndpoint, sqlTableName, fields });
    //       const processedData = processData(rawData, timeColumnIndex);
    //       setData(processedData);
    //   } catch (error) {
    //       console.error('Error fetching data:', error);
    //   }
    // }, [apiEndpoint, timeColumnIndex]); // 添加依赖项

    // useEffect(() => {
    //     fetchLatestData('', '');
    // }, [fetchLatestData]); // fetchLatestData 现在是稳定的
    return (
      <CustomDataTable 
          externalDataSource={data} 
          columns={columns} 
          timeColumnIndex={timeColumnIndex.length>0?timeColumnIndex:[]}//第一个值用于rangePicker，所有值都会从unix时间转为年月日时分秒
          //sqlTableName="file_integrity_info"
          currentPanel={currentPanel}
          fetchLatestData={handleFetchLatestData}
          onUpdateSearchField={handleUpdateSearchField}
          onUpdateSearchQuery={handleUpdateSearchQuery}
          onUpdateRangeField={onUpdateRangeField}
          //handleApplicationTypeSelect={/* 对应的函数 */}
          //renderSearchFieldDropdown={/* 对应的函数 */}
          //handleSearch={/* 对应的函数 */}
      />
    );
};

export default FetchAPIDataTable;//标题相同的Table可以复用DataFecther,但调用不同的接口，保持colums不变的同时筛选数据
