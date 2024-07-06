import { useState, useEffect } from 'react';
// 定义useExpCounts函数
// const useExpCounts = (OriginData: any[]) => {
//     const [counts, setCounts] = useState({ totalcount: 0, last7count: 0 });
//
//     useEffect(() => {
//         if (Array.isArray(OriginData)) {
//             const bugExpSet = new Set<string>();
//             const last7DaysBugExpSet = new Set<string>();
//             const currentTime = Math.floor(Date.now() / 1000);
//             const sevenDaysInSeconds = 7 * 24 * 60 * 60;
//
//             OriginData.forEach(item => {
//                 if (item.vul_detection_exp_result && Array.isArray(item.vul_detection_exp_result)) {
//                     item.vul_detection_exp_result.forEach((exp: { bug_exp: string; scanTime: any; }) => {
//                         if (exp && exp.bug_exp) {
//                             bugExpSet.add(exp.bug_exp);
//                             if (exp.scanTime && (currentTime - exp.scanTime <= sevenDaysInSeconds)) {
//                                 last7DaysBugExpSet.add(exp.bug_exp);
//                             }
//                         }
//                     });
//                 }
//             });
//
//             setCounts({ totalcount: bugExpSet.size, last7count: last7DaysBugExpSet.size });
//         }
//     }, [OriginData]);
//
//     return counts;
// };
// 定义useExpCounts函数
const useExpCounts = (OriginData: any[]) => {
    const [last7VulValue, setLast7VulValue] = useState<number[]>(new Array(7).fill(0));

    useEffect(() => {
        if (Array.isArray(OriginData)) {
            const currentTime = Math.floor(Date.now() / 1000);
            const oneDayInSeconds = 24 * 60 * 60;
            const last7Days = Array.from({ length: 7 }, (_, i) => currentTime - i * oneDayInSeconds).reverse();

            const dailyCounts = new Array(7).fill(0);

            OriginData.forEach(item => {
                if (item.vul_detection_exp_result && Array.isArray(item.vul_detection_exp_result)) {
                    item.vul_detection_exp_result.forEach((exp: { bug_exp: any; scanTime: any; }) => {
                        if (exp && exp.bug_exp && exp.scanTime) {
                            last7Days.forEach((dayStart, index) => {
                                const dayEnd = dayStart + oneDayInSeconds;
                                console.log("dayStart: ", dayStart); // 调试信息
                                console.log("dayEnd: ", dayEnd); // 调试信息
                                console.log("exp.scanTime: ", exp.scanTime); // 调试信息
                                if (exp.scanTime >= dayStart && exp.scanTime < dayEnd) {
                                    dailyCounts[index] += 1;
                                }
                            });
                        }
                    });
                }
            });
            console.log("Computed dailyCounts: ", dailyCounts); // 调试信息
            setLast7VulValue(dailyCounts);
        }
    }, [OriginData]);

    return last7VulValue;
};
export default useExpCounts;