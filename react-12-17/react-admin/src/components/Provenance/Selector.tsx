// 选择主机
import { Select, Tooltip } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Provenance_Get_Host_UUID_API, Provenance_Select_Host_API } from '../../service/config';


const onChange = (value: string) => {
  console.log(`selected ${value}`);
  axios.post(Provenance_Select_Host_API, {
    selected_host: value,
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

interface SelectOption {
  label: React.ReactNode; // 修改label的类型
  value: string;
}

const App: React.FC = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []); // 空依赖数组意味着这个effect仅在组件挂载时运行一次

  const fetchData = async () => {
    try {
      const result = await axios.get(Provenance_Get_Host_UUID_API);
      const agent_info = JSON.parse(result.data.agent_info);
      const formattedData = agent_info.map((item: any) => ({
        label: (
          <Tooltip title={item.uuid}>
            {`${item.host_name} (${item.ip_address})`}
          </Tooltip>
        ),
        value: item.uuid,
      }));
      console.log("set options");
      console.log(formattedData);
      setOptions(formattedData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Select
      className='selector'
      showSearch
      placeholder="选择要监控的主机"
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      filterOption={(input, option) =>
        ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />
  );
};

export default App;
