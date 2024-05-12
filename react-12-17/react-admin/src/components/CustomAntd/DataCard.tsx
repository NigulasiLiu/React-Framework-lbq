import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';




// 定义每个统计数字项的类型
// interface AdditionalStatisticItem {
//     value: number | string;
//     backgroundColor: string; // Use backgroundColor to avoid naming conflicts with CSS properties
//   }
interface ValueItem {
  value: string | number;
  backgroundColor?: string; // 背景颜色
  fontSize?: string;// 字体大小
  color?: string;// 字体颜色
}


interface CustomValueStatisticProps {
  title: string;
  value: number | string;
  values: ValueItem[];
}

interface DataCardProps extends RouteComponentProps {
  title: string;
  value: number | string;
  panelId: string;
  height?: string;
  width?: string;
  backgroundColor?: string;
  valueItem?: ValueItem[];
  //additionalStatistics?: AdditionalStatisticItem[]; 
  onPanelClick?: (panel: string) => void;
  navigate?: boolean; // Optional flag to determine the mode of operation

  showTopBorder?: boolean;
  showBottomBorder?: boolean;
  showLeftBorder?: boolean;
  showRightBorder?: boolean;

}

// Define an interface for the component's props
interface DataCardProps {
  title: string;
  value: number | string;
  panelId: string;
  height?: string;
  width?: string;
  backgroundColor?: string;
  //statisticColor?: string; // 新增用于统计数字背景颜色的props
  onPanelClick?: (panel: string) => void; // Optional prop function
}


const CustomValueStatistic: React.FC<CustomValueStatisticProps> = ({ title, value, values }) => {
  return (
    <Statistic
      title={<span>{title}</span>}
      valueRender={() => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: 18 }}>{value}</div>
          {values.map((item: ValueItem, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: item.backgroundColor,
                color: item.color,
                fontSize: item.fontSize,
                borderRadius: '3px', // 设置圆角大小
                padding: '3px 7px', // 根据需要调整内边距以适应内容

                marginRight: 5,
              }}>
              {item.value}
            </div>
          ))}
        </div>
      )}
    />
  );
};


class DataCard extends React.Component<DataCardProps> { // Use the interface here

  goToPanel = (panel: string) => {
    if (!this.props.navigate) {
      // Call the provided function if navigate is not true
      this.props.onPanelClick?.(panel);
    }
  };

  handlePanelClick = (route: string) => {
    if (this.props.navigate) {
      // Use the history prop to navigate if navigate is true
      this.props.history.push(route);
    }
  };
  render() {
    // Destructure props for easy access
    const { title, value,
      panelId, navigate,
      height, width, backgroundColor, valueItem,
      showTopBorder, showBottomBorder, showLeftBorder, showRightBorder } = this.props;

    // 计算边缘线的样式
    const borderStyle = {
      borderTop: showTopBorder ? '2px solid #F6F7FB' : 'none',
      borderBottom: showBottomBorder ? '2px solid #F6F7FB' : 'none',
      borderLeft: showLeftBorder ? '2px solid #F6F7FB' : 'none',
      borderRight: showRightBorder ? '2px solid #F6F7FB' : 'none',
    };
    // Dynamic styles based on props
    const cardStyle = {
      height: height || '75px',
      width: width || '110px',
      minWidth: width,
      maxWidth: width,
      minHeight: 75,
      maxHeight: height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: backgroundColor || '#F6F7FB',
      borderRadius: '3px', // 设置圆角大小
      padding: '3px 7px', // 根据需要调整内边距以适应内容
      ...borderStyle, // 添加边缘线样式
    };
    return (
      <Card style={cardStyle}>
        <Row justify="space-between" align="middle">
          <Col span={navigate?22:24} style={{marginLeft:'0px',textAlign: 'left',}}>
            <CustomValueStatistic
              title={title}
              value={value}
              values={valueItem || []}
            />
          </Col>
          <Col span={navigate?1:0}/>
          {navigate&&(
              <Col span={1} style={{ marginRight:'0px',textAlign: 'right',position: 'relative', top: '-20px', left: '-5px', }}>
                <Button
                    style={{ fontWeight: 'bold', border: 'transparent', backgroundColor: 'transparent', color: '#88878C' }}
                    icon={<RightOutlined />}
                    onClick={() => navigate ? this.handlePanelClick(panelId) : this.goToPanel(panelId)}
                />
                {/* <div style={{ display: 'flex' }}>
              {additionalStatistics && additionalStatistics.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: item.backgroundColor,
                  // Removed borderRadius to make it square
                  width: '25px',  // Square width
                  height: '16px', // Square height
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginLeft: '10px', // Add space between items
                }}>
                  {item.value}
                </div>
              ))}
            </div> */}
              </Col>)}
        </Row>
      </Card>
    );
  }
}

export default withRouter(DataCard);

