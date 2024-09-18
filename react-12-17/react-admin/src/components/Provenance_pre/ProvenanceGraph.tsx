import React, { useEffect, useRef } from 'react';
import { Provenance_New_Graph_Data_Event_API } from '../../service/config';
import * as echarts from 'echarts';


const ProvenanceGraph = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let myChart: any = null;

        // 自动计算曲率的函数
        function calculateCurveness(links: any) {
            let linkMap = new Map();

            links.forEach((link: { source: string | number; target: string | number; }) => {
                // 为每一对节点创建一个唯一的键（不考虑边的方向）
                let key = link.source < link.target ? link.source + ':' + link.target : link.target + ':' + link.source;
                if (!linkMap.has(key)) {
                    linkMap.set(key, []);
                }
                linkMap.get(key).push(link);
            });

            linkMap.forEach((linkList, key) => {
                const totalLinks = linkList.length;
                // 为每条边分配一个正曲率，避免0和相反数
                const step = 0.3; // 可以调整步长以适合您的图表
                linkList.forEach((link: any, index: any) => {
                    const curveness = step * (index + 1) - 0.2;
                    link.lineStyle = { curveness: curveness };
                });
            });
        }

        function formatInfo(name:string, info:any) {
            if (info !== "") {
                if (info !== -1) {
                    return name + info + '<br>';
                }
            }
            return "";
        }

        const initializeChart = () => {
            if (chartRef.current) {
                const chartDom = chartRef.current;
                chartDom.style.backgroundColor = '#ffffff';
                myChart = echarts.init(chartDom);
                myChart.showLoading();
            }
        }

        const updateChart = (graph_data : any) => {
            if (myChart === null) {
                initializeChart();
            }
            myChart.hideLoading();
            type Weight = "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | undefined;
            let font_weight: Weight;
            font_weight = 'bold';
            type Trigger = "item" | "axis" | "none" | undefined;
            let trigger: Trigger;
            trigger = "item";

            var filteredLinks = graph_data.links.filter(function (link: any) {
                return link.relation_type !== 'terminate_proc' && link.relation_type !== 'terminate_task';
            });
    
            // 计算边的曲率
            calculateCurveness(filteredLinks);

            const option = {
                tooltip: {
                    trigger: trigger, // 触发类型，可以是 'item' 或 'axis'
                    formatter: function (params: any) {
                        if (params.dataType === 'node') { // 判断数据类型是节点
                            let tip1 = formatInfo('节点序号: ', params.data.id)
                            let tip2 = formatInfo('节点标识: ', params.data.id_str)
                            let tip3 = formatInfo('节点类型: ', params.data.category)
                            let tip4 = formatInfo('设备编号: ', params.data.machine_id)
                            let tip5 = formatInfo('生成时间: ', params.data.cf_date)
                            let tip6 = formatInfo('细分类型: ', params.data.object_type)
                            let tip7 = formatInfo('用户id: ', params.data.uid)
                            let tip8 = formatInfo('用户组id: ', params.data.gid)
                            let tip9 = formatInfo('进程号: ', params.data.pid)
                            let tip10 = formatInfo('虚拟进程号: ', params.data.vpid)
                            let tip11 = formatInfo('操作模式: ', params.data.mode)
                            let tip12 = formatInfo('通用唯一标识符: ', params.data.uuid)
                            let tip13 = formatInfo('对应路径: ', params.data.pathname)
                            let tip14 = formatInfo('线程组id: ', params.data.tgid)
                            let tip15 = formatInfo('污点标记: ', params.data.taint)
                            let tip16 = formatInfo('索引节点: ', params.data.ino)
                            let tip17 = formatInfo('安全上下文: ', params.data.secctx)
    
                            let tips = tip1 + tip2 + tip3 + tip4 + tip5 + tip6 + tip7 +
                                tip8 + tip9 + tip10 + tip11 + tip12 + tip13 + tip14 +
                                tip15 + tip16 + tip17;
                            return tips;
    
                        } else if (params.dataType === 'edge') { // 判断数据类型是边
                            let tip1 = formatInfo('边序号: ', params.data.id_increment)
                            let tip2 = formatInfo('边标识: ', params.data.id)
                            let tip3 = formatInfo('边类型: ', params.data.type)
                            let tip4 = formatInfo('设备编号: ', params.data.machine_id)
                            let tip5 = formatInfo('生成时间: ', params.data.date)
                            let tip6 = formatInfo('细分类型: ', params.data.relation_type)
    
                            let tips = tip1 + tip2 + tip3 + tip4 + tip5 + tip6;
                            return tips;
                        }
                        return ''; // 默认情况下返回空字符串
                    }
                },
    
                legend: {
                    data: graph_data.categories.map(function (a: any) {
                        return a.name;
                    }),
                    itemStyle: {
                        borderColor: 'black', // 边框颜色
                        borderWidth: 2,       // 边框宽度
                        borderType: 'solid'   // 边框类型
                    },
                    textStyle: {
                        color: '#000000', // 图例文字颜色
                        fontFamily: 'Microsoft YaHei', // 图例文字字体
                        fontSize: 22, // 图例文字大小
                        fontWeight: font_weight //  图例文字粗细
                    },
                    itemHeight: 30, // 设置图例项的高度
                    itemWidth: 80, // 设置图例项的宽度
                    itemGap: 40, // 设置图例项之间的间隔
                    top: '4%', // 距离图表顶部的位置
                },
    
                animation: true, // 禁用动画效果
    
                series: [
                    {
                        name: 'Les Miserables',
                        type: 'graph',
                        layout: 'force',
                        
                        force: {
                            repulsion: 8000, // 调整节点之间的距离
                            edgeLength: 40
                        },
    
                        data: graph_data.nodes,
                        links: filteredLinks,
                        categories: graph_data.categories,
                        roam: true,
                        
                        label: {
                            show: true,
                            fontSize: 20, // 设置字体大小
                            offset: [0, 0],
                            align: 'center',
                            color: '#000000', // 设置字体颜色
                            fontFamily: 'Microsoft YaHei', // 设置字体为微软雅黑
                            fontWeight: 'bold', // 设置加粗
                            draggable: true // 启用标签拖拽
                        },
                    
                        itemStyle: {
                            borderColor: 'black', // 边框颜色
                            borderWidth: 1,       // 边框宽度
                            borderType: 'solid'   // 边框类型
                        },
    
                        lineStyle: {
                            color: 'source',
                            curveness: 0.3,
                            width: 3, // 设置边的粗细
                            opacity: 1 // 设置边的透明度
                        },
    
                        labelLayout: {
                            hideOverlap: false // 是否隐藏重叠标签
                        },
    
                        symbolSize: 40,
    
                        edgeSymbol: ['circle', 'arrow'], // 设置边两端的标记类型，可以根据需要修改
                        edgeSymbolRotate: 0,
                        edgeSymbolSize: [2, 7], // 设置边两端标记的大小
    
                        edgeLabel: {
                            show: true,
                            formatter: function (params: any) {
                                // 使用富文本标签设置不同样式
                                return '{a|' + params.data.type + '}\n{b|' + params.data.relation_type + '}';
                            },
                            rich: {
                                a: {
                                    // 第一行的样式
                                    fontSize: 18, // 设置字体大小
                                    color: '#1B8A87', // 设置字体颜色
                                    fontFamily: 'Microsoft YaHei', // 设置字体为微软雅黑
                                    fontWeight: 'bold', // 设置加粗
                                },
                                b: {
                                    // 第二行的样式
                                    fontSize: 17, // 设置字体大小
                                    color: '#7F7F7F', // 设置字体颜色
                                    fontFamily: 'Microsoft YaHei', // 设置字体为微软雅黑
                                    fontWeight: 'bold', // 设置加粗
                                }
                            },
                            position: 'middle',
                            draggable: true // 启用边的标签拖拽
                        },
                    }
                ]
            };
    
            myChart.setOption(option);
        }


        initializeChart();
        let graph_data : any = {"nodes":[], "links":[], "categories":[]}
        const evtSource = new EventSource(Provenance_New_Graph_Data_Event_API);
        console.log("建立链接")
        evtSource.onmessage = function (event) {
            console.log("接收到数据")
            // 解析整个 event.data 字符串为对象
            console.log(event.data)
            const parsed_data_temp = JSON.parse(event.data);
            
            // 进一步解析 nodes 和 links 字段
            // const parsed_graph_data = {
            //     nodes: JSON.parse(parsed_data_temp.nodes),
            //     links: JSON.parse(parsed_data_temp.links),
            //     categories: parsed_data_temp.categories
            // };
            const parsed_graph_data = {
                "nodes": parsed_data_temp.nodes,
                "links": parsed_data_temp.links,
                "categories": parsed_data_temp.categories
            };
            console.log("解析后的图数据")
            console.log(parsed_graph_data)
            updateChart(parsed_graph_data);
            // myChart.hideLoading();
        };
    
 
        return () => {
            evtSource.close();
            if (myChart !== null) {
                myChart.dispose();
            }
        };

    }, []);

    // return <div ref={chartRef} style={{ width: 830, height: 860}}></div>;
    return <div ref={chartRef} ></div>;
};

export default ProvenanceGraph;