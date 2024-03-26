import { useState, useEffect } from 'react';

// 定义返回的数据结构类型
export interface AverageResult {
  average: number | null; // 如果没有数据或列名不存在，返回null
}

const useCalculateAverage = (columnName: string, originData: any[]): AverageResult => {
  const [result, setResult] = useState<AverageResult>({ average: null });

  useEffect(() => {
    const calculateAverage = () => {
      try {
        if (!columnName || originData.length === 0) {
          console.error('Invalid input.');
          return;
        }

        let sum = 0;
        let count = 0;

        originData.forEach((item) => {
          let value = item[columnName];
          // 检查是否为百分数字符串
          if (typeof value === 'string' && value.endsWith('%')) {
            // 转换百分数字符串为数字
            value = parseFloat(value.slice(0, -1)) / 100;
          }
          // 检查是否为百分数字符串
          if (typeof value === 'string' && value.endsWith('B')) {
            // 转换百分数字符串为数字
            value = parseFloat(value.slice(0, -2)) / 100;
          }

          // 确保转换后的值为数值类型
          if (typeof value === 'number' && !isNaN(value)) {
            sum += value;
            count++;
          }
        });

        const average = count > 0 ? sum / count : null;
        setResult({ average });
      } catch (error) {
        console.error('Failed to calculate average:', error);
      }
    };

    calculateAverage();
  }, [columnName, originData]);

  return result;
};

export default useCalculateAverage;
