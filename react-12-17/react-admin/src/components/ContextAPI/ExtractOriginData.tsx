import { useState, useEffect } from 'react';
import { GenericDataItem } from '../Columns';
// 定义返回的数据结构类型
export interface MetaDataResult {
  tupleCount: number;
  typeCount: Map<string, number>;
  details: Map<string, Map<string, number>>;
};

export const filterDataByAttribute = (data:any[], attributeName:string, attributeValue:any) => {
  // 使用filter方法来筛选出包含特定属性值的条目
  const filteredData: GenericDataItem[] = data.filter(item => item[attributeName] === attributeValue);
  return filteredData;
}
// 获取最大的五个typeCount的值和对应的valueName
export const getTopFiveTypeCounts = (result: MetaDataResult): [string, number][] => {
  if (!result || !result.typeCount) {
    return []; // 返回空数组以防止 result 或 typeCount 为空
  }

  // 将 typeCount Map 转换为数组，然后排序
  const sortedTypeCounts = Array.from(result.typeCount)
      .sort((a, b) => b[1] - a[1]) // 根据计数降序排序
      .slice(0, 5); // 获取前五个

  return sortedTypeCounts;
};

export const getCountPastSevenDays = (result: MetaDataResult, columnName: string): number => {
  const now = new Date(); // 当前时间
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7天前的时间

  let count = 0;

  result.details.forEach((detailMap, valueName) => {
    // valueName 应该是时间值，需要根据具体情况解析
    detailMap.forEach((_, key) => {
      // 尝试解析UNIX时间戳
      let date = new Date(parseInt(key) * 1000);
      if (isNaN(date.getTime())) { // 如果不是有效的UNIX时间戳
        // 尝试解析可读的日期时间字符串
        date = new Date(key);
      }

      if (date >= sevenDaysAgo && date <= now) { // 检查日期是否在过去7天内
        count++;
      }
    });
  });

  return count;
};
export const getPastSevenDaysAlerts = (result: MetaDataResult): number[] => {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // 设置为当天的最后一刻
  const sevenDaysAgoTimestamp = now.getTime() - 6 * 24 * 60 * 60 * 1000; // 7天前的时间戳（包括今天）

  // 初始化过去7天每天的告警数量数组，所有值均为0
  const alertsCountPerDay = new Array(7).fill(0);

  result.typeCount.forEach((count, dateString) => {
    let timestamp = Number(dateString) * 1000; // 转换为毫秒
//console.log('1111:'+timestamp);
    if (isNaN(timestamp)) {
      // 如果不是合法的数字，则尝试解析为日期后获取时间戳
      const parsedDate = new Date(dateString);
      timestamp = parsedDate.getTime();
    }
    //console.log('222:'+sevenDaysAgoTimestamp+'|'+now.getTime());

    // 使用时间戳来判断是否在过去7天内
    if (timestamp >= sevenDaysAgoTimestamp && timestamp <= now.getTime()) {
      // 计算这个时间戳是过去第几天
      const diffDays = Math.floor((now.getTime() - timestamp) / (1000 * 60 * 60 * 24));

      // 根据日期差异更新对应天的告警数量，数组从0开始索引，0代表最近一天
      if (diffDays < 7) {
        alertsCountPerDay[6 - diffDays] += count;
      }
    }
  });

  return alertsCountPerDay;
};



const useExtractOrigin = (columnName: string, originData: any): MetaDataResult => {
  const [result, setResult] = useState<MetaDataResult>({ tupleCount: 0, typeCount: new Map(), details: new Map() });

  useEffect(() => {
    const fetchDataAndCount = async () => {
      try {
        if(columnName==='' || columnName === undefined){
            console.error('columnName should not be null.');
            return;
        }
        const data = originData;
        let tupleCount = data.length;
        let typeCount = new Map<string, number>();
        let details = new Map<string, Map<string, number>>();

        data.forEach((item: any) => {
          const columnValue = item[columnName];
          if (!typeCount.has(columnValue)) {
            typeCount.set(columnValue, 0);
            details.set(columnValue, new Map());
          }
          typeCount.set(columnValue, typeCount.get(columnValue)! + 1);

          // 假设有另一个关键属性 key 用于分类计数
          const countKey = item['key'];
          let detail = details.get(columnValue)!;
          if (!detail.has(countKey)) {
            detail.set(countKey, 0);
          }
          detail.set(countKey, detail.get(countKey)! + 1);
        });

        setResult({ tupleCount, typeCount, details });
      } catch (error) {
        console.error('Failed to fetch and count data:', error);
      }
    };

    fetchDataAndCount();
  }, [columnName, originData]);

  return result;
};

export default useExtractOrigin;
