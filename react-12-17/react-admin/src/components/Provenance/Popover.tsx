import React, { useState, useEffect } from 'react';
import { Button, Popover } from 'antd';
import './provenance.css';
import axios from 'axios';
import { Provenance_Get_Alert_API } from '../../service/config';


const App: React.FC = () => {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(Provenance_Get_Alert_API);
        setAlerts(response.data.alerts); // 后端返回告警信息数组
      } catch (error) {
        console.error('获取告警信息失败', error);
      }
    };
    fetchAlerts();
    // 设置定时器每隔一段时间获取告警信息，例如每60秒
    const intervalId = setInterval(fetchAlerts, 60000);
    // 清除定时器
    return () => clearInterval(intervalId);
  }, []);

  // 动态创建Popover内容
  let content;
  let length = 0;
  try {
    content = (
      <div>
        {alerts.map((alert, index) => (
          <p key={index}>{alert}</p> // 假设alert是字符串
        ))}
      </div>
    );
    length = alerts.length;
  } catch (error) {
    content = (
      <div>
      </div>
    )
    length = 0;
  }
  

  return (
    <Popover content={content} title="告警信息">
      <Button type="primary" className={`popover-button ${length > 0 ? 'alert' : 'no-alert'}`}>
        告警信息 {length}条
      </Button>
      
    </Popover>
  );
};

export default App;
