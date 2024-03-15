// dataService.ts
import axios from 'axios';
import {GenericDataItem} from '../tableUtils'

interface FetchDataParams {
    apiEndpoint: string;
    // sqlTableName: string;
    // fields?: string[];
}

export const fetchDataFromAPI = async ({ apiEndpoint}: FetchDataParams): Promise<any[]> => {
    //let fieldsQuery = fields && fields.length > 0 ? fields.join(',') : '*';
    let endpoint = `${apiEndpoint}`;//?table=${sqlTableName}&fields=${fieldsQuery}

    // const response = await axios.get(endpoint, {
    //     headers: {
    //         Authorization: `aa.bb.cc` // 示例 JWT 令牌
    //     }
    // });
    const response = await axios.get(endpoint);
     if (response.data) {//&& response.data.status === 200，注意，当response包含message和status两个字段时，不能够用 && response.data.length > 0 判断，因为length属性以及不存在了
        const messageJsonString = JSON.stringify(response.data.message, null, 2);
        console.log("Received message:", messageJsonString);
        return response.data.message;
        // const messageJsonString = JSON.stringify(response.data, null, 2);
        // console.log("Received message:", messageJsonString);
        // return response.data;
    }

    throw new Error('No data received from endpoint');
};

export const buildRangeQueryParams = (startDate: string, endDate: string, timeColumnDataIndex: string) => {
    // 构建查询字符串或参数对象
    return `/query_time?field=${timeColumnDataIndex}&start_time=${startDate}&end_time=${endDate}`;
};
// processData 函数
export const processData = (data: GenericDataItem[], timeColumnIndex?: string[]): GenericDataItem[] => {
    return data.map(item => {
        // 时间转换
        if (timeColumnIndex) {
            timeColumnIndex.forEach(column => {
                if (item[column]) {
                    item[column] = convertUnixTime(parseFloat(item[column]));
                }
            });
        }

        // 如果有其他数据处理逻辑，如排序，可以在此添加
        // ...

        return item;
    });
};
// 从 apiEndpoint 提取倒数第一个 / 和倒数第二个 / 之间的字符串
// export const extractTbnameFromApiEndpoint = (apiEndpoint: string): string | undefined => {
//     const lastSlashIndex = apiEndpoint.lastIndexOf('/');
//     const secondLastSlashIndex = apiEndpoint.lastIndexOf('/', lastSlashIndex - 1);

//     if (lastSlashIndex !== -1 && secondLastSlashIndex !== -1) {
//         return apiEndpoint.substring(secondLastSlashIndex + 1, lastSlashIndex);
//     }

//     return undefined;
// };

// export const processData = (data: GenericDataItem[], timeColumnIndex?: string[], tbname?: string): GenericDataItem[] => {
//     return data.map(item => {
//         // 时间转换
//         if (timeColumnIndex) {
//             timeColumnIndex.forEach(column => {
//                 if (item[column]) {
//                     item[column] = convertUnixTime(parseFloat(item[column]));
//                 }
//             });
//         }

//         // 动态修改 dataIndex
//         if (tbname) {
//             Object.keys(item).forEach(key => {
//                 const newKey = `${tbname}_${key}`;
//                 item[newKey] = item[key];
//                 delete item[key];
//             });
//         }

//         // 如果有其他数据处理逻辑，如排序，可以在此添加
//         // ...

//         return item;
//     });
// };



// 辅助函数：将 UNIX 时间戳转换为可读的日期格式
// 辅助函数：将 UNIX 时间戳转换为指定格式的日期字符串
export const convertUnixTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};




//     const newColumns = columns.map(column => {
//       if (column.onFilter && dataSource) {
//         const fieldVarieties = new Set(dataSource.map(item => item[column.dataIndex]));
//         const filters = Array.from(fieldVarieties).map(variety => ({
//           text: (
//             <span style={{ color: '#000', background: '#fff' }}>
//               {variety ? variety.toString() : ''}
//             </span>
//           ),
//           value: variety,
//         }));
//         return { ...column, filters };
//       }
//       return column;
//     });

//     return newColumns;
// };

// const fetchLatestData = async () => {
//     try {
//         const data = await fetchDataFromAPI();
//         const sortedData = sortData(data);
//         this.processData(sortedData);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         this.handleFetchError();
//     }
// };

// const fetchDataFromAPI = async () => {
//     const { apiEndpoint, sqlTableName, fields } = this.props;
//     let fieldsQuery = fields && fields.length > 0 ? fields.join(',') : '*';
//     let endpoint = `${apiEndpoint}?table=${sqlTableName}&fields=${fieldsQuery}`;

