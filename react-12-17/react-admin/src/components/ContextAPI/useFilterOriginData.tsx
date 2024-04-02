import { message } from 'antd';
import { useState, useEffect } from 'react';

export interface GenericDataItem {
  [key: string]: any;
}

/**
 * 使用给定的属性名和属性值从原始数据中筛选出符合条件的数据条目。
 * 
 * @param attributeName - 要筛选的属性名称。
 * @param attributeValue - 要匹配的属性值。
 * @param originData - 原始数据数组。
 * @returns 符合条件的数据条目数组。
 */
export const useFilterOriginData = (attributeName: string, attributeValue: string, originData: any[]): GenericDataItem[] => {
  const [filteredData, setFilteredData] = useState<GenericDataItem[]>([]);

  useEffect(() => {
    const fetchDataAndFilter = () => {
      try {
        // 使用filter方法来筛选出包含特定属性值的条目
        const result: GenericDataItem[] = originData.filter(item => item[attributeName] === attributeValue);
        setFilteredData(result);
        message.info(result[0]['cpu_use']);
      } catch (error) {
        console.error('Failed to fetch and filter data:', error);
      }
    };

    fetchDataAndFilter();
  }, [attributeName, attributeValue, originData]);

  return filteredData;
};
