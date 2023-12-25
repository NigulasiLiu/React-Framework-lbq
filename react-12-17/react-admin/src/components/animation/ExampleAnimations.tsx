/**
 * Created by hao.cheng on 2017/5/8.
 */
import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input,Button } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import CustomTooltip from '../dashboard/Dashboard'
import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts';
import { FilterOutlined } from '@ant-design/icons';

const { Search } = Input;

type ExampleAnimationsProps = {};
type ExampleAnimationsState = {
    dataSource: any[];
    count: number;
    deleteIndex: number | null;

    selectedRowKeys: React.Key[];
    activeIndex: any;
    areRowsSelected: boolean;
  };
interface Risk {
    key: React.Key;
    name: string;
    age: string;
    
    address: string;
    warning1: number;
    warning2: number;
    warning3: number;
    // Add other properties here if needed
  }
  interface DataType {
    key: React.Key;
    hostname: string;
    label: string;
    group: string;
    OStype: string;
    risks: {
        warning1: number;
        warning2: number;
        warning3: number;
    };
    status: string;
    clientUsage: string;
    updateTime: string;
}
// Define an interface for the individual status item
interface StatusItem {
    color: string;
    label: string;
    value: number;
  }
  
  // Define an interface for the props expected by the StatusPanel component
  interface StatusPanelProps {
    statusData: StatusItem[];
  }
  export const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
    return (
        //<div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>      
        <div style={{ fontFamily: 'YouYuan, sans-serif'}}>
        {statusData.map((status, index) => (
          <div key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ height: '10px', width: '10px', backgroundColor: status.color, borderRadius: '50%', display: 'inline-block', marginRight: '16px' }}></span>
            <span style={{ marginRight: 'auto', paddingRight: '8px' }}>{status.label}</span>
            <span>{status.value}</span>
          </div>
        ))}
      </div>//</div>

    );
  };