//     const response = await axios.get(endpoint, {
//         headers: {
//             Authorization: `aa.bb.cc` // 将 JWT 令牌包含在请求头中
//         }
//     });
//     if (response.data && response.data.length > 0) {
//         return response.data;
//     }
//     throw new Error('No data received');
// };

// sortData = (data:GenericDataItem[]) => {
//     const rankLabel = this.props.rankLabel ?? 'defaultRankField';
//     return data.sort((a:any, b:any) => (b[rankLabel] ?? 0) - (a[rankLabel] ?? 0));
// };

// processData = (data:GenericDataItem[]) => {
//     const topFiveData = data.slice(0, 5);
//     this.setState({
//         dataSource: this.convertUnixTimeColumns(data),
//         lastUpdated: new Date().toLocaleString(),
//     });

//     if (this.props.onTopDataChange && this.props.currentPanel) {
//         this.props.onTopDataChange(this.props.currentPanel, topFiveData);
//     }
// };

// handleFetchError = () => {
//     const { externalDataSource } = this.props;
//     if (externalDataSource && externalDataSource.length > 0) {
//         this.setState({
//             dataSource: externalDataSource,
//             lastUpdated: new Date().toLocaleString(),
//         });
//     } else {
//         this.setState({ dataSource: [], lastUpdated: null });
//     }
// };
// extractFieldVarieties = <T extends keyof GenericDataItem>(fieldName: T): Array<{text: string, value: string}> => {
//     const { dataSource } = this.state;
//     const fieldVarieties = new Set<GenericDataItem[T]>();

//     dataSource.forEach((item) => {
//         const fieldValue = item[fieldName];
//         if (fieldValue !== undefined && fieldValue !== null) {
//             fieldVarieties.add(fieldValue);
//         }
//     });

//     return Array.from(fieldVarieties).map(variety => ({
//         text: variety.toString(),
//         value: variety.toString(),
//     }));
// };
// // 自动填充filters的方法,也就是自动填充沙漏里的选项
// autoPopulateFilters = () => {
//     const { columns } = this.props;
//     const { dataSource } = this.state;

//     const newColumns = columns.map(column => {
//       if (column.onFilter && dataSource) {
//         const fieldVarieties = new Set(dataSource.map(item => item[column.dataIndex]));
//         const filters = Array.from(fieldVarieties).map(variety => ({
//           text: (
//             <span style={{ color: '#000', background: '#fff' }}>
//               {variety ? variety.toString() : ''}
//             </span>
//           ),
//           value: variety,
//         }));
//         return { ...column, filters };
//       }
//       return column;
//     });

//     return newColumns;
// };
// updateDataSource = (filteredData:any[]) => {
// this.setState({ dataSource: filteredData });
// };
// // 在 autoPopulateFilters 方法中，只更新筛选项，不更新 dataSource
// autoPopulateFiltersAndUpdateDataSource = () => {
// const { columns } = this.props;
// const { dataSource, selectedApplicationType, selectedDateRange, searchQuery } = this.state;

// let filteredData = [...dataSource];
// // Apply filters
// columns.forEach(column => {
//     if (column.onFilter) {
//     filteredData = filteredData.filter(record =>
//         record[column.dataIndex].toString().includes(column.filteredValue)
//     );
//     }
// });

// // Apply other filters (application type, date range, search query)
// if (selectedApplicationType) {
//     filteredData = filteredData.filter(record => record.applicationType === selectedApplicationType);
// }

// if (selectedDateRange[0] && selectedDateRange[1]) {
//     filteredData = filteredData.filter(record => {
//     const itemDate = moment(record.occurrenceTime, 'YYYY-MM-DD HH:mm:ss');
//     return (
//         itemDate.isSameOrAfter(selectedDateRange[0], 'day') &&
//         itemDate.isSameOrBefore(selectedDateRange[1], 'day')
//     );
//     });
// }

// if (searchQuery) {
//     filteredData = filteredData.filter(record =>
//     Object.keys(record).some(key =>
//         record[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     );
// }

// // Update the state with the filtered data
// this.updateDataSource(filteredData);

// // Return the updated columns
// return this.autoPopulateFilters();
// };
// //资产指纹--应用--小型侧边栏
// filterDataByApplicationType = (data: GenericDataItem[]) => {
//     return data.filter((item) =>
//         this.state.selectedApplicationType
//             ? item.applicationType === this.state.selectedApplicationType
//             : true
//     );
// };