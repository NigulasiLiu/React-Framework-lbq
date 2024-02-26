import React from 'react';

interface CustomTooltipProps {
  payload?: any[];
  active?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // 获取饼图对应的数据对象
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // 背景颜色透明度为50%
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center', // 文本居中对齐
      }}>
        <p style={{ fontSize: '14px', color: '#333333', marginBottom: '5px' }}>{data.label}: {data.value}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
