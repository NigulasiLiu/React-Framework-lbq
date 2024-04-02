import { useState, useEffect } from 'react';

export interface GenericDataItem {
  [key: string]: any;
}

export const useFindFirstMatchingItem = (columnName: string, targetValue: string, originData: any[]): GenericDataItem | undefined => {
  const [matchingItem, setMatchingItem] = useState<GenericDataItem | undefined>();

  useEffect(() => {
    const findAndSetItem = () => {
      if (!columnName || !targetValue || !Array.isArray(originData) || originData.length === 0) {
        console.warn('Invalid inputs for finding the matching item.');
        return;
      }
      // 找到第一个匹配的元组
      const foundItem = originData.find(item => item[columnName] === targetValue);
      setMatchingItem(foundItem);
    };

    findAndSetItem();
  }, [columnName, targetValue, originData]);

  return matchingItem;
};
