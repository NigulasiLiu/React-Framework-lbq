import { useState, useEffect } from 'react';

// 定义返回的数据结构类型
export interface MetaDataResult {
  tupleCount: number;
  typeCount: Map<string, number>;
  details: Map<string, Map<string, number>>;
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
