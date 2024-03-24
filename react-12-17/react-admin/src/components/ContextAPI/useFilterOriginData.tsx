import { useState, useEffect } from 'react';



export interface VulnDataItem {
  id: number;
  ip: string;
  port: string;
  scanTime: string;
  scanType: string;
  vul_detection_exp_result: ExpResult[];
  vul_detection_finger_result: FingerResult[];
  vul_detection_poc_result: PocResult[];
}

export interface ExpResult {
  bug_exp: string;
  id: number;
  ip: string;
  scanTime: string;
}

export interface FingerResult {
  finger: string;
  id: number;
  ip: string;
  scanTime: string;
  url: string;
}

export interface PocResult {
  bug_poc: string;
  id: number;
  ip: string;
  scanTime: string;
  url: string;
}

export interface ReconstructedDataItem {
  [key: string]: any;
}

// 定义返回的数据结构类型
export interface MetaDataResult {
  tupleCount: number;
  typeCount: Map<string, number>;
  details: Map<string, Map<string, number>>;
};

 export interface FilteredDataResult {
    id: number;
    ip: string;
    port: string;
    scanTime: string;
    scanType: string;
    vul_detection_exp_result: {
      bug_exp: string;
      id: number;
      ip: string;
      scanTime: string;
    };
    vul_detection_finger_result: {
      finger: string;
      id: number;
      ip: string;
      scanTime: string;
      url: string;
    };
    vul_detection_poc_result: {
      bug_poc: string;
      id: number;
      ip: string;
      scanTime: string;
      url: string;
    };
  }

  const useFilterOriginData = (columnName: string, originData: any): Map<string, FilteredDataResult[]> => {
    const [filteredData, setFilteredData] = useState<Map<string, FilteredDataResult[]>>(new Map());
  
    useEffect(() => {
      const fetchDataAndCount = async () => {
        try{
          let result = new Map<string, FilteredDataResult[]>();
          const data = originData;
      
          data.forEach((item:any) => {
            const keyValue = item[columnName];
            if (!result.has(keyValue)) {
              result.set(keyValue, []);
            }
            let existingItems = result.get(keyValue);
            console.log('existingItems data:', existingItems);
            existingItems?.push(item);
          });
          setFilteredData(result);
        } catch (error) {
          console.error('Failed to fetch and count data:', error);
        }
    }
    fetchDataAndCount();
    }, [columnName, originData]);
  
    return filteredData;
  };
  

export default useFilterOriginData;
