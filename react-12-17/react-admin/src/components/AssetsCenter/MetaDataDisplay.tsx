// MetaDataDisplay.tsx
import React, { Component } from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { MetaDataResult } from '../ContextAPI/ExtractOriginData';

const { Title, Text } = Typography;

type Props = {
  metadata: MetaDataResult;
};

class MetaDataDisplay extends Component<Props> {
  render() {
    const { metadata } = this.props;

    return (
      <div style={{ margin: '20px' }}>
        <Card bordered={false}>
          <Title level={4}>Metadata Overview</Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Text strong>Total Count: </Text>
              <Text>{metadata.tupleCount}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Type Counts:</Text>
              <Card>
                {Array.from(metadata.typeCount.entries()).map(([typeName, count], index) => (
                  <Text key={index} >
                    {typeName}: {count};
                  </Text>
                ))}
              </Card>
            </Col>
            <Col span={24}>
              <Text strong>Details:</Text>
              {Array.from(metadata.details.entries()).map(([typeName, detailCounts], index) => (
                <Card key={index} style={{ marginTop: '10px' }}>
                  <Title level={5}>{typeName}</Title>
                  {Array.from(detailCounts.entries()).map(([valueName, count], detailIndex) => (
                    <Text key={detailIndex} >
                      {valueName}: {count}
                    </Text>
                  ))}
                </Card>
              ))}
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default MetaDataDisplay;
