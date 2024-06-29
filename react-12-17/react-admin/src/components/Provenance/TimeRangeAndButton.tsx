// 把时间范围选择器和确定按钮绑定的父组件
import React, { useState } from 'react';
import TimeRangeSelector from './TimeRange';
import UpdateButton from './LongButton';


function TimeRangeAndButton() {
  const [time_range, setTimeRange] = useState({ standard_time_range: null, simplified_time_range: null });

  const handleTimeChange = (standard_time_range:any, simplified_time_range:any) => {
    setTimeRange({ standard_time_range, simplified_time_range });
  };

  return (
    <div>
      <TimeRangeSelector on_time_change={handleTimeChange} />
      <UpdateButton time_range={time_range} buttonText="更新溯源图时间范围" />
    </div>
  );
}

export default TimeRangeAndButton;
