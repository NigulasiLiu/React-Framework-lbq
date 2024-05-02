import React from 'react';
import {Col,Row,Card, Input, Button, Tooltip} from 'antd';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { constRenderTable } from '../tableUtils';
class MemoryHorseDetection extends React.Component {
  // State 和方法可以根据实际需求定义
  MemoryHorseColumns = [
    {
        title: "ID",
        dataIndex: 'id',
        key: 'id',
        Maxwidth: '15px',
        // render:(text:string)=>(
        //     <Button className="custom-button">{text}</Button>
        // ),
    },
    {
        title: "主机名称",
        dataIndex: 'uuid',
        key: 'uuid',
        // onFilter: (values: string, record: any) => record.uuid.includes(values) || record.ip_address.toLowerCase().includes(values.toLowerCase()),
        // filterDropdown: ({
        //     setSelectedKeys,
        //     selectedKeys,
        //     confirm,
        //     clearFilters,
        // }: FilterDropdownProps) => (
        //     <div style={{ padding: 8 }}>
        //         <Input
        //             autoFocus
        //             placeholder="搜索主机名称或IP..."
        //             value={selectedKeys[0]}
        //             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //             onPressEnter={() => confirm()}
        //             style={{ width: 188, marginBottom: 8, display: 'block' }}
        //         />
        //         <Button
        //             onClick={() => confirm()}
        //             size="small"
        //             style={{ width: 90, marginRight: 8, backgroundColor: '#1664FF', color: 'white' }}
        //         >
        //             搜索
        //         </Button>
        //         <Button disabled={clearFilters === undefined} onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
        //             重置
        //         </Button>
        //     </div>
        // ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        render: (text: string, record: any) => (
            <div>
                <div>
                    <Link to={`/app/detailspage?uuid=${encodeURIComponent(record.uuid)}`} target="_blank">
                        <Button style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#4086FF', padding: '0 0' }}>
                            {record.uuid.slice(0, 5)}
                        </Button>
                    </Link>
                </div>
            </div>
        ),
    },
    {
        title: "告警时间",
        dataIndex: 'alert_time',
        render: (text: string) => moment.unix(parseInt(text)).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a: any, b: any) => Date.parse(b.alert_time) - Date.parse(a.alert_time),
    },
    {
        title: "内存马内容",
        dataIndex: 'mem_content',
        render: (text: string, record: any) => (
            <Tooltip title={record.mem_content}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {record.mem_content}
                </div>
            </Tooltip>
        ),
    },
];
  render() {
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
              const { memHorseOriginData} = context;
              // 将函数绑定到类组件的实例上

              return (
                <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
                  <span>内存马检测</span>
                  <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>
          
                      <Col md={24}>
                      {constRenderTable(memHorseOriginData, '内存马捕获', ['alert_time'], 
                      this.MemoryHorseColumns, 'memHorseList',"http://localhost:5000/api/memHorse/all")}
                      </Col>
                  </Row>
                </div>
              );
          }}
      </DataContext.Consumer>
  )
  }
}

export default MemoryHorseDetection;
