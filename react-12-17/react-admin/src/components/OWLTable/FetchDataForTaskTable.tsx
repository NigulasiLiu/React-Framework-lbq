import React, { useState, useEffect, useContext } from 'react';
import TaskDisplayTable from './TaskDisplayTable';
import { DataContext } from '../ContextAPI/DataManager';

interface FetchAPIDataTableProps {
    table_type?: string;
    apiEndpoint: string;
    columns: any[];
    timeColumnIndex: string[];
    currentPanel: string;
    childrenColumnName?: string;
    indentSize?: number;
    expandedRowRender?: (record: any) => React.ReactNode;
    onSelectedRowKeysChange?: (selectedRowKeys: React.Key[]) => void;
    keyIndex?: number;
    search?: string[];
    handleReload?: () => void;
}

export const FetchDataForTaskTable: React.FC<FetchAPIDataTableProps> = ({
                                                                              table_type,
                                                                              apiEndpoint,
                                                                              columns,
                                                                              timeColumnIndex,
                                                                              currentPanel,
                                                                              childrenColumnName,
                                                                              indentSize,
                                                                              expandedRowRender,
                                                                              onSelectedRowKeysChange,
                                                                              keyIndex,
                                                                              search,
                                                                              handleReload,
                                                                              ...otherProps
                                                                          }) => {
    const context = useContext(DataContext);
    const [data, setData] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const fetchData = async () => {
        const result = await context!.fetchLatestData(apiEndpoint, '', '', '', timeColumnIndex);
        setData(result);
    };

    // 在组件内部，当 selectedRowKeys 更新时调用这个函数
    const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
        onSelectedRowKeysChange?.(selectedKeys);
    };

    useEffect(() => {
        fetchData();
    }, [apiEndpoint, timeColumnIndex]); // 仅在 apiEndpoint 或 timeColumnIndex 变化时重新请求数据

    return (
        <div style={{ width: '100%', margin: '0px auto' }}>
            <TaskDisplayTable
                apiEndpoint={apiEndpoint}
                externalDataSource={data}
                columns={columns}
                timeColumnIndex={timeColumnIndex.length > 0 ? timeColumnIndex : []}
                currentPanel={currentPanel}
                searchColumns={search}
                fetchLatestData={context!.fetchLatestData}
                onSelectedRowKeysChange={handleRowSelectionChange}
                keyIndex={keyIndex || 0}
                childrenColumnName={childrenColumnName}
                expandedRowRender={expandedRowRender}
                handleReload={handleReload}
            />
        </div>
    );
};

export default FetchDataForTaskTable;


// // FetchDataForTaskTable.tsx
// import React, { useState, useEffect, useContext } from 'react';
// import TaskDisplayTable from './TaskDisplayTable';
// import { DataContext } from '../ContextAPI/DataManager'
//
// import axios from 'axios';
//
//
// interface FetchAPIDataTableProps {
//   table_type?: string;
//
//   apiEndpoint: string;
//   columns: any[];
//   timeColumnIndex: string[];
//   currentPanel: string;
//   //prePanel:string;
//   // ... 其他需要的 props
//   childrenColumnName?: string; // 作为可选属性
//   indentSize?: number; // 也可以声明为可选属性，如果您希望为其提供默认值
//   expandedRowRender?: (record: any) => React.ReactNode; // 添加expandedRowRender属性
//
//
//   onSelectedRowKeysChange?: (selectedRowKeys: React.Key[]) => void;
//   keyIndex?: number;
//   search?:string[];
//
//   handleReload?: () => void;
// }
//
//
// export const FetchDataForTaskTable: React.FC<FetchAPIDataTableProps> = ({
//   table_type,
//   apiEndpoint, columns, timeColumnIndex, currentPanel, childrenColumnName, indentSize, expandedRowRender,
//   onSelectedRowKeysChange, keyIndex, search, handleReload,...otherProps }) => {
//
//   const context = useContext(DataContext);
//   const [data, setData] = useState<any[]>([]);
//
//
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
//
//
//   // 在组件内部，当 selectedRowKeys 更新时调用这个函数
//   const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
//     setSelectedRowKeys(selectedKeys);
//     onSelectedRowKeysChange?.(selectedKeys); // 通知父组件
//   };
//
//
//   useEffect(() => {
//     // 清空数据
//     // setData([]);
//     const fetchData = async () => {
//       const result = await context!.fetchLatestData(apiEndpoint, '', '', '', timeColumnIndex);
//       setData(result);
//     };
//
//     fetchData();
//   }, [context, apiEndpoint, timeColumnIndex]);
//
//
//   return (
//     <div style={{ width: '100%', margin: '0px auto' }}>
//       <TaskDisplayTable
//         // key={currentPanel}
//         apiEndpoint={apiEndpoint}
//         externalDataSource={data}
//         columns={columns}
//         timeColumnIndex={timeColumnIndex.length > 0 ? timeColumnIndex : []}//可能有多个时间戳，但是默认第一个时间戳值用于rangePicker，所有值都会从unix时间转为年月日时分秒
//         currentPanel={currentPanel}
//         searchColumns={search}
//         //prePanel={prePanel}
//
//         fetchLatestData={context!.fetchLatestData}
//
//         onSelectedRowKeysChange={handleRowSelectionChange}
//         keyIndex={keyIndex || 0}
//         //handleApplicationTypeSelect={/* 对应的函数 */}
//         //renderSearchFieldDropdown={/* 对应的函数 */}
//         //handleSearch={/* 对应的函数 */}
//         childrenColumnName={childrenColumnName}
//         expandedRowRender={expandedRowRender}
//       //indentSize={indentSize}
//         handleReload={handleReload}
//       />
//     </div>
//   );
// };
//
// export default FetchDataForTaskTable;//标题相同的Table可以复用DataFecther,但调用不同的接口，保持colums不变的同时筛选数据
