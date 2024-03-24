import React, { useState, useEffect } from 'react';
import { FilteredDataResult_new } from '../ContextAPI/useFilterOriginData_new';
// 假设 FilteredDataResult_new 接口和 transformDataToFilteredDataResult_new 函数已经定义
// 转换函数
function transformDataToFilteredDataResult_new(vulnOriginData: any[]): FilteredDataResult_new[] {
    return vulnOriginData.map(item => ({
      id: item.id,
      ip: item.ip,
      port: item.port,
      scanTime: item.scanTime,
      scanType: item.scanType,
      vul_detection_exp_result_bug_exp: item.vul_detection_exp_result[0]?.bug_exp,
      vul_detection_exp_result_id: item.vul_detection_exp_result[0]?.id,
      vul_detection_exp_result_ip: item.vul_detection_exp_result[0]?.ip,
      vul_detection_exp_result_scanTime: item.vul_detection_exp_result[0]?.scanTime,
      vul_detection_finger_result_finger: item.vul_detection_finger_result[0]?.finger,
      vul_detection_finger_result_id: item.vul_detection_finger_result[0]?.id,
      vul_detection_finger_result_ip: item.vul_detection_finger_result[0]?.ip,
      vul_detection_finger_result_scanTime: item.vul_detection_finger_result[0]?.scanTime,
      vul_detection_finger_result_url: item.vul_detection_finger_result[0]?.url,
      vul_detection_poc_result_bug_poc: item.vul_detection_poc_result[0]?.bug_poc,
      vul_detection_poc_result_id: item.vul_detection_poc_result[0]?.id,
      vul_detection_poc_result_ip: item.vul_detection_poc_result[0]?.ip,
      vul_detection_poc_result_scanTime: item.vul_detection_poc_result[0]?.scanTime,
      vul_detection_poc_result_url: item.vul_detection_poc_result[0]?.url,
    }));
  }

// // 自定义 Hook，用于数据转换
// function useTransformedData(vulnOriginData:any) {
//   const [data, setData] = useState<FilteredDataResult_new[]>();

//   useEffect(() => {
//     // 假设这里 vulnOriginData 是从外部 API 获取的原始数据
//     const transformed = transformDataToFilteredDataResult_new(vulnOriginData);
//     setData(transformed);
//   }, [vulnOriginData]);

//   return data;
// }
// 自定义 Hook，用于数据转换
function useTransformedData(vulnOriginData: any): FilteredDataResult_new[] {
    const [data, setData] = useState<FilteredDataResult_new[]>([]); // 初始化为空数组
  
    useEffect(() => {
      // 假设这里 vulnOriginData 是从外部 API 获取的原始数据
      if (vulnOriginData && Array.isArray(vulnOriginData)) {
        const transformed = transformDataToFilteredDataResult_new(vulnOriginData);
        setData(transformed);
      }
    }, [vulnOriginData]);
  
    return data;
  }
export default useTransformedData;



