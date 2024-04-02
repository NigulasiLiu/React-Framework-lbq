// dataService.ts
import axios from 'axios';
import {GenericDataItem,AgentInfoType} from '../tableUtils'
import {message,} from 'antd'

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
        //console.log("Received message"+endpoint+":", messageJsonString);
        message.info('data source:'+endpoint+' received successfully');
        return response.data.message;
        // const messageJsonString = JSON.stringify(response.data, null, 2);
        // console.log("Received message:", messageJsonString);
        // return response.data;
    } else {
      message.error('采集失败: ' + response.data.message);
    }

    throw new Error('No data received from endpoint');
};
export const fetchDataFromAPI_2 = async ({ apiEndpoint }: FetchDataParams): Promise<Map<string, AgentInfoType>> => {
  try {
    const endpoint = `${apiEndpoint}`;
    const response = await axios.get<{ message: AgentInfoType[] }>(endpoint);

    if (response.data && response.data.message) {
      const dataMap = new Map<string, AgentInfoType>();
      response.data.message.forEach((item: AgentInfoType) => {
        // 确保id是字符串类型
        const id = String(item.id);
        dataMap.set(id, item);
      });
      return dataMap;
    } else {
      message.error('采集失败');
      throw new Error('No data received from endpoint');
    }
  } catch (error) {
    message.error('采集失败');
    throw new Error('Fetch data failed');
  }
};

// export const fetchDataFromAPI_2 = async ({ apiEndpoint }: FetchDataParams): Promise<Map<string, Map<string, any>>> => {
//   let endpoint = `${apiEndpoint}`;
//   try {
//     const response = await axios.get(endpoint);
//     if (response.data && response.data.message) {
//       message.info('Data source: ' + endpoint + ' received successfully');
//       // 初始化一个 Map，其键是 id 的值，值是包含具体信息的 Map
//       const resultMap = new Map<string, Map<string, any>>();
//       response.data.message.forEach((obj: any) => {
//         const detailMap = new Map<string, any>();
//         Object.keys(obj).forEach(key => {
//           detailMap.set(key, obj[key]);
//         });
//         // 假设每个对象都有一个唯一的 id 字段
//         if (obj.id !== undefined) {
//           resultMap.set(obj.id.toString(), detailMap);
//         }
//       });
//       return resultMap;
//     } else {
//       message.error('采集失败: ' + (response.data ? response.data.message : 'Unknown error'));
//     }
//   } catch (error) {
//     console.error('Error fetching data from:', endpoint, error);
//     message.error('Error fetching data.');
//     throw new Error('No data received from endpoint');
//   }
//   return new Map(); // 如果有异常，返回空的 Map
// };
// export const fetchDataFromAPI_2 = async ({ apiEndpoint }: FetchDataParams): Promise<Map<string, any>[]> => {
//   let endpoint = `${apiEndpoint}`;
//   try {
//       const response = await axios.get(endpoint);
//       if (response.data && response.data.message) {
//           message.info('Data source: ' + endpoint + ' received successfully');
//           // 将每个对象转换为 Map
//           const resultMapArray = response.data.message.map((obj: any) => {
//               const resultMap = new Map<string, any>();
//               Object.keys(obj).forEach(key => {
//                   resultMap.set(key, obj[key]);
//               });
//               return resultMap;
//           });
//           return resultMapArray;
//       } else {
//           message.error('采集失败: ' + (response.data ? response.data.message : 'Unknown error'));
//       }
//   } catch (error) {
//       console.error('Error fetching data from:', endpoint, error);
//       message.error('Error fetching data.');
//       throw new Error('No data received from endpoint');
//   }
//   return []; // 如果有异常，返回空数组
// };
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
    // 处理嵌套的JSON数据
    if (item.vul_detection_exp_result) {
        item.vul_detection_exp_result = item.vul_detection_exp_result.map((expItem: any) => {
          return {
            ...expItem,
            bug_exp: expItem.bug_exp,
          };
        });
      }
  
      if (item.vul_detection_finger_result) {
        item.vul_detection_finger_result = item.vul_detection_finger_result.map((fingerItem: any) => {
          return {
            ...fingerItem,
            finger: fingerItem.finger,
          };
        });
      }
  
      if (item.vul_detection_poc_result) {
        item.vul_detection_poc_result = item.vul_detection_poc_result.map((pocItem: any) => {
          return {
            ...pocItem,
            bug_poc: pocItem.bug_poc,
          };
        });
      }
        return item;
    });
};

export const processVulnData = (data: GenericDataItem[]): GenericDataItem[] => {
  return data.map(item => {
    // 处理嵌套的JSON数据
      if (item.vul_detection_exp_result) {
        item.vul_detection_exp_result = item.vul_detection_exp_result.map((expItem: any) => {
          return {
            ...expItem,
            bug_exp: expItem.bug_exp,
          };
        });
      }
  
      if (item.vul_detection_finger_result) {
        item.vul_detection_finger_result = item.vul_detection_finger_result.map((fingerItem: any) => {
          return {
            ...fingerItem,
            finger: fingerItem.finger,
          };
        });
      }
  
      if (item.vul_detection_poc_result) {
        item.vul_detection_poc_result = item.vul_detection_poc_result.map((pocItem: any) => {
          return {
            ...pocItem,
            bug_poc: pocItem.bug_poc,
          };
        });
      }
      return item;
    });
};

export const filterDataByTimeRange = (
  processedData: GenericDataItem[],
  timeColumnIndex: string,
  start_time: number,
  end_time: number
): GenericDataItem[] => {
  return processedData.filter(item => {
    const itemTime = parseFloat(item[timeColumnIndex]);
    return itemTime >= start_time && itemTime <= end_time;
  });
};







export const processData1 = (data: any[], timeColumnIndex?: string[]): any[] => {
    return data.map(item => {
      // 时间转换
      if (timeColumnIndex) {
        timeColumnIndex.forEach(column => {
          if (item[column]) {
            item[column] = convertUnixTime(parseFloat(item[column]));
          }
        });
      }
  
      // 处理嵌套的JSON数据，准备 Tooltip 文本
      const prepareTooltipText = (nestedData: any[], key: string) => {
        return nestedData.map(nestedItem => {
          const { id, ip, scanTime, scanType, port, url } = nestedItem;
          // 根据具体需求调整展示的字段
          return `ID: ${id}, IP: ${ip}, Scan Time: ${scanTime}, Scan Type: ${scanType}` +
                 (port ? `, Port: ${port}` : '') +
                 (url ? `, URL: ${url}` : '');
        }).join('; ');
      };
  
      // 映射每种类型的结果为一个 Tooltip 文本字符串
      if (item.vul_detection_exp_result) {
        item.vul_detection_exp_result_tooltip = prepareTooltipText(item.vul_detection_exp_result, 'bug_exp');
      }
      if (item.vul_detection_finger_result) {
        item.vul_detection_finger_result_tooltip = prepareTooltipText(item.vul_detection_finger_result, 'finger');
      }
      if (item.vul_detection_poc_result) {
        item.vul_detection_poc_result_tooltip = prepareTooltipText(item.vul_detection_poc_result, 'bug_poc');
      }
  
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

