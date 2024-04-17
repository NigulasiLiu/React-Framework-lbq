// FetchAPIDataTable.tsx
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { fetchDataFromAPI, processData} from './DataService';
import CustomDataTable from './CustomDataTable';
import { DataContext, DataContextType} from '../ContextAPI/DataManager'

import axios from 'axios';


interface FetchAPIDataTableProps {
    table_type?:string;

    apiEndpoint: string;
    columns: any[];
    timeColumnIndex: string[];
    currentPanel:string;
    //prePanel:string;
    // ... 其他需要的 props
    childrenColumnName?: string; // 作为可选属性
    indentSize?: number; // 也可以声明为可选属性，如果您希望为其提供默认值
    expandedRowRender?: (record: any) => React.ReactNode; // 添加expandedRowRender属性


    onSelectedRowKeysChange?: (selectedRowKeys: React.Key[]) => void;
    keyIndex?: number; 
}


export const FetchAPIDataTable: React.FC<FetchAPIDataTableProps> = ({ 
  table_type, apiEndpoint, columns, timeColumnIndex,currentPanel, childrenColumnName, indentSize, expandedRowRender, onSelectedRowKeysChange, keyIndex, ...otherProps }) => {
    
  const context = useContext(DataContext);
  const [data, setData] = useState<any[]>([]);


  const [searchField, setSearchField] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rangeQuery, setRangeQuery] = useState<string>('');

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length > 0) {
        try {
            // 发送 DELETE 请求
            await axios.delete(`${apiEndpoint}/delete`, { data: { ids: selectedRowKeys } });
            // 重新获取数据
            context!.fetchLatestData('all', '', '');
        } catch (error) {
            console.error('Error deleting data:', error);
            // 处理删除失败的情况
        }
    }
  };
    // 在组件内部，当 selectedRowKeys 更新时调用这个函数
    const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
      onSelectedRowKeysChange?.(selectedKeys); // 通知父组件
    };
  const handleUpdateSearchField = (field: string) => {
    setSearchField(field);
    
  };
  const handleUpdateSearchQuery = (query: string) => {
      setSearchQuery(query);

  };
  const onUpdateRangeField = (rangeQueryParams: string) => {
    setRangeQuery(rangeQueryParams);
    
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await context!.fetchLatestData(apiEndpoint, '', '', '', timeColumnIndex);
      setData(result);
    };

    fetchData();
  }, [context, apiEndpoint, timeColumnIndex]);
  

  // 更新 handleFetchLatestData 以接受搜索字段和搜索查询
  // const handleFetchLatestData = (field: string, query: string, rangeQueryParams:string) => {
  //   fetchLatestData(field, query, rangeQueryParams);
  // };

  // 用于构建查询参数

  // const buildQueryParams = (searchField:string, searchQuery:string) => {
  //   let queryParams = '';
  //   if(searchField === 'all' || searchQuery === ''){
  //       queryParams = '/all';
  //   }
  //   else if (searchField !== 'all' && searchField && searchQuery) {
  //       queryParams = `/query?${encodeURIComponent(searchField)}=${encodeURIComponent(searchQuery)}`;
  //       //queryParams = `?${searchField}=${searchQuery}`;
  //   }
  //   return queryParams;
  // };

  // const fetchLatestData = useCallback(async (searchField:string, searchQuery:string, rangeQuery:string) => {
  //   try {
  //     //setData([]);
  //       // 构建查询参数，范围查询(rangePicker)时，searchField为空,searchQuery是已经构造好的语句

  //       const finalEndpoint = apiEndpoint.includes('=')?apiEndpoint:
  //       rangeQuery.length?`${apiEndpoint}${rangeQuery}`:`${apiEndpoint}${buildQueryParams(searchField, searchQuery)}`;
  //       //const finalEndpoint = rangeQuery.length?`${apiEndpoint}${rangeQuery}`:`${apiEndpoint}${buildQueryParams(searchField, searchQuery)}`;
  //       const rawData = await fetchDataFromAPI({ apiEndpoint: finalEndpoint});//http://localhost:5000/+finalEndpoint
        
  //       // 检查 message 字段是否是数组，如果不是，则将其转换为包含该对象的数组
  //       const messageData = Array.isArray(rawData) ? rawData : [rawData];

  //       const processedData = processData(messageData, timeColumnIndex);
  //       //console.log("processedData:", processedData);
  //       setData(processedData);
  //   } catch (error) {
  //       console.error('Error fetching data:', error);
  //   }
  // }, [apiEndpoint, timeColumnIndex]);


//   useEffect(() => {
//     fetchLatestData(searchField, searchQuery, rangeQuery);
// }, [apiEndpoint, searchField, searchQuery, rangeQuery, fetchLatestData]);



    return (
      <div style={{width:'100%',margin:'0px auto'}}>
      <CustomDataTable 
          apiEndpoint={apiEndpoint}
          externalDataSource={data} 
          columns={columns} 
          timeColumnIndex={timeColumnIndex.length>0?timeColumnIndex:[]}//可能有多个时间戳，但是默认第一个时间戳值用于rangePicker，所有值都会从unix时间转为年月日时分秒
          currentPanel={currentPanel}
          //prePanel={prePanel}
          
          fetchLatestData={context!.fetchLatestData}

          onSelectedRowKeysChange={handleRowSelectionChange}
          keyIndex={keyIndex||0}

          onUpdateSearchField={handleUpdateSearchField}
          onUpdateSearchQuery={handleUpdateSearchQuery}
          onUpdateRangeField={onUpdateRangeField}
          onDeleteSelected={handleDeleteSelected}
          //handleApplicationTypeSelect={/* 对应的函数 */}
          //renderSearchFieldDropdown={/* 对应的函数 */}
          //handleSearch={/* 对应的函数 */}
          childrenColumnName={childrenColumnName}
          expandedRowRender={expandedRowRender}
          //indentSize={indentSize}
      />
      </div>
    );
};

export default FetchAPIDataTable;//标题相同的Table可以复用DataFecther,但调用不同的接口，保持colums不变的同时筛选数据
