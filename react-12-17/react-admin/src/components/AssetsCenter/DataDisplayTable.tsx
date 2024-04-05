import React, {useState} from 'react';
import { Table, Button, Input, Card, Col, DatePicker, Row, Select, Form, Modal } from 'antd';
import moment, { Moment } from 'moment';
import { buildRangeQueryParams} from './DataService';
import { simplifiedTablePanel } from '../tableUtils';

const { Option } = Select;

type RangeValue<T> = [T | null, T | null] | null;
const { RangePicker } = DatePicker;
interface GenericDataItem {
    [key: string]: any;
}

interface DataDisplayTableProps {
    externalDataSource: any[];
    columns: any[]; // 根据实际列数据结构定义更明确的类型
    timeColumnIndex?: string[];//用于标记'时间'类型的字段，被标记的字段需要从unix时间转换为便于阅读的格式
    // 可以根据需要添加其他 props，比如分页大小等
    currentPanel: string;

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
const { TextArea } = Input;


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




  resetDataSourceChanged() {
    this.setState({ dataSourceChanged: false });
  }
    
    onSelectChange = (selectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys });

    };


    handleExport = () => {
        const { externalDataSource, columns } = this.props;

        // 如果没有选中的行或者当前面板的 dataSource 为空，则不执行导出
        if (this.state.selectedRowKeys.length === 0 || externalDataSource.length === 0) {
            alert('没有可导出的数据');
            return;
        }
    
        // 筛选出要导出的数据
        const dataToExport = externalDataSource.filter((item) => this.state.selectedRowKeys.includes(item.id));
    
        // 创建 CSV 字符串
        let csvContent = '';
    
        // 添加标题行（从 columns 获取列标题）
        const headers = columns.map(column => `"${column.title}"`).join(",");
        csvContent += headers + "\r\n";
    
        // 添加数据行（根据 columns 的 dataIndex 来获取值）
        dataToExport.forEach(item => {
            const row = columns.map(column => {
                const value = item[column.dataIndex];
                return `"${value}"`; // 用引号包裹，以便正确处理包含逗号或换行符的数据
            }).join(",");
            csvContent += row + "\r\n";
        });
    
        // UTF-8 编码的字节顺序标记 (BOM)
        const BOM = "\uFEFF";
    
        // 创建 Blob 对象
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const href = URL.createObjectURL(blob);
    
        // 创建下载链接并点击
        const link = document.createElement('a');
        link.href = href;
        link.download = 'export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    handleDeleteSelected = () => {
        // 重置选中的行
        this.setState({ selectedRowKeys: [] });
    };
    // onDateRangeChange = (dates: RangeValue<Moment>, dateStrings: [string, string]) => {
    //     if (dates) {
    //         const [start, end] = dateStrings;
    //         this.setState({ selectedDateRange: [start, end] });
    
    //         const { timeColumnIndex } = this.props;
    //         if (timeColumnIndex) {
    //             // 转换日期为 Unix 时间戳（秒）
    //             const startDateTimestamp = moment(start).unix();
    //             const endDateTimestamp = moment(end).unix();
                
    //             const selectedqueryParams = buildRangeQueryParams(startDateTimestamp.toString(), endDateTimestamp.toString(), timeColumnIndex[0]);
    //                         this.setState({
    //             dataSourceChanged: true, // 更新状态以避免重复执行
    //           });
    //             this.props.onUpdateRangeField(selectedqueryParams);

    //             this.setState({
    //                 dataSourceChanged: true, // 更新状态以避免重复执行
    //               });

    //             this.setState({ selectrangequeryParams: selectedqueryParams }, () => {
    //                 // 在状态更新后立即触发数据获取
    //                 this.props.fetchLatestData(this.props.apiEndpoint,'', '', selectedqueryParams);
    //             });
    //         }
    //     } else {
    //         this.setState({
    //             dataSourceChanged: true, // 更新状态以避免重复执行
    //           });
    //         this.setState({ selectedDateRange: [null, null], selectrangequeryParams: '' }, () => {
    //             // 当日期范围被清空时，重置数据
    //             this.props.fetchLatestData(this.props.apiEndpoint,'all', '', '');
    //         });
    //     }
    // };
    


      showModal = () => {
          this.setState({
            showModal: true,
          });
      };
      toggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
        }));
    };

      handleFormCharaterFieldChange = (value:string) => {
        this.setState({
            user_character: value,
          });
      };
        handleOk = () => {
          this.setState({
            showModal: false,
          });
          // 这里处理确认操作
        };
      
        handleCancel = () => {
          this.setState({
            showModal: false,
          });
        };
        formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 14 },
            },
          };


        renderModal = () => {
          return (
            <>
            {/* <Button type="primary" onClick={this.showModal}>
              新建 SHA256 任务
            </Button> */}
            <Modal
            style={{fontWeight:'bolder'}}
              title="新增用户"
              visible={this.state.showModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button style={{backgroundColor:'white',color:'black'}} key="back" onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button style={{backgroundColor:'#1664FF',color:'white'}} key="submit" type="primary" onClick={this.handleOk}>
                  提交任务
                </Button>,
              ]}
            >
                <Form {...this.formItemLayout}
                    name="new_user_info"
                >
                    <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '用户名支持中英文和数字，不少于四个字符' }]}
                    >
                    <Input placeholder="用户名支持中英文和数字，不少于四个字符" />
                    </Form.Item>
                    <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '密码长度不少于4个字符' }]}
                    >
                    <Input placeholder="密码长度不少于4个字符" />
                    </Form.Item>
                    <Form.Item
                    label="确认密码"
                    name="password"
                    rules={[{ required: true, message: '请再次输入密码' }]}
                    >
                    <Input placeholder="请再次输入密码" />
                    </Form.Item>
                    <Form.Item
                    label="用户角色"
                    name="cycle"
                    rules={[{ required: true, message: '请选择用户角色' }]}
                    >
                    <Select placeholder="用户角色" defaultValue="admin" onChange={this.handleFormCharaterFieldChange}>
                        <Option value="admin">管理员</Option>
                        <Option value="user">普通用户</Option>
                        {/* 更多选项... */}
                    </Select>
                    </Form.Item>
                    
                    {this.state.user_character === 'admin' && (
                    <>
                    <Form.Item label="说明"
                    name="description">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 拥有全部功能的读写权限
                        </p>
                    </Form.Item>
                    <Form.Item label="用户权限"
                    name="auth">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 读写
                        </p>
                    </Form.Item>
                    </>)}
                    {this.state.user_character === 'user' && (
                    <>
                    <Form.Item label="说明"
                    name="description">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 拥有全部功能的只读权限
                        </p>
                    </Form.Item>
                    <Form.Item label="用户权限"
                    name="auth">
                        <p style={{margin: '0px auto' ,
                            display: 'flex',
                            //justifyContent: 'center', // 水平居中
                            alignItems: 'center', // 垂直居中
                        }}> 只读
                        </p>
                    </Form.Item>
                    </>)}
                </Form>
            </Modal>
          </>
          );
        };

    render() {       
          // 构建无数据时的展示配置
            const customLocale = {
                emptyText: '没有数据'
            }; 
        const rowSelection = {//checkbox勾选状态独立
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const {externalDataSource} = this.props;
        

        const compStyle_small={
            textAlign: 'center',
            maxwidth: '90px',
            height: '30px',
            // 由于按钮高度较小，可能需要调整字体大小或内边距来改善显示
            fontSize: '12px', // 根据需要调整字体大小
            //borderRadius: '4px', // 如果您想要圆角边框
            
        }

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
                                    <Button
                                        style={{...selectedcompStyle,marginRight:'10px',
                                            opacity: isButtonDisabled ? 0.5 : 1 }}
                                        onClick={this.handleExport}
                                        disabled={isButtonDisabled}
                                    >
                                        批量导出
                                    </Button>
                                    <Button 
                                        style={{...selectedcompStyle,}}>
                                    采集最新数据
                                    </Button>
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
                            dataSource={externalDataSource}
                            columns={this.props.columns}
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
