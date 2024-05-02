import React, { useState } from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Select, Form, Modal, message } from 'antd';
import moment, { Moment } from 'moment';
import { convertUnixTime, fetchDataFromAPI, handleExport } from '../ContextAPI/DataService';
import { FilterDropdownProps, simplifiedTablePanel } from '../tableUtils';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';


interface GenericDataItem {
    [key: string]: any;
}

interface DataDisplayTableProps {
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    searchColumns?:string[];
    currentPanel: string;

    externalDataSource: any[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    childrenColumnName?: string; // 作为可选属性
    expandedRowRender?: (record: any) => React.ReactNode; // 添加expandedRowRender属性
    indentSize?: number; // 也可以声明为可选属性，如果您希望为其提供默认值
    apiEndpoint: string;

}

interface DataDisplayTableState {
    lastUpdated: string | null;
    data: any[];
    selectedDateRange: [string | null, string | null];

    selectedRowKeys: React.Key[];// 可选属性，代表被选中行的keys，用于控制独立的key

    selectedApplicationType: string | null,
    searchQuery: string;
    selectedSearchField: string;
    currentPanelName: string;
    panelChangeCount: number;

    selectrangequeryParams: string;

    // 排序或者过滤处理后的data
    sortedData: GenericDataItem[],
    sortConfig: null,

    showModal: boolean;
    user_character: string;
    dataSourceChanged: boolean;
}


class DataDisplayTable extends React.Component<DataDisplayTableProps, DataDisplayTableState> {
    constructor(props: DataDisplayTableProps) {
        super(props);
        this.state = {
            showModal: false,
            user_character: 'admin',

            selectedRowKeys: [],
            lastUpdated: null,
            selectedDateRange: [null, null],

            searchQuery: '',
            selectedSearchField: '',
            selectrangequeryParams: '',

            selectedApplicationType: null,
            currentPanelName: this.props.currentPanel,
            panelChangeCount: 0,

            // 排序或者过滤处理后的data
            sortedData: [],
            sortConfig: null,

            dataSourceChanged: false,
            data: [],
        };
    }
    componentDidMount() {
        this.setState({
            lastUpdated: new Date().toLocaleString(),
        })
    }
    componentDidUpdate(prevProps: any) {

        if (this.state.panelChangeCount === 1 || prevProps.currentPanel !== this.props.currentPanel) { // 修改条件检查逻辑
            console.log('Panel changed from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
            this.setState({
                lastUpdated: new Date().toLocaleString(),
                // selectedSearchField: '',
                // searchQuery: '',
                // selectrangequeryParams: '',
                // selectedDateRange: [null, null], // 日期筛选器重置
                selectedRowKeys: [], //切换页面时，重置keys
                dataSourceChanged: true, // 此状态字段可能需要进一步审查其必要性
                currentPanelName: this.props.currentPanel,
            }, () => {
                // 如果有需要，可以在状态更新后获取数据
                // this.props.fetchLatestData(this.props.apiEndpoint,'all', '', '');
            });
        }
        else {
            console.log('Panel did not change, from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
        }
    }
    generate_new_columns = (columns: any[], search_index=['']): any[] => {
        // 遍历this.props.columns中的每一列
        return columns.map((column: any) => {
          // 如果列名在search_index中
          if (search_index.includes(column.dataIndex)) {
            // 为这列添加搜索功能
            return {
              ...column,
              filterIcon: (filtered: boolean) => (
                <div >
                  {/* 添加动画效果 */}
                  <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, transition: 'color 0.3s' }} />
                  {/* 显示提醒标志 */}
                  {filtered && <ExclamationCircleOutlined style={{ position: 'absolute', top: -4, right: -4, color: '#FF4500' }} />}
                  {/* 增加背景色或边框 */}
                  <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, backgroundColor: '#FF4500', borderRadius: '50%', display: filtered ? 'block' : 'none' }}></div>
                </div>
              ),
              filterDropdown: (filterDropdownProps: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                  <Input
                    autoFocus
                    placeholder={`搜索${column.title}...`}
                    value={filterDropdownProps.selectedKeys[0]}
                    onChange={e => filterDropdownProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => filterDropdownProps.confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                  />
                  <Button
                    onClick={() => {
                        filterDropdownProps.confirm()
                        this.setState({selectedRowKeys:[]})
                    }}
                    size="small"
                    style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
                  >
                    搜索
                  </Button>
                  <Button
                    disabled={filterDropdownProps.clearFilters === undefined}
                    onClick={() => {
                        filterDropdownProps.clearFilters?.()
                        this.setState({selectedRowKeys:[]})
                    }}
                    size="small"
                    style={{ width: 90 }}
                  >
                    重置
                  </Button>
                </div>
              ),
              // 添加onFilter属性，以处理搜索逻辑
              onFilter: (value: string, record: any) =>
                record[column.dataIndex]
                  ? record[column.dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                  : false,
            };
          } else {
            // 如果不在search_index中，直接返回原列
            return column;
          }
        });
      }

    onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        // 新的 selectedRowKeys 将基于当前选择的行，同时考虑子行
        let newSelectedRowKeys = [...selectedRowKeys];

        selectedRows.forEach(row => {
            if (row.children && row.children.length > 0) {
                // 对于每个选中的行，如果它有子行，则将这些子行的 key 也加入到 newSelectedRowKeys 中
                const childKeys = row.children.map((child: any) => child.key);
                newSelectedRowKeys = [...newSelectedRowKeys, ...childKeys];
            }
        });

