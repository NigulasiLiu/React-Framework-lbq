import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import { StatusItem } from './tableUtils';
import CustomTooltip from './CustomTooltip';

interface CustomPieChartProps {
  title?: string;
  data: StatusItem[];
  innerRadius: number;
  deltaRadius: number;
  outerRadius: number;
  cardWidth?: number | string;
  cardHeight: number | string;
  hasDynamicEffect: boolean;
  //children?: React.ReactNode; // 添加 children 的類型定義
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  title,
  data,
  innerRadius,
  deltaRadius,
  outerRadius,
  cardWidth,
  cardHeight,
  hasDynamicEffect,
  //children, // 將 children 放在正確的位置
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleMouseEnter = (_: MouseEvent, index: number) => {
    // 使用 set 方法来更新状态
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    // 重置索引为 -1
    setActiveIndex(-1);
  };
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    // 使用可选链操作符确保安全地访问属性
    const { left, top, width, height } = e.currentTarget?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
  
    // 计算鼠标距离中心点的距离
    const distanceToCenter = Math.sqrt(Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height / 2, 2));
  
    // 根据鼠标距离设定 activeIndex
    setActiveIndex(distanceToCenter <= outerRadius && distanceToCenter >= innerRadius ? 0 : -1);
  };
  

  return (
    <div
      style={{ width: cardWidth, height: cardHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} /> {/* 添加tooltip组件 */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={activeIndex === 0 ? outerRadius : outerRadius - deltaRadius}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            // 修改这里，将事件绑定到 Pie 元素上
            onMouseEnter={(e: MouseEvent) => hasDynamicEffect && handleMouseEnter(e, 0)}
            onMouseLeave={hasDynamicEffect ? handleMouseLeave : undefined}
            className={hasDynamicEffect && activeIndex === 0 ? 'pie-hovered' : 'pie-normal'}
         >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            {title && (
              <Label
                value={`${title}: ${Math.round((data[1].value / (data[0].value + data[1].value)) * 100)}%`}
                position="center"
                style={{ fontSize: '14px' }}
              />
            )}
          </Pie>
        </PieChart>
          {/* <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            {children?children:'asd'}
          </div> */}
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
