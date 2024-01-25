/**
 * Created by hao.cheng on 2017/5/8.
 */
import React from 'react';
import axios from 'axios';
import { Row, Col, Card, Table, Popconfirm} from 'antd';
import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts';
import DataDisplayTable from './DataDisplayTable';
import { hostinventoryColumns } from '../../utils/tableUtils';
import FetchAPIDataTable from './FetchAPIDataTable';

//const { Search } = Input;

type HostInventoryProps = {};
type HostInventoryState = {
    dataSource: any[];
    statusData:StatusItem[];
    riskData:StatusItem[];
    fullDataSource: any[], // 存储完整的数据源副本
    count: number;
    deleteIndex: number | null;

    selectedRowKeys: React.Key[];
    activeIndex: any;
    areRowsSelected: boolean;
    searchQuery: string, // 添加这个字段来存储搜索查询
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
  type RiskCounts = {
    warning1: number;
    warning2: number;
    warning3: number;
};

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
    orientation: 'vertical' | 'horizontal'; // 添加方向属性
  }
  
//   export const StatusPanel: React.FC<StatusPanelProps> = ({ statusData, orientation }) => {
//     const containerStyle: React.CSSProperties = {
//         display: 'flex',
//         flexDirection: orientation === 'vertical' ? 'column' : 'row',
//         alignItems: 'center',
//       };
    
