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
            console.log('update chart')
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
                        // fontFamily: 'Microsoft YaHei', // 图例文字字体
                        fontSize: 20, // 图例文字大小
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
                            fontSize: 18, // 设置字体大小
                            offset: [0, 0],
                            align: 'center',
                            color: '#000000', // 设置字体颜色
                            // fontFamily: 'Microsoft YaHei', // 设置字体为微软雅黑
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
                                    fontSize: 16, // 设置字体大小
                                    color: '#1B8A87', // 设置字体颜色
                                    // fontFamily: 'Microsoft YaHei', // 设置字体为微软雅黑
                                    fontWeight: 'bold', // 设置加粗
                                },
                                b: {
                                    // 第二行的样式
                                    fontSize: 15, // 设置字体大小
                                    color: '#7F7F7F', // 设置字体颜色
                                    // fontFamily: 'Microsoft YaHei', // 设置字体为微软雅黑
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
            console.log('update chart successfully');
        }


        initializeChart();
        let graph_data : any = {"nodes":[], "links":[], "categories":[]}
        const evtSource = new EventSource(Provenance_New_Graph_Data_Event_API);
        console.log("建立链接")
        // evtSource.onmessage = function (event) {
        //     console.log("接收到数据")
        //     // 解析整个 event.data 字符串为对象
        //     console.log(event.data)
        //     const parsed_data_temp = JSON.parse(event.data);
        //     const parsed_graph_data = {
        //         "nodes": parsed_data_temp.nodes,
        //         "links": parsed_data_temp.links,
        //         "categories": parsed_data_temp.categories
        //     };
        //     console.log("解析后的图数据")
        //     console.log(parsed_graph_data)
        //     updateChart(parsed_graph_data);
        // };

        //固定测试数据
        const parsed_data_temp = JSON.parse(`{"nodes": [{"id": 11, "gid": -1, "ino": -1, "pid": 2477, "uid": -1, "mode": "NaN", "name": "task: 2477", "tgid": -1, "uuid": "NaN", "vpid": 2477, "taint": 0, "value": "NaN", "id_str": "AQAAAAAAAEBZrwEAAAAAAAUAAAC/MbUKAQAAAAAAAAA=", "secctx": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023", "cf_date": "2024:09:10T00:08:51", "category": "Activity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "task"}, {"id": 13, "gid": 1000, "ino": 478, "pid": -1, "uid": 1000, "mode": "0x81b4", "name": "file", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AAEAAAAAACD9EgIAAAAAAAEAAAC/MbUKAgAAAAAAAAA=", "secctx": "unconfined_u:object_r:user_home_t:s0", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "file"}, {"id": 1, "gid": -1, "ino": -1, "pid": -1, "uid": -1, "mode": "NaN", "name": "path: /home/zwb/.ssh/authorized_keys", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AABAAAAAACRT1jv5zbzXGwUAAAC/MbUKAAAAAAAAAAA=", "secctx": "NaN", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "/home/zwb/.ssh/authorized_keys", "machine_id": "cf:179646911", "object_type": "path"}, {"id": 10, "gid": 0, "ino": -1, "pid": -1, "uid": 0, "mode": "0x0", "name": "iattr", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AAAEAAAAACBerwEAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "secctx": "NaN", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "iattr"}, {"id": 9, "gid": 1000, "ino": 478, "pid": -1, "uid": 1000, "mode": "0x81b4", "name": "file", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AAEAAAAAACD9EgIAAAAAAAEAAAC/MbUKAQAAAAAAAAA=", "secctx": "unconfined_u:object_r:user_home_t:s0", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "file"}, {"id": 8, "gid": 1000, "ino": -1, "pid": -1, "uid": 1000, "mode": "NaN", "name": "process_memory", "tgid": 2477, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AAAIAAAAACBarwEAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "secctx": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "process_memory"}, {"id": 12, "gid": -1, "ino": -1, "pid": 2477, "uid": -1, "mode": "NaN", "name": "task: 2477", "tgid": -1, "uuid": "NaN", "vpid": 2477, "taint": 0, "value": "NaN", "id_str": "AQAAAAAAAEBZrwEAAAAAAAUAAAC/MbUKAgAAAAAAAAA=", "secctx": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023", "cf_date": "2024:09:10T00:08:51", "category": "Activity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "task"}, {"id": 5, "gid": 1000, "ino": -1, "pid": -1, "uid": 1000, "mode": "NaN", "name": "process_memory", "tgid": 2477, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AAAIAAAAACBarwEAAAAAAAUAAAC/MbUKAQAAAAAAAAA=", "secctx": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "process_memory"}, {"id": 7, "gid": -1, "ino": -1, "pid": 2477, "uid": -1, "mode": "NaN", "name": "task: 2477", "tgid": -1, "uuid": "NaN", "vpid": 2477, "taint": 0, "value": "NaN", "id_str": "AQAAAAAAAEBZrwEAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "secctx": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023", "cf_date": "2024:09:10T00:08:51", "category": "Activity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "task"}, {"id": 6, "gid": 1000, "ino": 478, "pid": -1, "uid": 1000, "mode": "0x81b4", "name": "file", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AAEAAAAAACD9EgIAAAAAAAEAAAC/MbUKAAAAAAAAAAA=", "secctx": "unconfined_u:object_r:user_home_t:s0", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "file"}, {"id": 0, "gid": -1, "ino": -1, "pid": -1, "uid": -1, "mode": "NaN", "name": "machine", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "EAAAAAAAABQFFQAAAAAAAAUAAAC/MbUKAQAAAAAAAAA=", "secctx": "NaN", "cf_date": "2024:09:10T00:08:07", "category": "Entity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "machine"}, {"id": 3, "gid": -1, "ino": -1, "pid": -1, "uid": -1, "mode": "NaN", "name": "path: /home/zwb/Documents/ChangeSSHKey/change_ssh_key", "tgid": -1, "uuid": "NaN", "vpid": -1, "taint": 0, "value": "NaN", "id_str": "AABAAAAAACS2kFqsgIo3pQUAAAC/MbUKAAAAAAAAAAA=", "secctx": "NaN", "cf_date": "2024:09:10T00:08:51", "category": "Entity", "pathname": "/home/zwb/Documents/ChangeSSHKey/change_ssh_key", "machine_id": "cf:179646911", "object_type": "path"}, {"id": 4, "gid": -1, "ino": -1, "pid": 2477, "uid": -1, "mode": "NaN", "name": "task: 2477", "tgid": -1, "uuid": "NaN", "vpid": 2477, "taint": 0, "value": "NaN", "id_str": "AQAAAAAAAEBZrwEAAAAAAAUAAAC/MbUKAwAAAAAAAAA=", "secctx": "unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023", "cf_date": "2024:09:10T00:08:51", "category": "Activity", "pathname": "NaN", "machine_id": "cf:179646911", "object_type": "task"}], "links": [{"id": "BAAAAAAAEIAPAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasInformedBy", "source": "4", "target": "12", "machine_id": "cf:179646911", "id_increment": "0", "relation_type": "terminate_task"}, {"id": "ACAAAAAAgIAQAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasDerivedFrom", "source": "5", "target": "8", "machine_id": "cf:179646911", "id_increment": "1", "relation_type": "terminate_proc"}, {"id": "AQAAAAAAgIABAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasDerivedFrom", "source": "6", "target": "1", "machine_id": "cf:179646911", "id_increment": "2", "relation_type": "named"}, {"id": "gAAAAAAAIIACAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "Used", "source": "7", "target": "6", "machine_id": "cf:179646911", "id_increment": "3", "relation_type": "open"}, {"id": "AQAAAAAABIADAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasAssociatedWith", "source": "7", "target": "0", "machine_id": "cf:179646911", "id_increment": "4", "relation_type": "ran_on"}, {"id": "gAAAAAAAQIAEAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasGeneratedBy", "source": "8", "target": "7", "machine_id": "cf:179646911", "id_increment": "5", "relation_type": "memory_write"}, {"id": "AQAAAAAAgIAFAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasDerivedFrom", "source": "8", "target": "3", "machine_id": "cf:179646911", "id_increment": "6", "relation_type": "named"}, {"id": "AgAAAAAAgIAGAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasDerivedFrom", "source": "9", "target": "6", "machine_id": "cf:179646911", "id_increment": "7", "relation_type": "version_entity"}, {"id": "gAAAAAAAgIAHAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasDerivedFrom", "source": "9", "target": "10", "machine_id": "cf:179646911", "id_increment": "8", "relation_type": "setattr_inode"}, {"id": "AgAAAAAAEIAIAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasInformedBy", "source": "11", "target": "7", "machine_id": "cf:179646911", "id_increment": "9", "relation_type": "version_activity"}, {"id": "AAgAAAAAIIAJAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "Used", "source": "11", "target": "9", "machine_id": "cf:179646911", "id_increment": "10", "relation_type": "getattr"}, {"id": "gAAAAAAAQIAKAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasGeneratedBy", "source": "8", "target": "11", "machine_id": "cf:179646911", "id_increment": "11", "relation_type": "memory_write"}, {"id": "AgAAAAAAEIALAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasInformedBy", "source": "12", "target": "11", "machine_id": "cf:179646911", "id_increment": "12", "relation_type": "version_activity"}, {"id": "BAAAAAAAIIAMAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "Used", "source": "12", "target": "8", "machine_id": "cf:179646911", "id_increment": "13", "relation_type": "memory_read"}, {"id": "AgAAAAAAgIANAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasDerivedFrom", "source": "13", "target": "9", "machine_id": "cf:179646911", "id_increment": "14", "relation_type": "version_entity"}, {"id": "IAAAAAAAQIAOAAAAAAAAAAUAAAC/MbUKAAAAAAAAAAA=", "date": "2024:09:10T00:08:51", "type": "WasGeneratedBy", "source": "13", "target": "12", "machine_id": "cf:179646911", "id_increment": "15", "relation_type": "write"}], "categories": [{"name": "Activity", "itemStyle": {"color": "#22BC44"}}, {"name": "Entity", "itemStyle": {"color": "#EA635F"}}, {"name": "Agent", "itemStyle": {"color": "#FBB12E"}}]}`)
        const parsed_graph_data = {
            "nodes": parsed_data_temp.nodes,
            "links": parsed_data_temp.links,
            "categories": parsed_data_temp.categories
        };
        console.log("解析后的图数据")
        console.log(parsed_graph_data)
        updateChart(parsed_graph_data);
 
        return () => {
            evtSource.close();
            if (myChart !== null) {
                myChart.dispose();
            }
        };

    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '100%'}}></div>;
    // return <div ref={chartRef} ></div>;
};

export default ProvenanceGraph;