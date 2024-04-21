import React, {useState} from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Select, Form, Modal } from 'antd';
import moment, { Moment } from 'moment';
import { buildRangeQueryParams, convertUnixTime} from './DataService';
import { simplifiedTablePanel } from '../tableUtils';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;

interface GenericDataItem {
    [key: string]: any;
}

interface DataDisplayTableProps {
    externalDataSource: any[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    // 可以根据需要添加其他 props，比如分页大小等
    currentPanel: string;

    childrenColumnName?: string; // 作为可选属性
    indentSize?: number; // 也可以声明为可选属性，如果您希望为其提供默认值
    expandedRowRender?: (record: any) => React.ReactNode; // 添加expandedRowRender属性

}

interface DataDisplayTableState {
    lastUpdated: string | null;
    selectedDateRange: [string | null, string | null];

    selectedRowKeys: React.Key[];// 可选属性，代表被选中行的keys，用于控制独立的key

    selectedApplicationType: string|null,
    searchQuery: string;
    selectedSearchField:string;
    currentPanelName:string;
    panelChangeCount:number;

    selectrangequeryParams:string;

    // 排序或者过滤处理后的data
    sortedData: GenericDataItem[],
    sortConfig: null,

    showModal: boolean;
    user_character: string;
    dataSourceChanged:boolean;
}


class DataDisplayTable extends React.Component<DataDisplayTableProps, DataDisplayTableState> {
    constructor(props: DataDisplayTableProps) {
        super(props);
        this.state = {
            showModal: false,
            user_character: 'admin',

            selectedRowKeys: [],
            lastUpdated:null,
            selectedDateRange: [null,null],
            
            searchQuery: '',
            selectedSearchField:'',
            selectrangequeryParams: '',

            selectedApplicationType: null,
            currentPanelName: this.props.currentPanel,
            panelChangeCount:0,
            
            // 排序或者过滤处理后的data
            sortedData: [],
            sortConfig: null,

            dataSourceChanged: false,
        };
    }
    componentDidMount() {
        this.setState({
            lastUpdated:new Date().toLocaleString(),
        })
    }
    componentDidUpdate(prevProps: any) {
    
        if (this.state.panelChangeCount===1||prevProps.currentPanel !== this.props.currentPanel) { // 修改条件检查逻辑
            console.log('Panel changed from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
            this.setState({
                lastUpdated: new Date().toLocaleString(),
                selectedSearchField: '',
                searchQuery: '',
                selectrangequeryParams: '',
                selectedDateRange: [null, null], // 日期筛选器重置
                selectedRowKeys: [],
                dataSourceChanged: true, // 此状态字段可能需要进一步审查其必要性
                currentPanelName: this.props.currentPanel,
            }, () => {
                // 如果有需要，可以在状态更新后获取数据
                // this.props.fetchLatestData(this.props.apiEndpoint,'all', '', '');
            });
        }
        else{
            console.log('Panel did not change, from ' + prevProps.currentPanel + ' to ' + this.props.currentPanel);
        }
    }




    // onSelectChange = (selectedRowKeys: React.Key[]) => {
    //     this.setState({ selectedRowKeys });

    // };

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
    };
    
    // handleExport = () => {
    //     const { externalDataSource, columns } = this.props;

    //     // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
    //     if (this.state.selectedRowKeys.length === 0 || externalDataSource.length === 0) {
    //         alert('没有可导出的数据');
    //         return;
    //     }
    
    //     // 筛选出要导出的数据
    //     const dataToExport = externalDataSource.filter((item) => this.state.selectedRowKeys.includes(item.id));
    
    //     // 创建 CSV 字符串
    //     let csvContent = '';
    
    //     // 添加标题行（从 columns 获取列标题）
    //     const headers = columns.map(column => `"${column.title}"`).join(",");
    //     csvContent += headers + "\r\n";
    
    //     // 添加数据行（根据 columns 的 dataIndex 来获取值）
    //     dataToExport.forEach(item => {
    //         const row = columns.map(column => {
    //             const value = item[column.dataIndex];
    //             return `"${value}"`; // 用引号包裹，以便正确处理包含逗号或换行符的数据
    //         }).join(",");
    //         csvContent += row + "\r\n";
    //     });
    
    //     // UTF-8 编码的字节顺序标记 (BOM)
    //     const BOM = "\uFEFF";
    
    //     // 创建 Blob 对象
    //     const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    //     const href = URL.createObjectURL(blob);
    
    //     // 创建下载链接并点击
    //     const link = document.createElement('a');
    //     link.href = href;
    //     link.download = this.props.currentPanel+'_export.csv';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };
    
