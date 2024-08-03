// dataService.ts
import axios from 'axios';
import { GenericDataItem, AgentInfoType } from '../Columns'
import { message, } from 'antd'
import umbrella from 'umbrella-storage';
import { Redirect } from 'react-router-dom';
import { APP_Server_URL } from '../../service/config';

interface FetchDataParams {
  apiEndpoint: string;
  requestType?: 'get' | 'post' | 'delete'; // 可选请求类型为 get、post 和 delete
  requestParams?: any;
}

export const cveData = require('./optimized_cve_data_no_description.json'); // 使用适当的路径

let hasAlertBeenShown = false; // 全局变量，用于跟踪是否已经显示过alert
export const fetchDataFromAPI = async ({ apiEndpoint, requestType = 'get', requestParams }: FetchDataParams): Promise<any[]> => {
  let endpoint = `${apiEndpoint}`;
  // 从localStorage获取JWT
  // const token1 = localStorage.getItem('jwt_token'); // 假设JWT存储在localStorage的'jwtToken'键下
  const token = localStorage.getItem('jwt_token');
  // 配置axios请求头部，包括JWT
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined, // 如果存在token则发送，否则不发送Authorization头部
    }
  };
  try {
    const response = await axios.get(endpoint, config);
    if (response.data && response.data.message) {
      // 处理响应数据
      return response.data.message;
    } else {
      // 处理无数据响应
      message.error('采集失败: ' + (response.data.message || '未知错误'));
    }
  } catch (error) {
    // 处理请求错误
    console.error('Request failed:', error);
    // 检查错误状态码，如果是401，则弹出提示窗口并重定向到登录页面
    if (error.response && error.response.status === 401 && !hasAlertBeenShown) {
      hasAlertBeenShown = true; // 设置标志变量，表示已经显示过alert
      window.alert('您的登录状态已过期，请重新登录');
      try {
        await axios.get(`${APP_Server_URL}/api/logout`, config);
      } catch (logoutError) {
        console.error('Logout failed:', logoutError);
      }
      window.location.href = '/login';
    }
    throw error;
  }

  throw new Error('No data received from endpoint');
};

//切割绝对路径为‘路径’+‘文件名’
export const splitFilePath = (filePath: any): { filepath: string; filename: string } => {
  // 将 filePath 转换为字符串
  const filePathString = filePath != null ? String(filePath) : '';

  if (!filePathString) {
    return { filepath: '', filename: '' };
  }

  // 判断应该根据 '/' 还是 '\' 进行切割
  const separator = filePathString.includes('/') ? '/' : '\\';

  // 获取文件名
  const filename = filePathString.split(separator).pop() || '';
  // 获取文件路径
  const filepath = filePathString.slice(0, filePathString.lastIndexOf(separator));

  return { filepath, filename };
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

export const processDataFor = (data: GenericDataItem[], api?: string): GenericDataItem[] => {
  return data.map(item => {
    // 时间转换
    if (item.time && api?.toLowerCase().includes("virus")) {
      item.time = Date.parse(item.time) / 1000; // 转换为Unix时间戳（秒）
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

export const determineOS = (filteredData: any) => {
  // 检查输入数据是否存在以及是否包含 os_version 字段
  if (!filteredData || typeof filteredData.processor_architecture !== 'string') {
    return 'unknown';
  }

  try {
    // 将 os_version 字段转换为小写，并去除空格
    const osVersion = filteredData.processor_architecture.toLowerCase().trim();

    // 根据常见的操作系统版本信息判断操作系统类型
    if (osVersion.includes('windows')) {
      return 'windows';
    } else if (
        osVersion.includes('linux') ||
        osVersion.includes('ubuntu') ||
        osVersion.includes('debian') ||
        osVersion.includes('centos') ||
        osVersion.includes('redhat')
    ) {
      return 'linux';
    } else {
      // 如果无法判断，默认为未知操作系统
      return 'unknown';
    }
  } catch (error) {
    // 处理可能出现的异常，确保函数不会崩溃
    console.error('Error determining OS:', error);
    return 'unknown';
  }
};