class ExampleAnimations extends React.Component<ExampleAnimationsProps, ExampleAnimationsState> {
    constructor(props: any) {
        super(props);
        this.columns = [
            {
                title: () => <span style={{ fontWeight: 'bold' }}>主机名称</span>,
                dataIndex: 'hostname',
                //width: '13%',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>标签</span>,
                dataIndex: 'label',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>地域</span>,
                dataIndex: 'group',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作系统</span>,
                dataIndex: 'OStype',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>风险</span>,
                dataIndex: 'risks',
                render: (risks:Risk, record:any) => {
                    return (
                        <div>
                          <div>告警 {risks.warning1}</div>
                          <div>风险 {risks.warning2}</div>
                          <div>基线 {risks.warning3}</div>
                        </div>
                    );
                  }
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>
                    状态 
                    </span>,
                dataIndex: 'status',
                filters: [
                    { text: '未安装', value: '未安装' },
                    { text: '运行中', value: '运行中' },
                    { text: '运行异常', value: '运行异常' },
                    { text: '离线', value: '离线' },
                  ],
                  onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>客户端资源使用</span>,
                dataIndex: 'clientUsage',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>更新时刻</span>,
                dataIndex: 'updateTime',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
                dataIndex: 'operation',
                render: (text: string, record: DataType) => (
                    <a 
                      href={'/login'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      //style={{ color: 'blue' }} // 添加颜色样式
                    >
                      查看详情
                    </a>
                ),
            },
            
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
                dataIndex: 'operation',
                render: (text: any, record: any, index: number) => {
                    return this.state.dataSource.length > 0 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.onDelete(record, index)}
                        >
                            <span>Delete</span>
                        </Popconfirm>
                    ) : null;
                },
            },
        ];
        this.state = {
            dataSource: [
                {
                    key: '0',
                    hostname: 'liubq34412',
                    label: '-',
                    group: 'default',
                    OStype: 'Windows',
                    risks: {      
                        warning1: 0,
                        warning2: 1,
                        warning3: 2},
                    status: '离线',
                    clientUsage: '32',
                    updateTime: '18:00, 2023 12 16',
                },
                // {
                //     key: '1',
                //     hostname: 'liubq34413',
                //     label: '-',
                //     group: 'default',
                //     OStype: 'Windows',
                //     risks: {      
                //         warning1: 0,
                //         warning2: 1,
                //         warning3: 0},
                //     status: '离线',
                //     clientUsage: '32',
                //     updateTime: '18:01, 2023 12 16',
                // },
                // {
                //     key: '2',
                //     hostname: 'liubq34414',
                //     label: '-',
                //     group: 'default',
                //     OStype: 'Windows',
                //     risks: {      
                //         warning1: 2,
                //         warning2: 0,
                //         warning3: 0},
                //     status: '离线',
                //     clientUsage: '32',
                //     updateTime: '18:02, 2023 12 16',
                // },
            ],
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
        };
    }
    columns: any;
    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys ,
            areRowsSelected: selectedRowKeys.length > 0,});
    };
    // Define the rowSelection object inside the render method
    renderRowSelection = () => {
        return {
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            this.setState({ selectedRowKeys });
        },
        // Add other rowSelection properties and methods as needed
        };
    };
    onDelete = (record: any, index: number) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ deleteIndex: record.key });
        setTimeout(() => {
            this.setState({ dataSource });
        }, 500);
    };
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [newData, ...dataSource],
            count: count + 1,
        });
    };

    handleMouseEnter = (_: any, index: number) => {
        // 使用 map 来更新数组中特定索引的值
        this.setState(prevState => ({
          activeIndex: prevState.activeIndex.map((val: number, i: number) => (i === index ? index : val)),
        }));
      };
    
    handleMouseLeave = () => {
    // 重置所有索引为 -1
    this.setState({
        activeIndex: this.state.activeIndex.map(() => -1),
    });
    };
    handleExport = () => {
        const { dataSource, selectedRowKeys } = this.state;
    
        // 过滤出已选中的行数据
        const selectedData = dataSource.filter((row: DataType) => selectedRowKeys.includes(row.key));
    
        // 检查是否有选中的行
        if (selectedData.length === 0) {
            alert('没有选中的行');
            return;
        }
    
        // 转换数据为CSV格式
        const csvData = this.convertToCSV(selectedData);
    
        // 触发下载
        this.triggerDownload(csvData, 'export.csv');
    };
    
    convertToCSV = (data: DataType[]) => {
        // 假设您希望导出的CSV中包括所有字段
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((row: DataType) => {
            const riskValues = Object.values(row.risks).join(',');
            return `${row.key},${row.hostname},${row.label},${row.group},${row.OStype},${riskValues},${row.status},${row.clientUsage},${row.updateTime}`;
        });
        return [headers, ...rows].join('\n');
    };
    
    triggerDownload = (data: string, filename: string) => {
        const element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
        element.download = filename;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    
    // handleExport = () => {
    //     const { dataSource, selectedRowKeys } = this.state;

    //     // 过滤出已选中的行数据
    //     const selectedData = dataSource.filter((row: DataType) => selectedRowKeys.includes(row.key));

    //     // 转换数据为CSV格式
    //     const csvData = this.convertToCSV(selectedData);

    //     // 触发下载
    //     this.triggerDownload(csvData, 'export.csv');
    // };
    // convertToCSV = (data: DataType[]) => {
    //     // 导出的CSV中所有字段
    //     const headers = Object.keys(data[0]).join(',');
    //     const rows = data.map((row: DataType) => {
    //         const riskValues = Object.values(row.risks).join(',');
    //         return `${row.key},${row.hostname},${row.label},${row.group},${row.OStype},${riskValues},${row.status},${row.clientUsage},${row.updateTime}`;
    //     });
    //     return [headers, ...rows].join('\n');
    // };
    // triggerDownload = (data: string, filename: string) => {
    //     const element = document.createElement('a');
    //     element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
    //     element.download = filename;
    //     element.style.display = 'none';
    //     document.body.appendChild(element);
    //     element.click();
    //     document.body.removeChild(element);
    // };
      

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        const rowSelection = this.renderRowSelection();
        // Conditional button style
        const buttonStyle = this.state.areRowsSelected
            ? { fontWeight: 'bold' as 'bold', color: 'red' } 
            : { fontWeight: 'normal' as 'normal', color: 'grey' }; 


        const alertDataOne = [
            { name: '运行中', value: 7, color: '#22BC44' },//GREEN
            { name: '运行异常', value: 2, color: '#FBB12E' },//ORANGE
            { name: '离线', value: 5, color: '#EA635F' },//RED
            { name: '未安装', value: 1, color: '#E5E8EF' }//GREY
        ];
        const alertDataTwo = [
        { name: '无风险主机', value: 13, color: '#E5E8EF' },//GREY
        { name: '存在告警', value: 1, color: '#FBB12E' }//ORANGE
        ];
        const alertDataThree = [
        { name: '无风险主机', value: 13, color: '#E5E8EF' },//GREY
        { name: '存在高可利用漏洞', value: 1, color: '#EA635F' }//RED
        ];
        const alertDataFour = [
            { name: '无风险主机', value: 13, color: '#E5E8EF' },//GREY
            { name: '存在高危基线', value: 2, color: '#4086FF' }//BLUE
        ];
          

        const statusData: StatusItem[] = [
        { color: '#22BC44', label: '运行中 ', value: 7 },
        { color: '#FBB12E', label: '运行异常 ', value: 2 },
        { color: '#EA635F', label: '离线 ', value: 5 },
        { color: '#E5E8EF', label: '未安装 ', value: 1 },
        ];
        const statusData1: StatusItem[] = [
        { color: '#E5E8EF', label: '无风险主机 ', value: 13 },
        { color: '#FBB12E', label: '存在告警的主机 ', value: 1 },
        { color: '#EA635F', label: '存在漏洞的主机 ', value: 2 },
        { color: '#4086FF', label: '存在高危基线的主机 ', value: 2 },
        ];

        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
                <BreadcrumbCustom breads={['资产中心', '主机列表']} />
                <Row gutter={[12, 6]}/*(列间距，行间距)*/> 
                    <Col span={8} >
                        <Card /*title="主机状态分布" 产生分界线*/style={{fontWeight: 'bolder', width: '100%', height:300}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'18px',fontWeight: 'bold' }}>主机状态分布</h2>
                        </div>
                        <Row gutter={0}>
                            <Col span={12} >
                            <ResponsiveContainer width="100%" height={200}>
                            <PieChart >
                                <Pie 
                                data={alertDataOne}
                                cx="50%"
                                cy="50%"
                                innerRadius={54}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                onMouseEnter={(e) => this.handleMouseEnter(e, 0)}//0代表第一个扇形图
                                onMouseLeave={this.handleMouseLeave}
                                outerRadius={this.state.activeIndex[0] === 0 ? 80 : 72} // 0代表第一个扇形图，如果悬停则扇形半径变大
                                className={this.state.activeIndex === 0 ? 'pie-hovered' : 'pie-normal'}
                                >
                                {alertDataOne.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                </Pie>
                                {/* <Tooltip content={<CustomTooltip />} /> */}
                            </PieChart>
                            </ResponsiveContainer> 
                            
                            </Col>
                            <Col span={2}> </Col>
                            <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                            <StatusPanel statusData={statusData} />
                            </div>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={16} style={{margin: '2 2' }}>
                        <Card /*title="主机风险分布"*/ style={{fontWeight: 'bolder', width: '100%', height:300}}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold' }}>主机风险分布</h2>
                            </div>
                            <Row gutter={0}>
                            <Col span={5}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie className="pie-chart-segment"
                                    data={alertDataTwo}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={54}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    onMouseEnter={(e) => this.handleMouseEnter(e, 1)}
                                    onMouseLeave={this.handleMouseLeave}
                                    outerRadius={this.state.activeIndex[1] === 1 ? 80 : 72} // 如果悬停则扇形半径变大
                                    
                                    >
                                    {alertDataTwo.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    <Label value={'待处理告警:'+`${Math.round(alertDataTwo[1].value/(alertDataTwo[0].value+alertDataTwo[1].value)*100)}%`} 
                                    position="center" 
                                    style={{ fontSize: '14px' }}
                                    />
                                    </Pie>

                                    {/* <Tooltip content={<CustomTooltip />} /> */}
                                </PieChart>
                                </ResponsiveContainer>

                            </Col>
                            <Col span={5}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie className="pie-chart-segment"
                                    data={alertDataThree}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={54}
                                    onMouseEnter={(e) => this.handleMouseEnter(e, 2)}
                                    onMouseLeave={this.handleMouseLeave}
                                    outerRadius={this.state.activeIndex[2] === 2 ? 80 : 72} // 如果悬停则扇形半径变大
                                    
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    >
                                    {alertDataThree.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    <Label
                                    value={'高危漏洞:'+`${Math.round(alertDataThree[1].value / (alertDataThree[0].value + alertDataThree[1].value) * 100)}%`}
                                    position="center"
                                    style={{ fontSize: '14px' }} // Set the font size as desired
                                    />
                                    </Pie>
                                    
                                </PieChart>
                                </ResponsiveContainer>
                            </Col>
                            <Col span={5}>
                                <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie className="pie-chart-segment"
                                    data={alertDataFour}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={54}
                                    onMouseEnter={(e) => this.handleMouseEnter(e, 3)}
                                    onMouseLeave={this.handleMouseLeave}
                                    outerRadius={this.state.activeIndex[3] === 3 ? 80 : 72} // 如果悬停则扇形半径变大
                                    
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    
                                    >
                                    {alertDataFour.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    <Label value={'待加固基线:'+`${Math.round(alertDataFour[1].value/(alertDataFour[0].value+alertDataFour[1].value)*100)}%`} 
                                    position="center" style={{ fontSize: '14px' }}/>
                                    </Pie>
                                    
                                </PieChart>

                                </ResponsiveContainer>
                            </Col>
                            <Col span={2} > </Col>
                            <Col span={6} >
                            <div style={{ transform: 'translateY(40px)' }}>
                                <StatusPanel statusData={statusData1} />
                            </div>
                            </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col md={24}>
                        <div className="gutter-box">
                        <Card bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontWeight: 'bold' }}>主机内容</h2>
                                <div>
                                <Button style={buttonStyle} onClick={this.handleExport}>批量导出</Button>
                                <Button style={buttonStyle} name="del" onClick={this.handleAdd}>批量添加标签</Button>
                                <Button style={buttonStyle} name="del" onClick={this.handleAdd}>批量下发任务</Button>
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Input.Search
                                placeholder="请选择筛选条件并搜索"
                                onSearch={this.handleAdd}//
                                style={{ width: '100%' }}
                                />
                            </div>
                            <Table
                                rowSelection={rowSelection} // 应用 rowSelection 配置
                                //locale={{ emptyText: 'No Data' }}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                rowClassName={(record, index) => {
                                if (this.state.deleteIndex === record.key)
                                    return 'animated zoomOutLeft min-black';
                                return 'animated fadeInRight';
                                }}
                            />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ExampleAnimations;
