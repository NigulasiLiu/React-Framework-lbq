// 被跟踪文件表格

import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState, useEffect } from 'react';
import { Provenance_Get_Track_Info_API, Provenance_Delete_Tracker_API } from '../../service/config'
import axios from 'axios';
import './provenance.css'


const tagColors : { [key: string]: string } = {
  exe: 'magenta',
  file: 'cyan',
  process: 'orange',
};

interface DataType {
  id: string;
  path: string;
  ino: number;
  tags: string[];
}


const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // 状态用于存储表格数据

  useEffect(() => {
    fetchData();
  },[]); // 空依赖数组意味着这个effect仅在组件挂载时运行一次

  const fetchData = async () => {
    try {
      const result = await axios.get(Provenance_Get_Track_Info_API);
      setData(result.data.tracked_info);
      // console.log(result.data.track_info)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (record : any) => {
    try {
      console.log(record)
      const response = await axios.post(Provenance_Delete_Tracker_API, record);
      console.log(response.data)
      if (response.data.status === 200) {
        console.log('删除成功，刷新界面后显示更新');
        alert(response.data.message);
      } else {
        console.error("删除失败\n");
        alert("删除失败\n" + response.data.message);
      }
    } catch (error) {
      console.error('删除请求失败', error);
      alert("删除请求失败");
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      width: 20,
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: text => <a style={{ color: 'black', fontFamily: 'Microsoft YaHei', fontSize: '16px' }}>{text}</a>,
    },
    {
      width: 60,
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
    },
    {
      width: 30,
      title: 'INO/PID',
      dataIndex: 'ino',
      key: 'ino',
      align: 'center',
    },
    {
      width: 30,
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      align: 'center',
      render: (_, { tags }) => (
        <>
          { tags.map((tag) => {
            // 从映射对象中获取标签对应的颜色，如果没有定义，则默认为'geekblue'
            const color = tagColors[tag] || 'geekblue';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      width: 60,
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" style={{ color: 'red', fontFamily: 'Microsoft YaHei', fontSize: '16px', fontWeight: 'bold' }} onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns}
           dataSource={data}
           className="track_table"
           scroll={{ x: 600 }}  // 指定滚动区域的宽度，根据需要调整
           pagination={{ pageSize: 4 }}
           style={{ width: '100%' }}/>
  );
};

export default App;