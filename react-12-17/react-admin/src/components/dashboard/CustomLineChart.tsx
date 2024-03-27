import React from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';

interface ChartProps {
  width: string;
  height: number;
  alertData: {
    day: string;
    value: string;
  }[];
  fontSize: number;
  isXAxisExist: boolean;
  isYAxisExist: boolean;
  strokeDasharray: string;
  orientation: 'horizontal' | 'vertical';
  stroke: string;
  strokeWidth: number;
}

const CustomLineChart: React.FC<ChartProps> = ({
  width,
  height,
  alertData,
  fontSize,
  isXAxisExist,
  isYAxisExist,
  strokeDasharray,
  orientation,
  stroke,
  strokeWidth,
}) => {
  return (
    <div style={{ width: width, height: height, borderRight: '3px solid #E5E6EB' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={alertData}>
          {isXAxisExist && <XAxis dataKey="day" tick={{ fontSize: fontSize }} />}
          {isYAxisExist && <YAxis tick={{ fontSize: fontSize }} />}
          <CartesianGrid strokeDasharray={strokeDasharray} {...(orientation === 'horizontal' ? { horizontal: true } : { vertical: true })} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={strokeWidth} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
