import { useState, useEffect } from 'react';

export interface FilteredDataResult_new {
    id: number;
    ip: string;
    port: string;
    scanTime: string;
    scanType: string;
    vul_detection_exp_result_bug_exp: string | undefined;
    vul_detection_exp_result_id: number | undefined;
    vul_detection_exp_result_ip: string | undefined;
    vul_detection_exp_result_scanTime: string | undefined;
    vul_detection_finger_result_finger: string | undefined;
    vul_detection_finger_result_id: number | undefined;
    vul_detection_finger_result_ip: string | undefined;
    vul_detection_finger_result_scanTime: string | undefined;
    vul_detection_finger_result_url: string | undefined;
    vul_detection_poc_result_bug_poc: string | undefined;
    vul_detection_poc_result_id: number | undefined;
    vul_detection_poc_result_ip: string | undefined;
    vul_detection_poc_result_scanTime: string | undefined;
    vul_detection_poc_result_url: string | undefined;
  }

const useFilterOriginData_new = (
  columnName: string,
  originData: any[],
  transformFunction?: (item: any) => FilteredDataResult_new
): Map<string, FilteredDataResult_new[]> => {
  const [filteredData, setFilteredData] = useState<Map<string, FilteredDataResult_new[]>>(new Map());

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      let result = new Map<string, FilteredDataResult_new[]>();
      originData.forEach(item => {
        const keyValue = item[columnName];
        if (!result.has(keyValue)) {
          result.set(keyValue, []);
        }
        let existingItems = result.get(keyValue)!;
        const transformedItem = transformFunction ? transformFunction(item) : item;
        existingItems.push(transformedItem);
      });
      setFilteredData(result);
    };

    fetchDataAndProcess();
  }, [columnName, originData, transformFunction]);

  return filteredData;
};

export default useFilterOriginData_new;