        // 更新状态以反映新的选择
        this.setState({ selectedRowKeys: newSelectedRowKeys });
        message.info("keys:"+newSelectedRowKeys);
    };

    
    // 使用示例，需要传入数据源、当前面板标识和要保存的格式（txt 或 csv）
    // handleExport(data, 'myPanel', 'csv');
    
    handleDeleteSelected = () => {
        // 重置选中的行
        this.setState({ selectedRowKeys: [] });
    };



    render() {
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
                // 更新 selectedRowKeys 状态以包括父行和子行的键值
                // this.setState({ selectedRowKeys });
                this.onSelectChange(selectedRowKeys,selectedRows)
            },
            // 如果需要，可以在这里添加 getCheckboxProps 来定制每一行复选框的行为
        };
        const new_columns = this.generate_new_columns(this.props.columns,this.props.searchColumns);

        // const data = this.state.data.map(item => {
        //     // 时间转换
        //     if (this.props.timeColumnIndex) {
        //         this.props.timeColumnIndex.forEach(column => {
        //             if (item[column]) {
        //                 item[column] = convertUnixTime(parseFloat(item[column]));
        //             }
        //         });
        //     };
        //     return item;
        // })
        // const data = Array.isArray(this.state.data)?this.state.data:[this.state.data];
        const data = this.props.externalDataSource;
        const compStyle_normal = {
            //opacity: isButtonDisabled ? 0.5 : 1,
        }

        const selectedcompStyle = compStyle_normal;

        const selectedTableStyle = 'customTable';

        const isButtonDisabled = this.props.externalDataSource.length === 0
            || this.state.selectedRowKeys.length === 0;
        // const isButtonDisabled = this.state.data.length === 0
        //     || this.state.selectedRowKeys.length === 0;

        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const { refreshDataFromAPI } = context;
                    const handleRefresh=(api:string)=>{
                        refreshDataFromAPI(api)
                        this.setState({
                            lastUpdated: new Date().toLocaleString(),
                        })
                    }
                    return (//Table的宽度被设置为1330px
                        <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', }}>
                            <Row gutter={[12, 6]} style={{ marginTop: '-10px' }}>
                                <Col
                                    md={this.props.currentPanel === 'applications1' ? 20 : 24}
                                    style={{
                                        paddingLeft: this.props.currentPanel === 'applications1' ? '12px' : '0px',
                                    }}
                                >
                                    <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <Row gutter={[2, 2]} >
                                                <Col flex="none">
                                                    {(this.props.currentPanel === "TaskDetail") && (
                                                        <Link to="/app/create_agent_task" target="_blank">
                                                            <Button
                                                                style={{
                                                                    ...selectedcompStyle,
                                                                    backgroundColor: '#1664FF', color: 'white', marginRight: '10px',
                                                                }}
                                                            >
                                                                新增任务
                                                            </Button>
                                                        </Link>)}
                                                    <Button
                                                        style={{
                                                            ...selectedcompStyle, marginRight: '10px',
                                                            opacity: isButtonDisabled ? 0.5 : 1
                                                        }}
                                                        onClick={()=>handleExport(this.props.externalDataSource,
                                                            this.props.currentPanel,this.state.selectedRowKeys)}
                                                        disabled={isButtonDisabled}
                                                    >
                                                        批量导出
                                                    </Button>
                                                    {/* <Button 
                                        style={{...selectedcompStyle,}}>
                                    采集最新数据
                                    </Button> */}
                                                </Col>
                                                <Col flex="auto" style={{ textAlign: 'left', marginLeft: 10, marginTop: '5px', }}>
                                                    <span>最近更新時間: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                                </Col>
                                                <Col style={{ textAlign: 'left', marginLeft: 10, marginRight: '0px', }}>
                                                    <Button icon={<ReloadOutlined />}
                                                        // onClick={() => refreshDataFromAPI(this.props.apiEndpoint)}
                                                        onClick={() => handleRefresh(this.props.apiEndpoint)}
                                                         >刷新</Button>
                                                </Col>
                                            </Row>
                                        </div>
                                        {/* {(data.length===0)?(                
                        <Card bordered={true}
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center',backgroundColor: '#ffffff', width: '100%' }}>
                            <LoadingOutlined style={{ fontSize: '3em' }} />
                        </Card>)
                        :(<Table
                            className={selectedTableStyle}
                            rowSelection={rowSelection}
                            rowKey={this.props.columns[0].key}//使用第一个字段区分各个row，最好是PK
                            dataSource={data}
                            columns={this.props.columns}
                            childrenColumnName={this.props.childrenColumnName}
                            expandedRowRender={this.props.expandedRowRender}
                            //indentSize={this.props.indentSize}
                            locale={(this.state.dataSourceChanged) && (this.props.externalDataSource.length === 0) 
                                ? customLocale:undefined}
                        />)} */}
                                        <Table
                                            className={selectedTableStyle}
                                            rowSelection={rowSelection}
                                            rowKey={this.props.columns[0].key}//使用第一个字段区分各个row，最好是PK
                                            dataSource={data}
                                            columns={new_columns}
                                            childrenColumnName={this.props.childrenColumnName}
                                            expandedRowRender={this.props.expandedRowRender}
                                        //indentSize={this.props.indentSize}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        )


    }
}

export default DataDisplayTable;
