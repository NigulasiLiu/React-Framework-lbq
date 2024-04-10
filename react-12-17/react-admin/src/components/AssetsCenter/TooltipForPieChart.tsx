// import React from 'react';

// interface TooltipForPieChartProps {
//   payload?: any[];
//   active?: boolean;
// }

// const TooltipForPieChart: React.FC<TooltipForPieChartProps> = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload; // 获取饼图对应的数据对象
//     return (
//       <div style={{
//         backgroundColor: 'rgba(255, 255, 255, 0.5)', // 背景颜色透明度为50%
//         padding: '10px',
//         borderRadius: '5px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         textAlign: 'center', // 文本居中对齐
//       }}>
//         <p style={{ fontSize: '14px', color: '#333333', marginBottom: '5px' }}>{data.label}: {data.value}</p>
//       </div>
//     );
//   }
//   return null;
// };

// export default TooltipForPieChart;
import React from 'react';
import { StatusItem } from '../tableUtils';
interface TooltipForPieChartProps {  
  payload?: { color: string; payload: StatusItem }[]; // 调整类型以匹配实际数据结构

  active?: boolean;
  label?: string;
  borderColor?: string; // 新增边框颜色作为可选参数
}

// const TooltipForPieChart: React.FC<TooltipForPieChartProps> = ({ active, payload, label, borderColor = '#ddd' }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload; // 获取饼图对应的数据对象
//     return (
//       <div style={{
//         backgroundColor: 'rgba(255, 255, 255, 0.3)', // 设置背景颜色透明度为30%
//         padding: '10px',
//         borderRadius: '5px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//         border: `1px solid ${borderColor}`, // 使用外部输入的边框颜色
//         textAlign: 'center', // 文本居中对齐
//       }}>
//         {/* <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold', marginBottom: '5px' }}>
//           {label ? `标签: ${label}` : '未命名标签'}
//         </p> */}
//         <p style={{ fontSize: '14px', color: '#666', marginBottom: '0' }}>
//           {data.label}: {data.value}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };
const TooltipForPieChart: React.FC<TooltipForPieChartProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { color, payload: data } = payload[0]; // 解构以获取颜色和数据

    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '5px',
        border: `2px solid ${color}`, // 动态设置边框颜色
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', marginBottom: '5px' }}>{data.label}: {data.value}</p>
      </div>
    );
  }
  return null;
};
export default TooltipForPieChart;
