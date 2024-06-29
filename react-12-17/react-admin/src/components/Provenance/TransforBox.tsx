// 节点过滤/边过滤配置器
import { Transfer } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import React, { useEffect, useState } from 'react';
import LocaleProvider from 'antd/lib/locale-provider';
import zh_CN from 'antd/es/locale/zh_CN'; // 导入中文语言包
import 'moment/locale/zh-cn'; // 导入 moment 的中文语言包
import axios from 'axios';
import { Provenance_Get_Filter_API, Provenance_Update_Filter_API } from '../../service/config';


interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

interface ApiResponse {
  vertex_data: RecordType[];
  edge_data: RecordType[];
}

interface DataProps {
  useVertexData: boolean; // 标志，true 使用数据1，false 使用数据2
}

const App: React.FC<DataProps> = ({useVertexData}) => {
  const [TypeData, setTypeData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const getData = async () => {
    try {
      const response = await axios.get<ApiResponse>(Provenance_Get_Filter_API);
      console.log(response)
      const Data = useVertexData ? response.data['vertex_data'] : response.data['edge_data'];
      const newTypeData:any = [];
      const newTargetKeys:any = [];
  
      Data.forEach(data => {
        if (data.chosen) {
          newTargetKeys.push(data.key);
        }
        newTypeData.push(data);
      });
      setTypeData(newTypeData);
      setTargetKeys(newTargetKeys);
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [useVertexData]);

  const filterOption = (inputValue: string, option: any) =>
    option.description?.indexOf(inputValue) > -1;

  const handleSubmit = async (useVertexData: boolean, newTargetKeys: string[]) => {
      try {
        const response = await axios.post(Provenance_Update_Filter_API, {
          useVertexData, newTargetKeys
        });
        console.log(response.data);
        // 处理响应
      } catch (error) {
        console.error('Error submitting:', error);
        // 处理错误
      }
  };
  
  const handleChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
    console.log(newTargetKeys);
    handleSubmit(useVertexData, newTargetKeys);
  };

  const handleSearch = async (dir: TransferDirection, value: string) => {
    console.log('search:', dir, value);
  };

  let titles;
  if (useVertexData) {
      titles = ['过滤节点类型', '保留节点类型'];
  } else {
      titles = ['过滤边类型', '保留边类型'];
  }
  
  return (
    <LocaleProvider locale={zh_CN}>
      <Transfer
        dataSource={TypeData}
        showSearch
        titles={titles}
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        render={item => item.title || ''}

        // filterOption={(inputValue, item) =>
        //   item.title.indexOf(inputValue) !== -1
        // }
        // searchProps={{
        //   placeholder: '自定义搜索文字', // 为搜索框设置占位符
        // }}
      />
    </LocaleProvider>
    
  );
};

export default App;