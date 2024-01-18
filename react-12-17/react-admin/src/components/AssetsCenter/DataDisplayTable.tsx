import React from 'react';
import axios from 'axios';
import { Table, Button, Input, Card, Col, DatePicker, Row, Menu,Pagination, Select  } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import SidebarComponent from '../SubComponents/SidebarComponent'
import SearchComponent from '../SubComponents/SearchComponent'
import FilterComponent from '../SubComponents/FilterComponent'


const { RangePicker } = DatePicker;
const { Option } = Select;

type RangeValue<T> = [T | null, T | null] | null;

interface DataDisplayTableProps {
    apiEndpoint: string;
    externalDataSource?: GenericDataItem[]; // 接口无数据时，可直接接受预定义的样例数据
    columns: any[];
    currentPanel?: string; // 新增一个可选的currentPanel属性
    timeColumnIndex?: string[];
    rankLabel?: string; //设定每个panel需要排序的的字段用于展示在overview
    selectedRowKeys?: React.Key[]; // 可选属性，代表被选中行的keys，用于控制独立的key
    onSelectChange?: (selectedKeys: React.Key[]) => void; // 选择变化时的可选函数
    //筛选top5数据，从父组件获取
    onTopDataChange?: (panelName: string, data: GenericDataItem[]) => void;
    
    hostName?: string; // 新增属性，表示当前显示的主机ID
    sqlTableName?:string;
    fields?:string[];
}

interface GenericDataItem {
    [key: string]: any;
}

interface DataDisplayTableState {
    dataSource: GenericDataItem[];
    selectedRowKeys: React.Key[];
    lastUpdated: string | null;
    searchQuery: string;
    selectedApplicationType: string | null; //用于展示与原型功能不同的panel
    selectedDateRange: [string | null, string | null];

    //newColumns:any[];
    
    currentPage: number;
    pageSize: number;
    selectedSearchField:string;
}

