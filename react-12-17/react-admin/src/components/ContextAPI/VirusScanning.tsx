import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

const DataParser: React.FC = () => {
const [data, setData] = useState<Record<string, Record<string, any>>>({});


  const fetchData = () => {
    // 使用 Axios 获取数据
    axios.get('http://localhost:5000/server/FileIntegrityInfo')
      .then(response => {
        // 从响应中获取数据
        const responseData = response.data;

        // 更新组件状态以存储数据
        setData(responseData);
      })
      .catch(error => {
        console.error('获取数据时出错：', error);
      });
  };

  // 定义表格列的配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'hostIP',
      dataIndex: ['data', 'hostIP'],
      key: 'hostIP',
    },
    {
      title: 'alert_type',
      dataIndex: ['data', 'alert_type'],
      key: 'alert_type',
    },
    {
      title: 'event_time',
      dataIndex: ['data', 'event_time'],
      key: 'event_time',
    },
  ];

  // 使用类型断言告诉 TypeScript data[key] 的类型
  const dataSource = Object.keys(data).map(key => ({
    id: key,
    data: data[key] // 使用类型断言
  }));

  return (
    <div>
      <h2>解析后的数据：</h2>
      <Button onClick={fetchData}>采集数据</Button>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default DataParser;



// import React, { useEffect, useState } from 'react';
// import { Table, Button } from 'antd';
// import axios from 'axios';

// const DataParser: React.FC = () => {
//   const [data, setData] = useState<Record<string, Record<string, any>>>({});

//   const fetchData = () => {
//     // 使用 Axios 获取本地 JSON 数据
//     axios.get('./data.json') // 替换为实际的 JSON 文件路径
//       .then(response => {
//         // 从响应中获取数据
//         const responseData = response.data;

//         // 更新组件状态以存储数据
//         setData(responseData);
//       })
//       .catch(error => {
//         console.error('获取数据时出错：', error);
//       });
//   };

//   // 定义表格列的配置
//   const columns = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: 'hostIP',
//       dataIndex: ['data', 'hostIP'],
//       key: 'hostIP',
//     },
//     {
//       title: 'alert_type',
//       dataIndex: ['data', 'alert_type'],
//       key: 'alert_type',
//     },
//     {
//       title: 'event_time',
//       dataIndex: ['data', 'event_time'],
//       key: 'event_time',
//     },
//   ];

//   // 将数据转换为适用于表格的 dataSource 格式
//   const dataSource = Object.keys(data).map(key => ({
//     id: key,
//     data: data[key]
//   }));

//   return (
//     <div>
//       <h2>解析后的数据：</h2>
//       <Button onClick={fetchData}>获取数据</Button> {/* 添加获取数据的按钮 */}
//       <Table dataSource={dataSource} columns={columns} />
//     </div>
//   );
// };

// export default DataParser;







// import React from 'react';
// import { Table } from 'antd';

// const DataFetcher: React.FC = () => {
//   // 定义本地 JSON 数据
//   const localData: Record<string, { hostIP: string; alert_type: string; event_time: string }> = {
//     "/Users/polowong/Desktop/.DS_Store":{
//         "alert_type":"modified",
//         "event_time":"1705320414.517885",
//         "hostIP":"218.194.48.204"
//     },
//     "/Users/polowong/Desktop/.localized":{
//         "alert_type":"normal",
//         "event_time":"1705319758.9945831",
//         "hostIP":"218.194.48.204"
//     },
//     "/Users/polowong/Desktop/income.xlsx":{
//         "alert_type":"normal",
//         "event_time":"1705844355.14869",
//         "hostIP":"127.0.0.1"
//     },
//     "/Users/polowong/Desktop/\u7814\u7a76\u751f\u5de5\u4f5c":{
//         "alert_type":"normal",
//         "event_time":"1705320414.518763",
//         "hostIP":"218.194.48.204"
//     },
//     "aa":{
//         "alert_type":"created",
//         "event_time":"2",
//         "hostIP":"gg"
//     }
// };

//   // 将数据转换为表格的 dataSource
//   const dataSource = Object.keys(localData).map(key => ({
//     id: key,
//     data: localData[key]
//   }));

//   // 定义表格列的配置
//   const columns = [
//     {
//       title: 'FileName',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: 'Host IP',
//       dataIndex: ['data', 'hostIP'],
//       key: 'hostIP',
//     },
//     {
//       title: 'Alert Type',
//       dataIndex: ['data', 'alert_type'],
//       key: 'alert_type',
//     },
//     {
//       title: 'Event Time',
//       dataIndex: ['data', 'event_time'],
//       key: 'event_time',
//     },
//   ];

//   return (
//     <div>
//       <h2>本地 JSON 数据表格展示：</h2>
//       <Table dataSource={dataSource} columns={columns} />
//     </div>
//   );
// };

// export default DataFetcher;