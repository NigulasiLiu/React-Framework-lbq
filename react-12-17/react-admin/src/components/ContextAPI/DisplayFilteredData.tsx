import React, { Component } from 'react';
import { Card, Typography,Col } from 'antd';
import { FilteredDataResult_new } from './useFilterOriginData_new';

const { Text, Title } = Typography;

// interface FilteredDataResult {
//   id: number;
//   ip: string;
//   port: string;
//   scanTime: string;
//   scanType: string;
//   vul_detection_exp_result: {
//     bug_exp: string;
//     id: number;
//     ip: string;
//     scanTime: string;
//   };
//   vul_detection_finger_result: {
//     finger: string;
//     id: number;
//     ip: string;
//     scanTime: string;
//     url: string;
//   };
//   vul_detection_poc_result: {
//     bug_poc: string;
//     id: number;
//     ip: string;
//     scanTime: string;
//     url: string;
//   };
// }

interface Props {
  filterData: Map<string, FilteredDataResult_new[]>;
}

interface State {}

class FilteredDataDisplay extends Component<Props, State> {
  renderData() {
    const { filterData } = this.props;

    return Array.from(filterData.entries()).map(([key, data], index) => (
      <Card key={index} style={{ marginBottom: 20 }}>
        <Title level={4}>Key: {key}</Title>
        {data.map((item, itemIndex) => (
          <div key={itemIndex}>
            <Col>
            <Text>IP: {item.ip} </Text>
            <Text>ID: {item.id} </Text>
            <Text>PORT: {item.port} </Text>
            <Text>SCANTIME: {item.scanTime} </Text>
            <Text>SCANTYPE: {item.scanType} </Text>
            <Text>Exploit11: {item.vul_detection_exp_result_bug_exp?item.vul_detection_exp_result_bug_exp:item.id}</Text>
            </Col>
            <br />
          </div>
        ))}
      </Card>
    ));
  }

  render() {
    return (
      <div>
        <Title level={2}>Filtered Data Overview</Title>
        {this.renderData()}
      </div>
    );
  }
}

export default FilteredDataDisplay;
