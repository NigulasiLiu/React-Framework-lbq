// HostAlertList.tsx
import React from 'react';
import { Menu, Row, Col, Card, Statistic, Typography, Button, Progress } from 'antd';

import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import { baselineDetectColumns, virusscandetailscolumns } from '../Columns';
import DataDisplayTable from '../OWLTable/DataDisplayTable';
import { APP_Server_URL } from '../../service/config';


const { Text } = Typography;
interface StatusItem {
  color: string;
  label: string;
  value: number;
}

interface StatusPanelProps {
  statusData: StatusItem[];
  orientation: 'vertical' | 'horizontal'; // 添加方向属性
}
const StatusPanel: React.FC<StatusPanelProps> = ({ statusData, orientation }) => {
  const containerStyle: React.CSSProperties = {
    //border:'5px solid black',
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

interface VirusScanDetailsPageProps {

}
interface VirusScanDetailsPageStates {
  activeIndex: any;
  currentPanel: string;
}


//扇形图数据
const successed: StatusItem[] = [
  { label: '运行成功', value: 1, color: '#00AB2B' },
];

const failed: StatusItem[] = [
  { label: '运行失败', value: 0, color: 'red' },
];



const data = {
  '任务id': '395ba454ae35',
  '主机数': '1',
  '资源占用上限': '最大占用的空闲cpu',
  '更新时间': '最近一次扫描时间',
  '任务类型': '快速扫描/全盘扫描',
  '创建者': 'admin',
  '任务超时时长': '扫描时间超过x, 结束扫描',
  '创建时间': '创建时间',
  // ... any other data fields
};

class VirusScanDetailsPage extends React.Component<VirusScanDetailsPageProps, VirusScanDetailsPageStates> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeIndex: [-1, -1, -1, -1],
      currentPanel: 'checkedItem',
    };
  }


  render() {
    // 定义或从外部获取API端点
    const apiEndpoint = APP_Server_URL+"/api/files/BaseLineDetectDetails";
    const finished = 3;
    const total = 5;

    const percent = 100 * finished / total;
    return (
      <div style={{
        // fontFamily: "'YouYuan', sans-serif",
        // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
        fontWeight: 'bold', width: '90%', margin: '0 auto' }}>
        <BreadcrumbCustom />
        {/* <Button
                        type="link"
                        style={{width:'50px',height:'50px',border:'false'}}
                        icon={<LeftOutlined />}
                        onClick={() => {
                            window.close();
                          }}
                        /> */}
        <Row gutter={[8, 16]} >
          <Card bordered={false}
            style={{ fontWeight: 'bolder', width: '100%', minHeight: 200, backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 0, fontWeight: 'bold' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>基础信息</h2>
            </div>
            <Row gutter={[6, 6]}>
              <Col className="gutter-row" md={24}>
                <Card bordered={false} style={{
                  // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                }}
                >
                  <Row gutter={16}>
                    {Object.entries(data).map(([key, value], index) => (
                      <Col key={index} span={6} style={{ fontSize: '15px', marginBottom: '10px' }}>
                        <Text style={{ color: '#686E7A' }} strong>{key}:</Text> <Text>{value}</Text>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row gutter={[8, 16]}>
          <Card bordered={false}
            style={{ fontWeight: 'bolder', width: '100%', backgroundColor: '#ffffff' }}>
            <Row >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 'bold' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '0px' }}>任务详情</h2>
              </div>
            </Row>
            <Row>
              <Col md={2} />
              <Col md={9}>
                <Card style={{ borderTop: 'solid 4px #00AB2B' }}>
                  <Row>
                    <Col md={5} >
                      <Statistic title={<span>运行进度</span>} value='100%' />
                    </Col>
                    <Col md={1} />
                    <Col md={10} style={{ alignContent: 'center', justifyContent: 'center' }} >
                      <Progress percent={percent} strokeColor="#00AB2B" showInfo={true} />
                    </Col>

                    <Col md={2} />
                    <Col md={6}>
                      <StatusPanel statusData={successed} orientation="horizontal" />
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col md={2} />
              <Col md={9}>
                <Card style={{ borderTop: 'solid 4px red' }}>
                  <Row>
                    <Col md={5}>
                      <Statistic title={<span>失败数量</span>} value='100%' />
                    </Col>
                    <Col md={13} />
                    <Col md={6}>
                      <StatusPanel statusData={failed} orientation="horizontal" />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col md={2} />
            </Row>
            <Row style={{ marginTop: '20px' }}>
            </Row>
          </Card>
        </Row>
      </div>
    );
  }
}

export default VirusScanDetailsPage;
