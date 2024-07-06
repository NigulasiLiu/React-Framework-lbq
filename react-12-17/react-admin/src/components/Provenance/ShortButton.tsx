// 更新节点过滤/边过滤配置按钮，添加监控按钮
import { Button } from 'antd';
import React from 'react';
import './provenance.css'
import axios from 'axios';
import { Provenance_Apply_Filter_API } from '../../service/config';
import { buttonStyle } from './ProvenanceMain';


const App: React.FC<{ buttonText: string }> = ({ buttonText }) => {

  const handleClick = async () => {
    if (buttonText === "节点/边过滤配置修改") {
      try {
        const response = await axios.get(Provenance_Apply_Filter_API);
        console.log(response.data);
        if (response.data.status !== 200) {  // 检查响应状态码
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error submitting:', error);
        // 处理错误
      }
    }
  };
  
  return (
    <>
      <Button onClick={handleClick} block className="short-custom-button"
              {...buttonStyle}>
        {buttonText}
      </Button>
    </>
  );
};

export default App;