    handleExport = () => {
        const { externalDataSource, columns, currentPanel } = this.props;
        const { selectedRowKeys } = this.state;
      
        // 如果没有选中的行，则不执行导出
        if (selectedRowKeys.length === 0) {
          alert("没有可导出的数据");
          return;
        }
      
        // 准备 CSV 内容
        let csvContent = "data:text/csv;charset=utf-8,";
      
        // 添加标题行
        const headers = columns.map(col => `"${col.title}"`).join(",");
        csvContent += headers + "\r\n";
      
        // 定义一个递归函数来处理每行数据的导出
        const processRow = (row: { [x: string]: any; key: React.Key; children: any[]; }, isChild = false) => {
          if (selectedRowKeys.includes(row.key) || isChild) {
            const rowData = columns.map(col => {
              let value = row[col.dataIndex];
              // 处理需要特殊格式化的数据，例如时间戳
              if (col.dataIndex === "scanTime") {
                value = convertUnixTime(value); // 假设 convertUnixTime 是一个转换时间戳的函数
              }
              return `"${value}"`; // 确保数据中的逗号不会干扰 CSV 格式
            }).join(",");
            csvContent += rowData + "\r\n";
          }
          // 如果当前行有子行，递归处理
          if (row.children) {
            row.children.forEach(childRow => processRow(childRow, true));
          }
        };
      
        // 遍历数据源，并处理每行数据
        externalDataSource.forEach(row => processRow(row));
      
        // 编码 URI 并创建下载链接
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", currentPanel+"_exported_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      
    handleDeleteSelected = () => {
        // 重置选中的行
        this.setState({ selectedRowKeys: [] });
    };



    render() {       
          // 构建无数据时的展示配置
            const customLocale = {
                emptyText: '没有数据'
            }; 
        const rowSelection1 = {//checkbox勾选状态独立
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
            // 更新 selectedRowKeys 状态以包括父行和子行的键值
            this.setState({ selectedRowKeys });
            },
            // 如果需要，可以在这里添加 getCheckboxProps 来定制每一行复选框的行为
        };
  
          
        const data = this.props.externalDataSource.map(item => {
            // 时间转换
            if (this.props.timeColumnIndex) {
                this.props.timeColumnIndex.forEach(column => {
                    if (item[column]) {
                        item[column] = convertUnixTime(parseFloat(item[column]));
                    }
                });
            };
            return item;
        })

        const compStyle_normal={
            //opacity: isButtonDisabled ? 0.5 : 1,
        }

        const selectedcompStyle = compStyle_normal;

        const selectedTableStyle = 'customTable';

        const isButtonDisabled = this.props.externalDataSource.length === 0 
                    || this.state.selectedRowKeys.length === 0;




        return (//Table的宽度被设置为1330px
        <div style={{ fontFamily: "'YouYuan', sans-serif", fontWeight: 'bold', }}>
            <Row gutter={[12, 6]} style={{ marginTop: '-10px'}}>
                <Col
                    md={this.props.currentPanel === 'applications1' ? 20 : 24}
                    style={{
                        paddingLeft: this.props.currentPanel === 'applications1' ? '12px' : '0px',
                    }}
                >
                    <Card bordered={false} bodyStyle={{ padding: '4px' }}>
                        {!simplifiedTablePanel.includes(this.props.currentPanel) && (
                        <div style={{ marginBottom: '16px' }}>
                            <Row gutter={[2,2]} >
                                <Col flex="none">
                                    <Link to="/app/create_agent_task" target="_blank">
                                        <Button 
                                        style={{...selectedcompStyle,
                                            backgroundColor:'#1664FF',color:'white',marginRight:'10px',}}
                                        >
                                            新增任务
                                        </Button>
                                    </Link>
                                    <Button
                                        style={{...selectedcompStyle,marginRight:'10px',
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleExport}
                                        disabled={isButtonDisabled}
                                    >
                                        批量导出
                                    </Button>
                                    {/* <Button 
                                        style={{...selectedcompStyle,}}>
                                    采集最新数据
                                    </Button> */}
                                </Col>
                                <Col flex="auto" style={{ textAlign: 'left', marginLeft:10,marginTop:'5px',}}>
                                    <span>最近更新時間: {this.state.lastUpdated ? this.state.lastUpdated : '-'}</span>
                                </Col>
                            </Row>
                        </div>)}
                        <Table
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
                        />
                    </Card>
                </Col>
            </Row>
        </div>
        );
    }
}

export default DataDisplayTable;
