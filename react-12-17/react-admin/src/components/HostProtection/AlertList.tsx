import React from 'react';
import { Statistic, Row, Col, Card, Button, Menu } from 'antd';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
type AlertListProps = {
    apiEndpoint:string;
    columns:any[];
    currentPanel:string;
};
type AlertListState = {
    dataSource: any[];
    count: number;
    deleteIndex: number | null;

    selectedRowKeys: React.Key[];
    selectedDateRange: [string | null, string | null];
    activeIndex: any;
    areRowsSelected: boolean;
};

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


class AlertList extends React.Component<AlertListProps, AlertListState> {
    constructor(props: any) {
        super(props);
        this.columns = [];
        this.state = {
            dataSource: [
            ],
            count: 2,
            deleteIndex: -1,
            activeIndex: [-1, -1, -1, -1], // 假设有4个扇形图
            selectedRowKeys: [], // 这里用来存储勾选的行的 key 值
            areRowsSelected: false,
            selectedDateRange: [null,null]
        };
    }
    columns: any;
    render() {
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const {
                        hostCount,
                        HoneyPotHostCount,
                        TTPsHostCount, vulnOriginData,
                        VirusHostCount,
                    } = context;

                    // 第二类告警的数据集，'#FEC746','#846CCE','#468DFF',
                    const alertHostPieChartData = [
                        { label: '蜜罐告警', value: HoneyPotHostCount?HoneyPotHostCount:0, color: '#FFBB28' },
                        { label: 'TTPs告警', value: TTPsHostCount?TTPsHostCount:0, color: '#468DFF' },
                        { label: '病毒扫描告警', value: VirusHostCount === 0 ? 40 : VirusHostCount, color: '#846CCE' },
                    ];
                    return (
                        <div style={{
                            // fontFamily: "'YouYuan', sans-serif",
                            // fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                            fontWeight: 'bold' }}>
                            <Col className="gutter-row" md={24}>
                                <Row gutter={[12, 6]} style={{ width: '100%', margin: '0 auto' }}>
                                    <Col className="gutter-row" md={24}>
                                        <Card bordered={false}
                                              style={{fontWeight: 'bolder',marginTop: '10px', height:200}}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                                <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginTop: '0px' }}>告警概览</h2>
                                            </div>
                                            <Row gutter={[6, 6]}>
                                                <Col className="gutter-row" md={10}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            width: '520px',
                                                            minWidth: '150px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB',
                                                        }}
                                                    >
                                                        <Row style={{ width: '100%', }}>
                                                            <Col span={8} style={{transform: 'translateX(-90px) translateY(50px)' }}>
                                                                <Statistic title={<span style={{fontSize:'16px'}}>待处理告警</span>} value={HoneyPotHostCount+TTPsHostCount+40} />
                                                            </Col>
                                                            <Col span={12} style={{ height:'90px',minWidth:'200px',transform: 'translateX(75px) translateY(-20px)'}}>
                                                                <StatusPanel statusData={alertHostPieChartData} orientation="vertical" />
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col className="gutter-row" md={7}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            width: '360px',
                                                            minWidth: '150px', // 最小宽度300px，而非100px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col style={{ marginRight: '250px' }} span={24}>
                                                                <Statistic title={<span>累计处理的告警</span>} value={0} />
                                                            </Col>

                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col className="gutter-row" md={7}>
                                                    <Card
                                                        bordered={false}
                                                        style={{
                                                            height: '100px',
                                                            width: '370px',
                                                            minWidth: '150px', // 最小宽度300px，而非100px
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#F6F7FB', // 设置Card的背景颜色
                                                        }}
                                                    >
                                                        <Row>
                                                            <Col style={{ marginRight: '250px' }} span={24}>
                                                                <Statistic title={<span>白名单规则数</span>} value={0} />
                                                            </Col>

                                                        </Row>
                                                    </Card>
                                                </Col>
                                            </Row>

                                        </Card>
                                    </Col>
                                </Row>
                                <Row gutter={[12, 6]}/*(列间距，行间距)*/ style={{ width: '100%', margin: '0 auto' }}>
                                    <Col md={24}>
                                        <div className="gutter-box">
                                            <Card bordered={false}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                                                    <h2 style={{ fontWeight: 'bold', marginLeft: '0px' }}>告警内容</h2>
                                                    {/*<Button onClick={this.handleAdd} style={{ padding: '5px 15px', fontWeight: 'bold' }} name="del" >添加告警</Button>*/}
                                                </div>
                                                {/*<FetchDataForElkeidTable*/}
                                                {/*    apiEndpoint={this.props.apiEndpoint}*/}
                                                {/*    timeColumnIndex={[]}*/}
                                                {/*    columns={this.props.columns}*/}
                                                {/*    currentPanel={this.props.currentPanel}*/}
                                                {/*/>*/}
                                            </Card>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </div>
                    );
                }}

            </DataContext.Consumer>
        );
    }
}

export default AlertList;
