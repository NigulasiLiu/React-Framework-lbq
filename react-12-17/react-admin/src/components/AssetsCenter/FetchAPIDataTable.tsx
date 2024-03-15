// FetchAPIDataTable.tsx
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { fetchDataFromAPI, processData} from './DataService';
import CustomDataTable from './CustomDataTable';
import axios from 'axios';


// 创建一个上下文来管理数据状态
export const DataTableContext = createContext<any>(null);

// 自定义钩子以从任何组件中访问 data 和 setData
export const useDataTable = () => {
  return useContext(DataTableContext);
};

interface FetchAPIDataTableProps {
    table_type?:string;

    apiEndpoint: string;
    columns: any[];
    timeColumnIndex: string[];
    currentPanel:string;
    // ... 其他需要的 props
}

export const FetchAPIDataTable: React.FC<FetchAPIDataTableProps> = ({ table_type, apiEndpoint, columns, timeColumnIndex,currentPanel, ...otherProps }) => {
  const [data, setData] = useState<any[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rangeQuery, setRangeQuery] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDeleteSelected = async () => {//通過搜索特定IP，然後選中所有搜搜結果，點擊刪除
    /*現在，我想將await axios.delete(`${apiEndpoint}/delete`, { data: { ids: selectedRowKeys } });修改，然後封裝成一個强化版的函數，因爲在後端我們需要通過讀取?後的參數名稱和值來刪除某個條目，那麽這個强化版的函數可以通過輸入columns中的某個字段比如columns[0].dataIndex來確定要構建的路由參數， */
    if (selectedRowKeys.length > 0) {
        try {
            // 发送 DELETE 请求
            await axios.delete(`${apiEndpoint}/delete`, { data: { ids: selectedRowKeys } });
            // 重新获取数据
            fetchLatestData('all', '', '');
        } catch (error) {
            console.error('Error deleting data:', error);
            // 处理删除失败的情况
        }
    }
  };

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


  // 用于构建查询参数
  
  const buildQueryParams = (searchField:string, searchQuery:string) => {
    let queryParams = '';
    if(searchField === 'all' || searchQuery === ''){
        queryParams = '/all';
    }
    else if (searchField !== 'all' && searchField && searchQuery) {
        queryParams = `/query?${encodeURIComponent(searchField)}=${encodeURIComponent(searchQuery)}`;
        //queryParams = `?${searchField}=${searchQuery}`;
    }
    return queryParams;
  };

  const fetchLatestData = useCallback(async (searchField:string, searchQuery:string, rangeQuery:string) => {
    try {
      //setData([]);
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
      // 通过上下文将数据和 setData 提供给子组件
    const contextValue = { data, setData };

    const final_table_type = table_type?"noraml":"simplified";
    const with_only_search = table_type?(table_type==='with_only_search'):false;

    return (
      <DataTableContext.Provider value={contextValue}>
        <div style={{margin:'0px auto'}}>
        <CustomDataTable 
            externalDataSource={data} 
            columns={columns} 
            timeColumnIndex={timeColumnIndex.length>0?timeColumnIndex:[]}//可能有多个时间戳，但是默认第一个时间戳值用于rangePicker，所有值都会从unix时间转为年月日时分秒
            currentPanel={currentPanel}
            fetchLatestData={handleFetchLatestData}
            onUpdateSearchField={handleUpdateSearchField}
            onUpdateSearchQuery={handleUpdateSearchQuery}
            onUpdateRangeField={onUpdateRangeField}
            onDeleteSelected={handleDeleteSelected}
            onSelectedRowKeysChange={setSelectedRowKeys}
            //handleApplicationTypeSelect={/* 对应的函数 */}
            //renderSearchFieldDropdown={/* 对应的函数 */}
            //handleSearch={/* 对应的函数 */}
        />
        </div>
      </DataTableContext.Provider>
    );
};

export default FetchAPIDataTable;//标题相同的Table可以复用DataFecther,但调用不同的接口，保持colums不变的同时筛选数据
