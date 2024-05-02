// dataService.ts
import axios from 'axios';
import { GenericDataItem, AgentInfoType } from '../tableUtils'
import { message, } from 'antd'

interface FetchDataParams {
  apiEndpoint: string;
  // sqlTableName: string;
  // fields?: string[];
}

export const fetchDataFromAPI = async ({ apiEndpoint }: FetchDataParams): Promise<any[]> => {
  //let fieldsQuery = fields && fields.length > 0 ? fields.join(',') : '*';
  let endpoint = `${apiEndpoint}`;//?table=${sqlTableName}&fields=${fieldsQuery}

  // const response = await axios.get(endpoint, {
  //     headers: {
  //         Authorization: `aa.bb.cc` // 示例 JWT 令牌
  //     }
  // });
  const response = await axios.get(endpoint);
  if (response.data) {//&& response.data.status === 200，注意，当response包含message和status两个字段时，不能够用 && response.data.length > 0 判断，因为length属性以及不存在了
    //const messageJsonString = JSON.stringify(response.data.message, null, 2);
    //console.log("Received message"+endpoint+":", messageJsonString);
    //message.info('data source:'+endpoint+' received successfully');
    return response.data.message;
    // const messageJsonString = JSON.stringify(response.data, null, 2);
    // console.log("Received message:", messageJsonString);
    // return response.data;
  } else {
    message.error('采集失败: ' + response.data.message);
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
    // if (timeColumnIndex) {
    //     timeColumnIndex.forEach(column => {
    //         if (item[column]) {
    //             item[column] = convertUnixTime(parseFloat(item[column]));
    //         }
    //     });
    // }
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


export const handleExport = (externalDataSource: any[], currentPanel: any,selectedRowKeys: string | any[]) => {
  // 确保 externalDataSource 是数组
  if (!Array.isArray(externalDataSource)) {
      console.error('External data source must be an array.');
      return;
  }

  // 确保 currentPanel 是字符串
  if (typeof currentPanel !== 'string') {
      console.error('Current panel must be a string.');
      return;
  }
 // 筛选出要导出的数据
  const dataToExport = externalDataSource.filter((item) => selectedRowKeys.includes(item.id));
  // 用来存储所有行的字符串数组
  let allRows: string[] = [];

  // 递归函数来处理每一条数据及其嵌套数据
  const processItem = (item: { [x: string]: any; }, prefix = '') => {
      let rowData: string[] = [];
      Object.keys(item).forEach(key => {
          const value = item[key];
          if (Array.isArray(value)) {
              // 对于数组类型的字段，递归处理每一个子项
              value.forEach(subItem => processItem(subItem, prefix + key + "_"));
          } else {
              // 普通字段，直接添加到rowData中
              rowData.push(`${prefix + key}: ${value}`);
          }
      });
      if (rowData.length > 0) {
          allRows.push(rowData.join(', ')); // 将一行的所有数据拼接成一个字符串
      }
  };

  // 遍历数据源，处理每一项数据
  dataToExport.forEach(item => {
      processItem(item);
  });

  // 将所有行数据组合成一个完整的文件内容
  const fileContent = allRows.join('\r\n');

  // 创建Blob对象，并设置类型为text/plain
  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // 创建一个隐藏的下载链接，并模拟点击来下载文件
  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentPanel}_data.txt`; // 下载文件命名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleDelete = (currentPanel: string,selectedRowKeys: string | any[]) =>{
  const panel_to_delete_api = {
    "fim":"http://localhost:5000/api/agent/delete",

  }
}

    
    // handleExport = () => {
    //     // const { data } = this.state;
    //     const data = this.props.externalDataSource;
    //     const { columns } = this.props;

    //     // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
    //     if (this.state.selectedRowKeys.length === 0 || data.length === 0) {
    //         alert('没有可导出的数据');
    //         return;
    //     }

    //     // 筛选出要导出的数据
    //     const dataToExport = data.filter((item) => this.state.selectedRowKeys.includes(item.id));

    //     // 创建 CSV 字符串
    //     let csvContent = '';

    //     // 添加标题行（从 columns 获取列标题）
    //     const headers = columns.map(column => `"${column.title}"`).join(",");
    //     csvContent += headers + "\r\n";

    //     // 添加数据行（根据 columns 的 dataIndex 来获取值）
    //     dataToExport.forEach(item => {
    //         const row = columns.map(column => {
    //             const value = item[column.dataIndex];
    //             return `"${value}"`; // 用引号包裹，以便正确处理包含逗号或换行符的数据
    //         }).join(",");
    //         csvContent += row + "\r\n";
    //     });

    //     // UTF-8 编码的字节顺序标记 (BOM)
    //     const BOM = "\uFEFF";

    //     // 创建 Blob 对象
    //     const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    //     const href = URL.createObjectURL(blob);

    //     // 创建下载链接并点击
    //     const link = document.createElement('a');
    //     link.href = href;
    //     link.download = this.props.currentPanel + '_export.csv';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    
    
    

// export const processData1 = (data: any[], timeColumnIndex?: string[]): any[] => {
//     return data.map(item => {
//       // 时间转换
//       // if (timeColumnIndex) {
//       //   timeColumnIndex.forEach(column => {
//       //     if (item[column]) {
//       //       item[column] = convertUnixTime(parseFloat(item[column]));
//       //     }
//       //   });
//       // }

//       // 处理嵌套的JSON数据，准备 Tooltip 文本
//       const prepareTooltipText = (nestedData: any[], key: string) => {
//         return nestedData.map(nestedItem => {
//           const { id, ip, scanTime, scanType, port, url } = nestedItem;
//           // 根据具体需求调整展示的字段
//           return `ID: ${id}, IP: ${ip}, Scan Time: ${scanTime}, Scan Type: ${scanType}` +
//                  (port ? `, Port: ${port}` : '') +
//                  (url ? `, URL: ${url}` : '');
//         }).join('; ');
//       };

//       // 映射每种类型的结果为一个 Tooltip 文本字符串
//       if (item.vul_detection_exp_result) {
//         item.vul_detection_exp_result_tooltip = prepareTooltipText(item.vul_detection_exp_result, 'bug_exp');
//       }
//       if (item.vul_detection_finger_result) {
//         item.vul_detection_finger_result_tooltip = prepareTooltipText(item.vul_detection_finger_result, 'finger');
//       }
//       if (item.vul_detection_poc_result) {
//         item.vul_detection_poc_result_tooltip = prepareTooltipText(item.vul_detection_poc_result, 'bug_poc');
//       }

//       return item;
//     });
// };




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