class DataDisplayTable extends React.Component<DataDisplayTableProps, DataDisplayTableState> {
    constructor(props: DataDisplayTableProps) {
        super(props);
        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            lastUpdated: null,
            searchQuery: '',
            selectedApplicationType: null,
            selectedDateRange: [null,null],

            
            currentPage: 1, // 当前页数
            pageSize: 12, // 每页显示的行数
            selectedSearchField:'',
        };
    }
    componentDidMount() {
        this.fetchLatestData().then(() => {
            //从最新获取的数据中读取列的字段以填充onFilter功能
            const newColumns = this.autoPopulateFilters();
            // 如果需要，可以在这里做其他的事情，比如存储newColumns到组件的state
        });
    }
    componentDidUpdate(prevProps: any, prevState:any) {
        
        // 检查是否筛选条件发生变化（例如，搜索字段或筛选日期范围）
        if (this.state.searchQuery !== prevState.searchQuery ||
            this.state.selectedDateRange !== prevState.selectedDateRange) {
            // 可以在这里添加更多的筛选条件检查
            this.calculateCurrentPage();
        }
        // 检查面板是否发生变化
        if (this.props.currentPanel !== prevProps.currentPanel) {
            // 如果面板发生变化，重置selectedRowKeys和lastUpdated
            this.setState(
                {
                    selectedRowKeys: [],
                    lastUpdated: null, // 重置lastUpdated
                    
                    searchQuery: '',
                    selectedApplicationType: null,
                    selectedDateRange: [null, null],
                    currentPage: 1,
                    pageSize: 12,
                    selectedSearchField: '', // 重置selectedSearchField
            
                
                },
                () => {
                    // 异步调用fetchLatestData来确保setState完成后执行
                    this.fetchLatestData();
                }
            );
        }
    }
    calculateCurrentPage = () => {
        const totalPage = Math.ceil(this.state.dataSource.length / this.state.pageSize);
        const currentPage = Math.min(this.state.currentPage, totalPage);
    
        this.setState({
            currentPage: currentPage || 1
        });
    };
    // handlePageChange = (page: number) => {
    //     this.setState({
    //       currentPage: page,
    //     });
    //   };
      handlePageChange = (page:number) => {
        this.setState({
            currentPage: page,
            selectedRowKeys: [] // 重置行选择
        });
    };
    
    fetchLatestData = async () => {
        try {
            const data = await this.fetchDataFromAPI();
            const sortedData = this.sortData(data);
            this.processData(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            this.handleFetchError();
        }
    };

    fetchDataFromAPI = async () => {
        const { apiEndpoint, sqlTableName, fields } = this.props;
        let fieldsQuery = fields && fields.length > 0 ? fields.join(',') : '*';
        let endpoint = `${apiEndpoint}?table=${sqlTableName}&fields=${fieldsQuery}`;
        
        const response = await axios.get(endpoint);
        if (response.data && response.data.length > 0) {
            return response.data;
        }
        throw new Error('No data received');
    };

    sortData = (data:GenericDataItem[]) => {
        const rankLabel = this.props.rankLabel ?? 'defaultRankField';
        return data.sort((a:any, b:any) => (b[rankLabel] ?? 0) - (a[rankLabel] ?? 0));
    };

    processData = (data:GenericDataItem[]) => {
        const topFiveData = data.slice(0, 5);
        this.setState({
            dataSource: this.convertUnixTimeColumns(data),
            lastUpdated: new Date().toLocaleString(),
        });

        if (this.props.onTopDataChange && this.props.currentPanel) {
            this.props.onTopDataChange(this.props.currentPanel, topFiveData);
        }
    };

    handleFetchError = () => {
        const { externalDataSource } = this.props;
        if (externalDataSource && externalDataSource.length > 0) {
            this.setState({
                dataSource: externalDataSource,
                lastUpdated: new Date().toLocaleString(),
            });
        } else {
            this.setState({ dataSource: [], lastUpdated: null });
        }
    };

    // fetchLatestData = async () => {
    //     try {
    //         const { apiEndpoint, hostName,sqlTableName,fields } = this.props;
    //         let fieldsQuery = fields && fields.length > 0 ? fields.join(',') : '*';
    //         let endpoint = `${apiEndpoint}?table=${sqlTableName}&fields=${fieldsQuery}`;
    
    //         const response = await axios.get(endpoint);
    //                     // 检查响应中的数据是否为空
    //                     if (response.data && response.data.length > 0) {
    //                         const rankLabel = this.props.rankLabel ?? 'defaultRankField'; // 使用 props 中的 rankLabel 或默认值
    //                         const sortedData = response.data.sort((a: any, b: any) => {
    //                             // 如果 rankLabel 字段不存在，则视为 0
    //                             const aValue = a[rankLabel] ?? 0;
    //                             const bValue = b[rankLabel] ?? 0;
    //                             return bValue - aValue;
    //                         });
            
    //                         // 获取排序后的前五条数据
    //                         const topFiveData = sortedData.slice(0, 5);
            
    //                         this.setState({
    //                             //dataSource: response.data,
    //                             dataSource: this.convertUnixTimeColumns(response.data),
    //                             lastUpdated: new Date().toLocaleString(),
    //                         });
    //                         //this.props.currentPanel可能为空，在加一层判断
    //                         if (this.props.onTopDataChange && this.props.currentPanel) {
    //                             this.props.onTopDataChange(this.props.currentPanel, topFiveData);
    //                         }
    //                     } else {
    //                         // 如果数据为空，则设置dataSource为空数组，并将lastUpdated设置为null
    //                         this.setState({
    //                             dataSource: [],
    //                             lastUpdated: null,
    //                         });
    //                     }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
            
    //         const externalData = this.props.externalDataSource;
    //         if (externalData && externalData.length > 0) {
    //             this.setState({
    //             dataSource: externalData,
    //             lastUpdated: new Date().toLocaleString(),
    //             });
    //         }
    //     }
        
    // };
    extractFieldVarieties = <T extends keyof GenericDataItem>(fieldName: T): Array<{text: string, value: string}> => {
        const { dataSource } = this.state;
        const fieldVarieties = new Set<GenericDataItem[T]>();

        dataSource.forEach((item) => {
            const fieldValue = item[fieldName];
            if (fieldValue !== undefined && fieldValue !== null) {
                fieldVarieties.add(fieldValue);
            }
        });

        return Array.from(fieldVarieties).map(variety => ({
            text: variety.toString(),
            value: variety.toString(),
        }));
    };
    // 自动填充filters的方法,也就是自动填充沙漏里的选项
    autoPopulateFilters = () => {
        const { columns } = this.props;
        const { dataSource } = this.state;
      
        const newColumns = columns.map(column => {
          if (column.onFilter && dataSource) {
            const fieldVarieties = new Set(dataSource.map(item => item[column.dataIndex]));
            const filters = Array.from(fieldVarieties).map(variety => ({
              text: (
                <span style={{ color: '#000', background: '#fff' }}>
                  {variety ? variety.toString() : ''}
                </span>
              ),
              value: variety,
            }));
            return { ...column, filters };
          }
          return column;
        });
      
        return newColumns;
      };
      
      updateDataSource = (filteredData:any[]) => {
        this.setState({ dataSource: filteredData });
      };
      
      // 在 autoPopulateFilters 方法中，只更新筛选项，不更新 dataSource
      autoPopulateFiltersAndUpdateDataSource = () => {
        const { columns } = this.props;
        const { dataSource, selectedApplicationType, selectedDateRange, searchQuery } = this.state;
      
        let filteredData = [...dataSource];
        // Apply filters
        columns.forEach(column => {
          if (column.onFilter) {
            filteredData = filteredData.filter(record =>
              record[column.dataIndex].toString().includes(column.filteredValue)
            );
          }
        });
      
        // Apply other filters (application type, date range, search query)
        if (selectedApplicationType) {
          filteredData = filteredData.filter(record => record.applicationType === selectedApplicationType);
        }
      
        if (selectedDateRange[0] && selectedDateRange[1]) {
          filteredData = filteredData.filter(record => {
            const itemDate = moment(record.occurrenceTime, 'YYYY-MM-DD HH:mm:ss');
            return (
              itemDate.isSameOrAfter(selectedDateRange[0], 'day') &&
              itemDate.isSameOrBefore(selectedDateRange[1], 'day')
            );
          });
        }
      
        if (searchQuery) {
          filteredData = filteredData.filter(record =>
            Object.keys(record).some(key =>
              record[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        }
      
        // Update the state with the filtered data
        this.updateDataSource(filteredData);
      
        // Return the updated columns
        return this.autoPopulateFilters();
      };
      
    //资产指纹--应用--小型侧边栏
    filterDataByApplicationType = (data: GenericDataItem[]) => {
        return data.filter((item) =>
            this.state.selectedApplicationType
                ? item.applicationType === this.state.selectedApplicationType
                : true
        );
    };
    convertUnixTimeColumns = (data: GenericDataItem[]): GenericDataItem[] => {
        const { timeColumnIndex } = this.props;
        if (!timeColumnIndex || timeColumnIndex.length === 0) {
            return data;
        }

        return data.map(item => {
            const newItem = { ...item };
            timeColumnIndex.forEach(columnIndex => {
                if (newItem[columnIndex]) {
                    // 转换UNIX时间戳为本地时间字符串
                    newItem[columnIndex] = new Date(newItem[columnIndex] * 1000).toLocaleString();
                }
            });
            return newItem;
        });
    };
    // handleSearch = (query: string) => {
    //     this.setState({ searchQuery: query });

    //     if (!query) {
    //         this.fetchLatestData();
    //         return;
    //     }

    //     const filteredDataSource = this.state.dataSource.filter((item) =>
    //         Object.keys(item).some((key) =>
    //             item[key].toString().toLowerCase().includes(query.toLowerCase())
    //         )
    //     );

    //     this.setState({ dataSource: filteredDataSource });
    // };
    
    // 渲染搜索字段的下拉菜单
    renderSearchFieldDropdown = () => {
        const { columns } = this.props;
    
        return (
            <Select style={{ width: '200px', marginRight: '8px', color: 'black', backgroundColor: 'white' }}

                placeholder="选择搜索字段"
                onChange={this.handleSearchFieldChange}
            >
                {columns?.map((column, index) => (
                    <Option style={{ color: 'black' }} key={index} value={column.title}>
                        {column.title}
                    </Option>
                ))}
            </Select>
        );
    };
    

    // 处理搜索字段的变化
    handleSearchFieldChange = (selectedField: string) => {
        this.setState({ selectedSearchField: selectedField });
    };

    handleSearch = (query: string) => {
        try {
            if (!this.state.selectedSearchField) {
                console.error("未选择搜索字段");
                return;
            }
    
            this.setState({ searchQuery: query });
    
            const filteredDataSource = this.state.dataSource.filter((item) =>
                item[this.state.selectedSearchField].toString().toLowerCase().includes(query.toLowerCase())
            );
    
            this.setState({ dataSource: filteredDataSource });
        } catch (error) {
            console.error("搜索时出现错误：", error);
        }
    };
    
    
    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys });
    };

    handleExport = () => {
        const { dataSource, selectedRowKeys } = this.state;

        // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
        if (selectedRowKeys.length === 0 || dataSource.length === 0) {
            alert('没有可导出的数据');
            return;
        }
        const dataToExport = dataSource.filter((item) => selectedRowKeys.includes(item.id));
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 处理侧边栏选择事件
    handleApplicationTypeSelect = (e: any) => {
        const applicationType = e.key;
        // 选择新的应用类型后，也重置selectedRowKeys
        this.setState(
            {
                selectedApplicationType: applicationType,
                selectedRowKeys: [], // 重置selectedRowKeys
            },
            this.fetchLatestData
        );
    };
    // 渲染侧边栏组件
    renderSidebar = () => {
        const applicationTypes = ['全部应用', '数据库', 'Web服务器', 'DevOps工具', '缓存服务']; // 示例应用类型，后续最好读取后再构造菜单
        return (
            <SidebarComponent onApplicationTypeSelect={this.handleApplicationTypeSelect} />
        );
    };
    onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
        if (dates) {
            const [start, end] = dateStrings;
            this.setState({ selectedDateRange: [start, end] });
        } else {
            this.setState({ selectedDateRange: [null, null] });
        }
    };
    
    render() {
        const { dataSource, selectedRowKeys, lastUpdated, selectedSearchField  } = this.state;
        const { currentPanel } = this.props; // 从props中获取currentPanel
        const newColumns = this.autoPopulateFilters();
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const isButtonDisabled = dataSource.length === 0 || selectedRowKeys.length === 0;
        const filteredDataSource = dataSource.filter(item => {
            const itemDate = moment(item.occurrenceTime, 'YYYY-MM-DD HH:mm:ss');
            const [startDateStr, endDateStr] = this.state.selectedDateRange;
            const startDate = startDateStr ? moment(startDateStr, 'YYYY-MM-DD') : null;
            const endDate = endDateStr ? moment(endDateStr, 'YYYY-MM-DD') : null;
            return (!startDate || itemDate.isSameOrAfter(startDate, 'day')) && 
                   (!endDate || itemDate.isSameOrBefore(endDate, 'day'));
        });
        
        // 根据当前页数和每页显示的行数截取数据
        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = startIndex + this.state.pageSize;
        const currentData = this.state.dataSource.slice(startIndex, endIndex);

        return (//Table的宽度被设置为1430px
            <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', width: '1430px', maxWidth: '100%' }}>
                <Row gutter={[12, 6]} style={{ marginTop: '10px'}}>
                    {/* Conditionally render the sidebar for applications */}
                    {currentPanel === 'applications' && (
                        <Col md={4} style={{ paddingRight: '12px', borderRight: '1px solid #ccc' }}>
                            {/* Render Sidebar here */}
                            {this.renderSidebar()}
                        </Col>
                    )}

                    {/* Main content area */}
                    <Col
                        md={currentPanel === 'applications' ? 20 : 24}
                        style={{
                            paddingLeft: currentPanel === 'applications' ? '12px' : '0px',
                        }}
                    >
                        <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col flex="none">
                                        <Button
                                            style={{ marginRight: 8, 
                                                opacity: isButtonDisabled ? 0.5 : 1 }}
                                            onClick={this.handleExport}
                                            disabled={isButtonDisabled}
                                        >
                                            批量导出
                                        </Button>
                                        <Button onClick={this.fetchLatestData}>采集最新数据</Button>
                                    </Col>
                                    <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10 }}>
                                        <span>最近更新时间: {lastUpdated ? lastUpdated : '-'}</span>
                                    </Col>
                                    {this.props.timeColumnIndex && this.props.timeColumnIndex.length > 0 && (
                                    <Col flex="none" style={{ marginLeft: 'auto' }}>
                                        <RangePicker style={{ width: 200 }} onChange={this.onDateRangeChange}/>
                                    </Col>
                                    )}
                                    {/* <Col flex="none" style={{ marginLeft: 'auto' }}>
                                        <RangePicker style={{ width: 200 }} />
                                    </Col> */}
                                </Row>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Row>
                                    {this.renderSearchFieldDropdown()} {/* 显示搜索字段下拉菜单 */}
                                    <Input.Search
                                        placeholder="搜索已选字段"
                                        onSearch={this.handleSearch}
                                        style={{ width: '77%' }}
                                    />
                                    <Button
                                        icon={<SyncOutlined />}
                                        onClick={this.fetchLatestData}
                                        style={{ marginLeft: currentPanel === 'applications' ? '12px' : '27px' }}
                                    />
                                </Row>
                            </div>
                            <Table
                                className="customTable"
                                rowSelection={rowSelection}
                                pagination={false}
                                dataSource={currentData}
                                columns={newColumns}
                                rowKey="id"
                                //locale={{ emptyText: 'No Data' }} // 可以指定无数据时展示的文本
                            />
                            <Pagination // 分页组件
                            current={this.state.currentPage}
                            pageSize={this.state.pageSize}
                            total={this.state.dataSource.length} // 总行数
                            onChange={this.handlePageChange} // 处理分页切换
                            showSizeChanger={false} // 不显示每页行数切换
                            style={{ marginTop: '16px', textAlign: 'center' }}
                        />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DataDisplayTable;
