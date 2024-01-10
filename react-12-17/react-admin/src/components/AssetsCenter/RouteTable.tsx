import React from 'react';
import { Table, Progress } from 'antd';
type DataItem = {
    key: string;
    id: string;
    value: number;
    color: string; // 添加 color 属性
};
type BaseItem = {
    key: string;
    color: string; // 添加 color 属性
};
const baseDataItems: BaseItem[] = [
    { key: '1', color: '#F24040' },
    { key: '2', color: '#F77237' },
    { key: '3', color: '#E5BA4A' },
    { key: '4', color: '#F2F3F5' },
    { key: '5', color: '#F2F3F5' },
    // ... other port_data items
];
interface DataTableProps {
    tableNames: string;
    tableName_s: string[];
    sortedData: DataItem[][];
    goToPanel: (panelName: string) => void;
}

const DataTable = ({
    tableNames,
    tableName_s,
    sortedData,
    goToPanel,
}: DataTableProps) => {

    // 创建一个用于生成列的函数
    const generateColumns = (tableName: string, tableName_s: string, index: number) => [
        {
            title: () => (
                <span style={{ fontWeight: 'bold', cursor: 'pointer' }} 
                    onClick={() => goToPanel(tableName)}>{tableName}</span>
            ),
            key: 'id',
            render: (text: any, record: DataItem, idx: number) => {
                const textColor = idx < 3 ? 'white' : 'grey';
                return (
                    <div style={{ cursor: 'pointer' }} 
                        onClick={() => goToPanel(record.id)}>
                        <span
                            style={{
                                lineHeight: '15px',
                                height: '15px',
                                width: '15px',
                                backgroundColor: record.color,
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '16px',
                                position: 'relative',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: textColor,
                            }}
                        >
                            {idx + 1}
                        </span>
                        {record.id}
                    </div>
                );
            },
        },
        {
            title: () => (
                <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{tableName_s[index]}</div>
            ),
            dataIndex: 'value',
            key: 'value',
            render: (value: number, record: DataItem) => {
                const maxValue = Math.max(...sortedData[index].map(item => item.value), 0);
                const percent = Math.round((value / maxValue) * 100);
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Progress percent={percent} strokeColor="#4086FF" showInfo={false} />
                        <div style={{ marginLeft: '20px' }}>{value}</div>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {/* {tableNames.map((tableName, index) => (
                <Table
                    key={tableName}
                    className="customTable"
                    dataSource={sortedData[index]}
                    columns={generateColumns(tableName, tableName_s[index], index)}
                    pagination={false}
                    rowKey="id"
                />
            ))} */}
        </div>
    );
};

export default DataTable;
