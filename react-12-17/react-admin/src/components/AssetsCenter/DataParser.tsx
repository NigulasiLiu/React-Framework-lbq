// import React, { useEffect, useState } from 'react';
// import { Table } from 'antd';

// const DataParser: React.FC<{ data: string }> = ({ data }) => {
//   const [parsedData, setParsedData] = useState<{ id: string, data: Record<string, any> }[]>([]);

//   useEffect(() => {
//     try {
//       // 解析传入的数据
//       const parsed = JSON.parse(data);

//       // 将数据解析并格式化为表格所需的结构
//       const dataArray: { id: string, data: Record<string, any> }[] = [];

//       for (const key in parsed) {
//         dataArray.push({ id: key, data: parsed[key] });
//       }

//       // 更新状态以存储解析后的数据
//       setParsedData(dataArray);
//     } catch (error) {
//       console.error('解析数据时出错：', error);
//     }
//   }, [data]);

//   // 定义表格列的配置
//   const columns = [
//     {
//       title: 'filename',
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

//   return (
//     <div>
//       <h2>解析后的数据：</h2>
//       <Table dataSource={parsedData} columns={columns} />
//     </div>
//   );
// };

// export default DataParser;
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const DataParser: React.FC<{ data: Record<string, any>[] }> = ({ data }) => {
  // 无需再进行数据解析，直接使用传入的 data

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

  return (
    <div>
      <h2>解析后的数据：</h2>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default DataParser;