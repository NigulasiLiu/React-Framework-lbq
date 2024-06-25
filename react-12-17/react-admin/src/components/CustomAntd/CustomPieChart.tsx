import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import { StatusItem } from '../Columns';
import TooltipForPieChart from './TooltipForPieChart';

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
    const getRadius = (index: number) => {
        // 计算每个扇区的基础外径
        return outerRadius - index * deltaRadius;
    };
    const handleMouseEnter = (_: MouseEvent, index: number) => {
        // 使用 set 方法来更新状态
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        // 重置索引为 -1
        setActiveIndex(-1);
    };
    // 检查所有 value 字段是否为 0
    const allValuesAreZero = data.every(item => item.value === 0);

    // 如果所有 value 字段都为 0，则创建一个虚拟条目
    const displayData = allValuesAreZero
        ? [{ label: 'Empty', value: 1, color: data[0]?.color || '#000000' }]
        : data;
    return (
        <div
            style={{ width: cardWidth, height: cardHeight }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip content={<TooltipForPieChart
                        active={true}
                        //payload={data}
                        //borderColor="#ff0000"
                    />}
                    />
                    <Pie
                        data={displayData}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={activeIndex === 0 ? outerRadius : outerRadius - deltaRadius}
                        fill="#8884d8"
                        paddingAngle={data.length === 1 ? 1 : 1} // 当只有一个数据点时，没有间隙
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
                                value={`${title}:${Math.round(
                                    (1 - data[0].value / data.reduce((acc, cur) => acc + cur.value, 0)) * 100,
                                )}%`}
                                position="center"
                                style={{ fontSize: '14px' }}
                            />
                        )}

                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomPieChart;
