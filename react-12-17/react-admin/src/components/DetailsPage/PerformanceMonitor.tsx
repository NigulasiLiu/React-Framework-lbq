import React from 'react';
import axios from 'axios';
import { Row, Col, Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, } from 'recharts';
import FetchDataForTaskTable from '../OWLTable/FetchDataForTaskTable';
import { hostperformanceColumns, StatusItem } from '../Columns';

//const { Search } = Input;

type PerformanceMonitorProps = {
    specifyWidth?: number;
};
type PerformanceMonitorState = {
    statusData: StatusItem[];
    riskData: StatusItem[];
    fullDataSource: any[], // 存储完整的数据源副本
    count: number;
    deleteIndex: number | null;

    activeIndex: any;
};

class PerformanceMonitor extends React.Component<PerformanceMonitorProps, PerformanceMonitorState> {

    alertData = [
        { time: '12:01', percent: 30 },
        { time: '12:02', percent: 10 },
        { time: '12:03', percent: 50 },
        { time: '12:04', percent: 20 },
        { time: '12:05', percent: 40 },
        // ...更多数据点
    ];
    // 新增 20 個額外的數據點
    additionalData = Array.from({ length: 20 }, (_, index) => ({
        time: `12:${index + 6}`,  // 假設新增的時間點從 '12:06' 開始
        percent: Math.floor(Math.random() * 100)  // 隨機生成 0 到 100 之間的百分比
    }));

    smoothCurveData = Array.from({ length: 40 }, (_, index) => ({
        time: `12:${index + 6}`,  // 假设新增的时间点从 '12:06' 开始
        percent: Math.floor(Math.random() * 10) + 45,  // 随机生成 45 到 55 之间的百分比，以保持平滑
    }));

    render() {
        // 將額外的數據點添加到 alertData 中
        this.alertData = [...this.alertData, ...this.additionalData];
        // 将顺序排序，以确保曲线平滑
        this.smoothCurveData.sort((a, b) => a.time.localeCompare(b.time));
        // 将新生成的数据点添加到 alertData 中
        this.alertData = [...this.alertData, ...this.smoothCurveData];


        return (
            <div style={{
                // fontFamily: "'YouYuan', sans-serif",
                // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                fontWeight: 'bold' }}>

                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '10px' }}>
                    <Col span={12} style={{ width: 660 }}>
                        <Card bordered={false} /*title="主机状态分布" 产生分界线*/ style={{ fontWeight: 'bolder', width: '100%', height: 300 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>平均使用率 趨勢</h2>
                            </div>
                            <Row gutter={0}>
                              <ResponsiveContainer width="98%" height={220}>
                                <AreaChart data={this.alertData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="time" />
                                  <YAxis dataKey="percent" />
                                  {/* <YAxis /> */}
                                  <Tooltip />
                                  <Area
                                    fillOpacity={0.5}
                                    stroke="#4086FF" // 设置线条颜色为#4086FF
                                    strokeWidth={2} // 设置线条厚度为3px
                                    fill="#F1F8FE" // 设置填充颜色为#4086FF
                                    type="monotone"
                                    dataKey="percent"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                                {/* <ResponsiveContainer width="98%" height={220}>
                                    <LineChart data={this.alertData}>
                                        <XAxis dataKey="time" />
                                        <YAxis dataKey="percent" />
                                        <CartesianGrid strokeDasharray="3 5" horizontal />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="percent"
                                            stroke="#8884d8"
                                            strokeWidth={1}
                                            dot={{ r: 1 }} // 设置数据点的大小
                                        />
                                    </LineChart>
                                </ResponsiveContainer> */}
                            </Row>
                        </Card>
                    </Col>
                    <Col span={12} style={{ width: 660 }}>
                        <Card bordered={false} style={{ fontWeight: 'bolder', width: '100%', height: 300 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>負載最高的主機 使用率趨勢</h2>
                            </div>
                            <Row gutter={0}>
                              <ResponsiveContainer width="98%" height={220}>
                                <AreaChart data={this.alertData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="time" />
                                  <YAxis dataKey="percent" />
                                  {/* <YAxis /> */}
                                  <Tooltip />
                                  <Area
                                    fillOpacity={0.5}
                                    stroke="#4086FF" // 设置线条颜色为#4086FF
                                    strokeWidth={2} // 设置线条厚度为3px
                                    fill="#F1F8FE" // 设置填充颜色为#4086FF
                                    type="monotone"
                                    dataKey="percent"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                                {/* <ResponsiveContainer width="98%" height={220}>
                                    <LineChart data={this.alertData}>
                                        <XAxis dataKey="time" />
                                        <YAxis dataKey="percent" />
                                        <CartesianGrid strokeDasharray="3 5" horizontal />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="percent"
                                            stroke="#8884d8"
                                            strokeWidth={1}
                                            dot={{ r: 1 }} // 设置数据点的大小
                                        />
                                    </LineChart>
                                </ResponsiveContainer> */}
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '0px' }}>
                    <Col md={24} style={{ width: 1320 }}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
                                    <h2 style={{ fontWeight: 'bold', marginLeft: '0px' }}>主機監控記錄</h2>
                                </div>
                                <FetchDataForTaskTable
                                    apiEndpoint=""
                                    timeColumnIndex={[]}
                                    columns={hostperformanceColumns}
                                    currentPanel="hostperformancelist"
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PerformanceMonitor;
