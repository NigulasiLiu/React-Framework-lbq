

import { DataItem, GenericDataItem, } from '../Columns';

export const templateData: DataItem[] = [
    { key: '1', id: '', value: 0, color: '#F24040' },
    { key: '2', id: '', value: 0, color: '#F77237' },
    { key: '3', id: '', value: 0, color: '#E5BA4A' },
    { key: '4', id: '', value: 0, color: '#F2F3F5' },
    { key: '5', id: '', value: 0, color: '#F2F3F5' },
  ];
  // 定义通用函数以转换并填充数据至5条
export function convertAndFillData(rawDataArray: [string, number][], templateData: DataItem[]): DataItem[] {
  const filledData: DataItem[] = rawDataArray.map(([valueName, value], index) => ({
    ...templateData[index], // 使用模板数据的其余属性
    id: valueName, // 设置 valueName 为 id
    value: value, // 设置 value
  }));

  // 如果原始数据少于5条，使用模板数据进行填充
  while (filledData.length < 5) {
    const index = filledData.length;
    filledData.push({ ...templateData[index], id: `N/A_${index + 1}` }); // 确保填充项的id是唯一的
  }

  return filledData;
}
