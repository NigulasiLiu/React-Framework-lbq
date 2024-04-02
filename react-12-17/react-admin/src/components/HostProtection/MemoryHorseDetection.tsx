import React from 'react';
import {Col,Row,Card} from 'antd';
class MemoryHorseDetection extends React.Component {
  // State 和方法可以根据实际需求定义
  
  render() {
    // 此处添加内存马检测页面的实现细节
    return (
      <div style={{ fontFamily: "'YouYuan', sans-serif",fontWeight: 'bold'}}>
        <span>内存马检测</span>
        <Row gutter={[12, 6]} style={{ marginTop: '10px' }}>

            <Col md={24}>
                <div className="gutter-box">
                <Card bordered={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 ,fontWeight: 'bold'}}>
                        <h2 style={{ fontSize:'18px',fontWeight: 'bold', marginLeft: '0px' }}>内存马捕获</h2>
                    </div>
                    </Card>
                </div>
            </Col>
        </Row>
      </div>
    );
  }
}

export default MemoryHorseDetection;