//     return (
//       <div style={containerStyle}>
//         {statusData.map((status, index) => (
//           <div key={index} style={{ display: 'flex', alignItems: 'center', margin: orientation === 'vertical' ? '8px 0' : '0 8px' }}>
//             <span style={{ 
//               height: '10px',
//               width: '10px',
//               backgroundColor: status.color,
//               borderRadius: '50%',
//               display: 'inline-block',
//               marginRight: '8px'
//             }}></span>
//             <span style={{ flexGrow: 1 }}>{status.label}</span>
//             <span>{status.value}</span>
//           </div>
//         ))}
//       </div>
//     );
//   };
export const StatusPanel: React.FC<StatusPanelProps> = ({ statusData, orientation }) => {
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      alignItems: 'flex-start',
      gap: orientation === 'horizontal' ? '7px' : '0', // 设置水平方向的间隔
    };
  
    const itemStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: orientation === 'vertical' ? 'space-between' : 'flex-start',
      alignItems: 'center',
      width: orientation === 'vertical' ? '100%' : undefined,
      margin: '3px',
    };
  
    const valueStyle: React.CSSProperties = {
      marginLeft: orientation === 'vertical' ? '40px' : '0', // 设置垂直方向的间隔
    };
  
    return (
      <div style={containerStyle}>
        {statusData.map((status, index) => (
          <div key={index} style={itemStyle}>
            <span style={{
              height: '10px',
              width: '10px',
              backgroundColor: status.color,
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px'
            }}></span>
            <span style={{ flexGrow: 1 }}>{status.label}</span>
            {orientation === 'vertical' && (
              <span style={valueStyle}>{status.value}</span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  
  


class HostInventory extends React.Component<HostInventoryProps, HostInventoryState> {
    constructor(props: any) {
        super(props);
        // this.hostinventoryColumns = [
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>主机名称</span>,
        //         dataIndex: 'hostname',
        //         //width: '13%',
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>标签</span>,
        //         dataIndex: 'label',
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>地域</span>,
        //         dataIndex: 'group',
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>操作系统</span>,
        //         dataIndex: 'OStype',
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>风险</span>,
        //         dataIndex: 'risks',
        //         render: (risks:Risk, record:any) => {
        //             return (
        //                 <div>
        //                   <div>告警 {risks.warning1}</div>
        //                   <div>风险 {risks.warning2}</div>
        //                   <div>基线 {risks.warning3}</div>
        //                 </div>
        //             );
        //           }
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>
        //             状态 
        //             </span>,
        //         dataIndex: 'status',
        //         filters: [
        //             { text: '未安装', value: '未安装' },
        //             { text: '运行中', value: '运行中' },
        //             { text: '运行异常', value: '运行异常' },
        //             { text: '离线', value: '离线' },
        //           ],
        //           onFilter: (value: string | number | boolean, record: DataType) => record.status.includes(value as string),
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>客户端资源使用</span>,
        //         dataIndex: 'clientUsage',
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>更新时刻</span>,
        //         dataIndex: 'updateTime',
        //     },
        //     {
        //         title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
        //         dataIndex: 'operation',
        //         render: (text: string, record: DataType) => (
        //             <a 
        //               href={'/login'} 
        //               target="_blank" 
        //               rel="noopener noreferrer"
        //               //style={{ color: 'blue' }} // 添加颜色样式
        //             >
        //               查看详情
        //             </a>
        //         ),
        //     },
            
        //     // {
        //     //     title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
        //     //     dataIndex: 'operation',
        //     //     render: (text: any, record: any, index: number) => {
        //     //         return this.state.dataSource.length > 0 ? (
        //     //             <Popconfirm
        //     //                 title="Sure to delete?"
        //     //                 onConfirm={() => this.onDelete(record, index)}
        //     //             >
        //     //                 <span>Delete</span>
        //     //             </Popconfirm>
        //     //         ) : null;
        //     //     },
        //     // },
        // ];
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
            ],
            statusData: [],
            riskData: [],
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            searchQuery: '', // 添加这个字段来存储搜索查询

            fullDataSource: [], // 存储完整的数据源副本
        };
    }
    //hostinventoryColumns: any;
    async componentDidMount() {
        try {
            const response = await axios.get('http://localhost:5000/api/hostinventory');
            if (response.data) {
                this.setState({
                    dataSource: response.data,
                });
                this.processChartData(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    processChartData(data:DataType[]) {
        const statusData = this.extractStatusData(data);
        const riskData = this.extractRiskData(data);

        this.setState({
            statusData,
            riskData,
        });
    }

    extractStatusData(data: DataType[]): StatusItem[] {
        let statusCounts = data.reduce((acc: { [key: string]: number }, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, {});
    
        type StatusColorsAndLabels = {
            [key in '未安装' | '运行中' | '运行异常' | '离线']: {
                color: string;
                label: string;
            };
        };
        
        const statusColorsAndLabels: StatusColorsAndLabels = {
            '未安装': { color: '#E5E8EF', label: '未安装' },
            '运行中': { color: '#22BC44', label: '运行中' },
            '运行异常': { color: '#FBB12E', label: '运行异常' },
            '离线': { color: '#EA635F', label: '离线' },
            // ... 其他状态
        };
        
    
        return Object.keys(statusCounts).map(key => {
            const statusInfo = statusColorsAndLabels[key as keyof StatusColorsAndLabels];
            return {
                color: statusInfo ? statusInfo.color : '#000',
                label: statusInfo ? statusInfo.label : key,
                value: statusCounts[key],
            };
        });
    }
    

    extractRiskData(data: DataType[]): StatusItem[] {
        let riskCounts: { [key: string]: number } = { warning1: 0, warning2: 0, warning3: 0 };
    
        data.forEach(item => {
            riskCounts.warning1 += item.risks.warning1;
            riskCounts.warning2 += item.risks.warning2;
            riskCounts.warning3 += item.risks.warning3;
        });
    
        const riskColorsAndLabels: { [key in 'warning1' | 'warning2' | 'warning3']: { color: string; label: string } } = {
            warning1: { color: 'red', label: '告警' },
            warning2: { color: 'orange', label: '风险' },
            warning3: { color: 'yellow', label: '基线' },
            // ... 其他可能的风险级别
        };
        
    
        return Object.keys(riskCounts).map(key => {
            const riskInfo = riskColorsAndLabels[key as keyof typeof riskColorsAndLabels];
            return {
                color: riskInfo.color,
                label: riskInfo.label,
                value: riskCounts[key as keyof typeof riskCounts],
            };
        });
    }
    
    



    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys ,
            areRowsSelected: selectedRowKeys.length > 0,});
    };
    ////为不同panel的勾选框设置状态
    // onSelectChange = (selectedKeys: React.Key[], panel: string) => {
    //     // 根据panel来设置对应的选中行keys
    //     this.setState((prevState) => ({
    //         panelSelectedRowKeys: {
    //             ...prevState.panelSelectedRowKeys,
    //             [panel]: selectedKeys,
    //         },
    //     }));
    // };
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
    handleSearch = (query:any) => {
        this.setState({ searchQuery: query });
    
        // 过滤 dataSource，匹配任何字段
        const filteredDataSource = this.state.dataSource.filter(item => {
            // 检查每个字段是否包含搜索字符串
            return Object.values(item).some(value => {
                // 确保值是字符串类型
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(query.toLowerCase());
                }
                return false;
            });
        });
    
        this.setState({ dataSource: filteredDataSource });
    };
    
    
    
    

    render() {
        const { dataSource } = this.state;
        //const hostinventoryColumns = this.hostinventoryColumns;
        const rowSelection = this.renderRowSelection();
        // Conditional button style
        const buttonStyle = this.state.areRowsSelected
            ? { fontWeight: 'bold' as 'bold', color: 'red' } 
            : { fontWeight: 'normal' as 'normal', color: 'grey' }; 

        //扇形图数据
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
          
        //StatusLabel数据
        const statusData: StatusItem[] = [
        { color: '#22BC44', label: '运行中 ', value: 7 },
        { color: '#FBB12E', label: '运行异常 ', value: 2 },
        { color: '#EA635F', label: '离线 ', value: 5 },
        { color: '#E5E8EF', label: '未安装 ', value: 1 },
        ];
        const riskDta: StatusItem[] = [
        { color: '#E5E8EF', label: '无风险主机 ', value: 13 },
        { color: '#FBB12E', label: '存在告警的主机 ', value: 1 },
        { color: '#EA635F', label: '存在漏洞的主机 ', value: 2 },
        { color: '#4086FF', label: '存在高危基线的主机 ', value: 2 },
        ];
        const riskData1: StatusItem[] = [
            { color: '#E53F3F', label: '高风险 ', value: 1 },
            { color: '#FEC746', label: '中风险 ', value: 1 },
            { color: '#468DFF', label: '低风险 ', value: 2 },
            ];

        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
               
                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '10px' }}> 
                    <Col span={8} >
                        <Card /*title="主机状态分布" 产生分界线*/style={{fontWeight: 'bolder', width: '100%', height:300}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                            <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>主机状态分布</h2>
                        </div>
                        <Row gutter={0}>
                            <Col span={12}>
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
                            <Col span={2}> 
                            </Col>
                            <div style={{ transform: 'translateX(40px) translateY(40px)' }}>
                            <StatusPanel statusData={statusData} orientation="vertical"/>
                            </div>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={16} style={{margin: '2 2' }}>
                        <Card style={{fontWeight: 'bolder', width: '100%', height:300}}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '6px' }}>主机风险分布</h2>
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
                                <StatusPanel statusData={riskDta} orientation="vertical"/>
                            </div>
                            </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ marginTop: '0px' }}> 
                    <Col md={24}>
                        <div className="gutter-box">
                        <Card bordered={false}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontWeight: 'bold', marginLeft: '6px' }}>主机内容</h2>
                            </div>
                            {/* <div style={{ marginBottom: 16 }}>
                                <Input.Search
                                placeholder="请选择筛选条件并搜索"
                                onSearch={this.handleSearch}//
                                style={{ width: '100%' }}
                                />
                            </div>
                            <Table
                                rowSelection={rowSelection} // 应用 rowSelection 配置
                                //locale={{ emptyText: 'No Data' }}
                                //bordered
                                className="customTable"
                                dataSource={dataSource}
                                columns={columns}
                                rowClassName={(record, index) => {
                                if (this.state.deleteIndex === record.key)
                                    return 'animated zoomOutLeft min-black';
                                return 'animated fadeInRight';
                                }}
                            /> */}
                            {/* <DataDisplayTable
                                apiEndpoint="http://localhost:5000/api/files/container"
                                columns={hostinventoryColumns}
                                currentPanel={"hostinventory"}
                                selectedRowKeys={this.state.selectedRowKeys}
                                onSelectChange={(keys: any) => this.onSelectChange(keys)}
                            /> */}
                            <FetchAPIDataTable
                                apiEndpoint="http://localhost:5000/api/asset_mapping/query_all"
                                timeColumnIndex={[]}
                                columns={hostinventoryColumns}
                                currentPanel="hostinventory"
                            />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HostInventory;
