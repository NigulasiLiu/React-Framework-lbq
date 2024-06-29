// 时间范围选择器
import { DatePicker, Space } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import LocaleProvider from 'antd/lib/locale-provider';
import React from 'react';
import zh_CN from 'antd/es/locale/zh_CN'; // 导入中文语言包
import 'moment/locale/zh-cn'; // 导入 moment 的中文语言包
import './provenance.css'


const { RangePicker } = DatePicker;

interface TimeRangeProps {
  on_time_change: (dates: RangePickerProps['value'], dateStrings: [string, string]) => void;
}

const App: React.FC<TimeRangeProps> = ({ on_time_change }) => (
  <LocaleProvider locale={zh_CN} >
    <Space direction="vertical" size={12} className="time_range">
      <RangePicker
        placeholder={['溯源起始时间', '溯源终止时间']}
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        onChange={on_time_change}        
      />
    </Space>
  </LocaleProvider>
);

export default App;