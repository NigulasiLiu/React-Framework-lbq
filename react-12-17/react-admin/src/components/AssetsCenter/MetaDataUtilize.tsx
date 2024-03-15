import React from 'react';
import axios from 'axios';
import { Progress,} from 'antd';
import { StatusItem, GenericDataItem, BaseItem, DataItem } from '../tableUtils';



const APIList=[
"http://localhost:5000/api/FileIntegrityInfo/all",
"http://localhost:5000/api/files/container/all",
"http://localhost:5000/api/files/open-ports/all",
"http://localhost:5000/api/files/running-processe/all",
"http://localhost:5000/api/files/system-users/all",
"http://localhost:5000/api/files/scheduled-tasks/all",
"http://localhost:5000/api/files/system-services/all",
"http://localhost:5000/api/files/system-software/all",
"http://localhost:5000/api/files/applications/all",
"http://localhost:5000/api/files/kernel-modules/all",
]

const fetchData = async(api:string)=>{
    try{
        const response = await axios.get(api);
         if (response.data) {//&& response.data.status === 200，注意，当response包含message和status两个字段时，不能够用 && response.data.length > 0 判断，因为length属性以及不存在了
            const fieldValue = response.data.message.x; // 获取名称为 x 的字段的值
            console.log("Received message:", fieldValue);
            return fieldValue;
        }
    }catch (error) {
        console.error('Error fetching data:', error);
    }
}



//给出最近7天每天的告警数量
function getPastSevenDaysAlert(data:GenericDataItem[]) {
    const currentDate = new Date();
    const pastSevenDays = [];
  
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
  
      // 如果日期小于 1，则回滚到上个月的最后一天
      if (date.getDate() < 1) {
        date.setDate(0); // 将日期设置为上个月的最后一天
      }
  
      pastSevenDays.push(date);
    }
    const alertData = pastSevenDays.map(date => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return { day: `${month}-${day}`, value: day };
    });
    return alertData;
  }




