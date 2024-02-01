import React from 'react';
import ReactEcharts from 'echarts-for-react';

// 定义 StatusItem 类型
interface StatusItem {
  color: string;
  label: string;
  value: number;
}

interface CustomEchartsPieProps {
  titleText?: string;
  tooltipFormatter?: string;
  visualMapShow?: boolean;
  visualMapMin?: number;
  visualMapMax?: number;
  seriesData?: StatusItem[]; // 修改此处的类型定义
  seriesRadius?: string;
  seriesRoseType?: string;
  seriesLabelColor?: string;
  seriesLineColor?: string;
  seriesItemColor?: string;
  seriesAnimationType?: string;
  seriesAnimationEasing?: string;
  seriesAnimationDelay?: ((idx: number) => number) | number;
  style?: React.CSSProperties;
}

const CustomEchartsPie: React.FC<CustomEchartsPieProps> = ({
  titleText,
  tooltipFormatter,
  visualMapShow,
  visualMapMin,
  visualMapMax,
  seriesData,
  seriesRadius,
  seriesRoseType,
  seriesLabelColor,
  seriesLineColor,
  seriesItemColor,
  seriesAnimationType,
  seriesAnimationEasing,
  seriesAnimationDelay,
  style,
}) => {
  const option = {
    title: {
      text: titleText || 'Customized Pie',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#777',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: tooltipFormatter || '{a} <br/>{b} : {c} ({d}%)',
    },
    visualMap: {
      show: visualMapShow !== undefined ? visualMapShow : false,
      min: visualMapMin || 80,
      max: visualMapMax || 600,
      inRange: {
        colorLightness: [0, 1],
      },
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: seriesRadius || '55%',
        center: ['50%', '50%'],
        data: seriesData || [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 274, name: '联盟广告' },
          { value: 235, name: '视频广告' },
          { value: 400, name: '搜索引擎' },
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: seriesRoseType || 'angle',
        label: {
          normal: {
            textStyle: {
              color: seriesLabelColor || '#777',
            },
          },
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: seriesLineColor || '#777',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
        },
        itemStyle: {
          normal: {
            color: seriesItemColor || '#c23531',
            shadowBlur: 200,
            shadowColor: '#777',
          },
        },
        animationType: seriesAnimationType || 'scale',
        animationEasing: seriesAnimationEasing || 'elasticOut',
        animationDelay:
          typeof seriesAnimationDelay === 'function'
            ? seriesAnimationDelay
            : seriesAnimationDelay || function (idx: number) {
                return Math.random() * 200;
              },
      },
    ],
  };

  return (
    <ReactEcharts
      option={option}
      style={style || { height: '300px', width: '100%' }}
      className={'react_for_echarts'}
    />
  );
};

export default CustomEchartsPie;
