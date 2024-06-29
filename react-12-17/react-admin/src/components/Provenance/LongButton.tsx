// 更新时间范围按钮
import { Button } from 'antd';
import React from 'react';
import './provenance.css'
import axios from 'axios';
import { Provenance_Update_Time_Range_API } from '../../service/config'

interface UpdateButtonProps {
  buttonText:string
  time_range: {
    standard_time_range: string | null;
    simplified_time_range: string | null;
  };
}

const App: React.FC<UpdateButtonProps> = ({ time_range, buttonText }) => {
  const handleClick = async () => {
    console.log('更新时间范围');
    console.log(`标准时间范围: ${time_range.standard_time_range}, 简化时间范围: ${time_range.simplified_time_range}`);

    try {
      const response = await axios.post(Provenance_Update_Time_Range_API, {
        standard_time_range: time_range.standard_time_range,
        simplified_time_range: time_range.simplified_time_range,
      });
      console.log(response.data);
      // 处理响应
    } catch (error) {
      console.error('Error submitting:', error);
      // 处理错误
    }
  };

  return (
    <>
      <Button onClick={handleClick} block className="long-custom-button">
        {buttonText}
      </Button>
    </>
  );
};

export default App;