export const baseDataItems: BaseItem[] = [
    { key: '1', color: '#F24040' },
    { key: '2', color: '#F77237' },
    { key: '3', color: '#E5BA4A' },
    { key: '4', color: '#F2F3F5' },
    { key: '5', color: '#F2F3F5' },
    // ... other port_data items
];
export const port_data: DataItem[] = [
    { key: '1', id: '9984', value: 1, color: '#F24040' },
    { key: '2', id: '9090', value: 1, color: '#F77237' },
    { key: '3', id: '9993', value: 1, color: '#E5BA4A' },
    { key: '4', id: '9982', value: 1, color: '#F2F3F5' },
    { key: '5', id: '8082', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];
export const softerware_data: DataItem[] = [
    // ... other port_data items
];
//除了第一个表中的数据，其余数据都没有排序
export const service_data: DataItem[] = [
    { key: '1', id: 'systemd-initctl.service', value: 1, color: '#F24040' },
    { key: '2', id: 'systemd-tmpfles-clean.service', value: 3, color: '#F77237' },
    { key: '3', id: 'dbus.service', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'systemd-journald.service', value: 4, color: '#F2F3F5' },
    { key: '5', id: 'elkeid_kafka_exporter.service', value: 2, color: '#F2F3F5' },
    // ... other port_data items
];
export const progress_data: DataItem[] = [
    { key: '1', id: 'nginx', value: 1, color: '#F24040' },
    { key: '2', id: 'bash', value: 1, color: '#F77237' },
    { key: '3', id: 'java', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'nginx uploader', value: 1, color: '#F2F3F5' },
    { key: '5', id: 'prometheus', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];

export const fim_data: DataItem[] = [
    // ... other port_data items
];

export const app_data: DataItem[] = [
    { key: '1', id: 'prometheus', value: 1, color: '#F24040' },
    { key: '2', id: 'grafana', value: 1, color: '#F77237' },
    { key: '3', id: 'mongodb', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'redis', value: 1, color: '#F2F3F5' },
    { key: '5', id: 'nginx', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];
export const core_data: DataItem[] = [
    { key: '1', id: 'snd rawmidi', value: 1, color: '#F24040' },
    { key: '2', id: 'ata generic', value: 1, color: '#F77237' },
    { key: '3', id: 'serio raw', value: 1, color: '#E5BA4A' },
    { key: '4', id: 'ablk helper', value: 1, color: '#F2F3F5' },
    { key: '5', id: 'bridge', value: 1, color: '#F2F3F5' },
    // ... other port_data items
];
export const status_data: StatusItem[] = [
    { label: 'Created', value: 7, color: '#22BC44' }, //GREEN
    { label: 'Running', value: 2, color: '#FBB12E' }, //ORANGE
    { label: 'Exited', value: 5, color: '#EA635F' }, //RED
    { label: 'Unknown', value: 1, color: '#E5E8EF' }, //GREY
];
export const findMaxValue = (dataItems: DataItem[]) => {
    return Math.max(...dataItems.map(item => item.value), 0); // 加上0以处理空数组的情况
};

// 找到最大值
export const maxValue = [
    findMaxValue(port_data),
    findMaxValue(softerware_data),
    findMaxValue(service_data),
    findMaxValue(progress_data),
    findMaxValue(fim_data),
    findMaxValue(app_data),
    findMaxValue(core_data),
];

// 告警颜色-固定
export const colorOrder = baseDataItems.map((item) => item.color); // Keep original color order

export const sortDataItems = (dataItems: DataItem[]) => {
    return [...dataItems].sort((a, b) => b.value - a.value);
};
export const sortedData = [
    sortDataItems(port_data),
    sortDataItems(softerware_data),
    sortDataItems(service_data),
    sortDataItems(progress_data),
    sortDataItems(fim_data),
    sortDataItems(app_data),
    sortDataItems(core_data),
];


export const generateColumns2 = (tableName: string, tableName_s: string, tableName_list: string[], goToPanel: (panelName: string) => void) => [
    {
        title: () => <span style={{ fontWeight: 'bold', cursor: 'pointer' }} 
        onClick={() => goToPanel(tableName)}>{tableName}</span>,
        key: 'id',
        render: (text: any, record: DataItem, index: number) => {
          const textColor = index < 3 ? 'white' : 'grey';//后两个图标背景为灰色
          return (
            <div style={{ cursor: 'pointer' }} 
            onClick={() => goToPanel(record.id)}>
              <span
                style={{
                  lineHeight: '15px',
                  height: '15px',
                  width: '15px',
                  backgroundColor: colorOrder[index],
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '16px',
                  position: 'relative',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: textColor,
                }}
              >
                {index + 1}
              </span>
              {record.id}
            </div>
          );
        },
      },
    {
        title: () => <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s}</div>,
        dataIndex: 'value',
        key: 'value',
        render: (value: number) => {
            const percent = Math.round((value / maxValue[tableName_list.indexOf(tableName)]) * 100); // 计算百分比
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Progress percent={percent} strokeColor="#4086FF" showInfo={false} />
                    <div style={{ marginLeft: '20px' }}>{value}</div>
                </div>
            );
        },
    },
];
//显示从接口得到stime数据时，去除进度条
const generateColumns = (tableName: string, tableName_s: string, tableName_list: string[], goToPanel: (panelName: string) => void) => {
    const showProgress = tableName !== '文件完整性校验-最新变更二进制文件 TOP5'; // 判断是否要显示进度条

    return [
        {
            title: () => <span style={{ fontWeight: 'bold', cursor: 'pointer' }} 
            onClick={() => goToPanel(tbName[tableName])}>{tableName}</span>,
            key: 'id',
            render: (text: any, record: DataItem, index: number) => {
                const textColor = index < 3 ? 'white' : 'grey'; // 根据index决定文字颜色
                return (
                    <div style={{ cursor: 'pointer' }} 
                    onClick={() => goToPanel(record.id)}>
                        <span
                            style={{
                                lineHeight: '15px',
                                height: '15px',
                                width: '15px',
                                backgroundColor: colorOrder[index], // 使用record.color作为背景色
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '16px',
                                position: 'relative',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: textColor,
                            }}
                        >
                            {index + 1} {/* 在圆形中显示index + 1 */}
                        </span>
                        {record.id}
                    </div>
                );
            },
        },
        {
            title: () => (
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s}</div>
            ),
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => {
                if (showProgress) {
                    const percent = Math.round(
                        (value / maxValue[tableName_list.indexOf(tableName)]) * 100
                    ); // 计算百分比
                    return (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Progress percent={percent} strokeColor="#4086FF" showInfo={false} />
                            <div style={{ marginLeft: '20px' }}>{value}</div>
                        </div>
                    );
                } else {
                    return <div style={{ textAlign: 'right' }}>{value}</div>;
                }
            },
        },
    ];
};
export const tbName:GenericDataItem={
    '开放端口 TOP5':'open-ports',
    '系统软件 TOP5':'system-software',
    '系统服务 TOP5':'system-services',
    '运行进程 TOP5':'running-processes',
    '文件完整性校验-最新变更二进制文件 TOP5':'fim',
    '应用 TOP5':'applications',
    '内核模块 TOP5':'kernel-modules',
    '容器运行状态分布':'container',}
export const tableNames = [
    '开放端口 TOP5',
    '系统软件 TOP5',
    '系统服务 TOP5',
    '运行进程 TOP5',
    '文件完整性校验-最新变更二进制文件 TOP5',
    '应用 TOP5',
    '内核模块 TOP5',
    '容器运行状态分布',
];
export const tableName_s = ['指纹数', '变更时间', ''];


