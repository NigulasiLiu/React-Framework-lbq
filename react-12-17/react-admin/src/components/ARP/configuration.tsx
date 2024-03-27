/**
 * Created by hao.cheng on 2017/5/8.
 */
import React from 'react';
import { Row, Col, Card, Table, Popconfirm, Input, Button, DatePicker } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import moment, { Moment } from 'moment';
import { ConfigurationColums } from '../tableUtils';
const { RangePicker } = DatePicker;
type RangeValue<T> = [T | null, T | null] | null;
const { Search } = Input;

type HostInventoryProps = {};
type HostInventoryState = {
    dataSource: any[];
    count: number;
    deleteIndex: number | null;

    selectedRowKeys: React.Key[];
    selectedDateRange: [string | null, string | null];
    areRowsSelected: boolean;
};

interface DataType1 {
    key: React.Key;
    whitelistName: string;    // 加白名称
    whitelistDescription: string; // 加白描述
    whitelistScope: string;    // 加白范围
    matchAlarmName: string;    // 匹配告警名
    matchMethod: string;       // 匹配方式
    occurrenceTime: string;   // 发生时间
}

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
        <div style={{ fontFamily: 'YouYuan, sans-serif' }}>
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


class Configuration extends React.Component<HostInventoryProps, HostInventoryState> {
    constructor(props: any) {
        super(props);
        this.columns = [
            {
                title: () => <span style={{ fontWeight: 'bold' }}>加白名称</span>,
                dataIndex: 'whitelistName',
                //width: '13%',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>加白描述</span>,
                dataIndex: 'whitelistDescription',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>加白范围</span>,
                dataIndex: 'whitelistScope',
                filters: [
                    { text: '全局', value: '全局' },
                    { text: '非全局', value: '非全局' },
                ],
                onFilter: (value: string | number | boolean, record: DataType1) => record.whitelistScope.includes(value as string),
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>匹配告警名</span>,
                dataIndex: 'matchAlarmName',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>匹配方式</span>,
                dataIndex: 'matchMethod',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作时间</span>,
                dataIndex: 'occurrenceTime',
            },
            {
                title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
                dataIndex: 'operation',
                render: (text: string, record: DataType1) => (
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

            // {
            //     title: () => <span style={{ fontWeight: 'bold' }}>操作</span>,
            //     dataIndex: 'operation',
            //     render: (text: any, record: any, index: number) => {
            //         return this.state.dataSource.length > 0 ? (
            //             <Popconfirm
            //                 title="Sure to delete?"
            //                 onConfirm={() => this.onDelete(record, index)}
            //             >
            //                 <span>Delete</span>
            //             </Popconfirm>
            //         ) : null;
            //     },
            // },
        ];
        this.state = {
            dataSource: [],
            count: 2,
            deleteIndex: -1,
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            selectedDateRange: [null,null]
        };
    }
    columns: any;
    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({
            selectedRowKeys,
            areRowsSelected: selectedRowKeys.length > 0,
        });
    };
    // Define the rowSelection object inside the render method


    onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
        if (dates) {
            // 用户选择了日期范围
            const [start, end] = dateStrings; // 使用 dateStrings，它是日期的字符串表示
            this.setState({ selectedDateRange: [start, end] });
        } else {
            // 用户清除了日期选择
            this.setState({ selectedDateRange: [null, null] });
        }
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
    };
  

    render() {
        const { dataSource, selectedRowKeys, selectedDateRange } = this.state;
        // Conditional button style

        const filteredDataSource = dataSource.filter(item => {
            // 解析 occurrenceTime 字符串为 moment 对象
            const itemDate = moment(item.occurrenceTime, 'YYYY-MM-DD HH:mm:ss');
    
            // 将 selectedDateRange 中的字符串转换为 moment 对象，如果为 null 则保持为 null
            const [startDateStr, endDateStr] = selectedDateRange;
            const startDate = startDateStr ? moment(startDateStr, 'YYYY-MM-DD') : null;
            const endDate = endDateStr ? moment(endDateStr, 'YYYY-MM-DD') : null;
    
            // 检查 itemDate 是否在选定的日期范围内
            return (!startDate || itemDate.isSameOrAfter(startDate, 'day')) && 
                   (!endDate || itemDate.isSameOrBefore(endDate, 'day'));
        });


        return (
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold' }}>
                <Row gutter={[12, 6]} /*(列间距，行间距)*/ style={{ marginTop: '10px' }}>
   
                    <Col md={24}>
                        <div className="gutter-box">
                             <Card bordered={false}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>配置管理</h2>
                             </div>
                                {/* <DataDisplayTable
                                    apiEndpoint="http://localhost:5000/api/files/configuration"
                                    columns={ConfigurationColums}
                                    currentPanel={"configuration"}
                                    selectedRowKeys={this.state.selectedRowKeys}
                                    onSelectChange={(keys: any) => this.onSelectChange(keys)}
                                /> */}
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Configuration;
