import React, { Component } from 'react';
import { Checkbox, Button, Card, Row, Col, Input, message } from 'antd';
import { blueButton } from '../../style/config';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Once_Task_API } from '../../service/config';


interface InstantTaskProps {
}
interface InstantTaskState {
    selectedUuids: string[];
    selectedFunctions: { func: string, data: string }[];
}

class InstantTask extends Component<InstantTaskProps, InstantTaskState> {
    state: InstantTaskState = {
        selectedUuids: [],
        selectedFunctions: [],
    };

    handleUuidCheckboxChange = (uuid: string) => {
        const { selectedUuids } = this.state;
        if (selectedUuids.includes(uuid)) {
            this.setState({
                selectedUuids: selectedUuids.filter(item => item !== uuid),
            });
        } else {
            this.setState({
                selectedUuids: [...selectedUuids, uuid],
            });
        }
    };

    handleFunctionCheckboxChange = (func: string) => {
        const { selectedFunctions } = this.state;
        const index = selectedFunctions.findIndex(item => item.func === func);
        if (index !== -1) {
            this.setState({
                selectedFunctions: selectedFunctions.filter(item => item.func !== func),
            });
        } else {
            this.setState({
                selectedFunctions: [...selectedFunctions, { func, data: '' }],
            });
        }
    };

    handleFunctionDataChange = (func: string, data: string) => {
        const { selectedFunctions } = this.state;
        const updatedFunctions = selectedFunctions.map(item => {
            if (item.func === func) {
                return { ...item, data };
            }
            return item;
        });
        this.setState({
            selectedFunctions: updatedFunctions,
        });
    };

    handleSubmit = () => {
        const { selectedUuids, selectedFunctions } = this.state;
        const token = localStorage.getItem('jwt_token');

        // 遍历选中的每个 uuid
        selectedUuids.forEach(uuid => {
            // 遍历选中的每个 func
            selectedFunctions.forEach(item => {
                // 只处理有数据的功能
                if (item.func && item.data) {
                    // 构造请求体
                    const requestBody = {
                        // command: item.func,
                        data: item.data,
                    };

                    // 构造 job_id
                    const job_id = `${uuid}:${item.func}`;

                    // 发送单独的 POST 请求
                    axios.post(Once_Task_API + `?job_id=${job_id}`, requestBody, {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : undefined,
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(response => {
                            console.log(`POST请求成功，job_id为 ${job_id}:`, response.data);
                            // 在此处输出消息或者进行其他处理
                            message.info(`POST请求成功，job_id为 ${job_id}`);
                        })
                        .catch(error => {
                            console.error(`POST请求失败，job_id为 ${job_id}:`, error);
                            // 在此处输出错误消息或者进行其他错误处理
                            message.error(`POST请求失败，job_id为 ${job_id}`);
                        });
                    message.info(JSON.stringify(requestBody));
                }
            });
        });
    };





    render() {
        const { selectedUuids, selectedFunctions } = this.state;
        const uuidData = [
            { uuid: 'uuid1', name: 'UUID 1' },
            { uuid: 'uuid2', name: 'UUID 2' },
            { uuid: 'uuid3', name: 'UUID 3' },
            { uuid: 'uuid11', name: 'UUID 1' },
            { uuid: 'uuid22', name: 'UUID 2' },
            { uuid: 'uuid33', name: 'UUID 3' },
            { uuid: 'uuid14', name: 'UUID 1' },
            { uuid: 'uuid25', name: 'UUID 2' },
            { uuid: 'uuid36', name: 'UUID 3' },
            { uuid: 'uuid17', name: 'UUID 1' },
            { uuid: 'uuid28', name: 'UUID 2' },
            { uuid: 'uuid39', name: 'UUID 3' },
        ];

        const functionData = [
            { func: 'asset_mapping_scan', name: 'asset_mapping_scan' },
            { func: 'start_check_scan', name: 'start_check_scan' },
            { func: 'switch_nmap_scan', name: 'switch_nmap_scan' },
            { func: 'start_file_integrity', name: 'start_file_integrity' },
            { func: 'switch_os_info', name: 'switch_os_info' },
            { func: 'monitor_directory', name: 'monitor_directory' },
            { func: 'monitor_processes', name: 'monitor_processes' },
            { func: 'vuln_scan_start', name: 'vuln_scan_start' },
            { func: 'start_honeypot', name: 'start_honeypot' },
            { func: 'micro_isolate_encrypt', name: 'micro_isolate_encrypt' },
            { func: 'micro_isolate_decrypt', name: 'micro_isolate_decrypt' },
            { func: 'ssh_log_filter', name: 'ssh_log_filter' },
            { func: 'command_hunting_job', name: 'command_hunting_job' },
        ];
        return (
            <DataContext.Consumer>
                {(context: DataContextType | undefined) => {
                    if (!context) {
                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingOutlined style={{ fontSize: '3em' }} />
                            </div>); // 或者其他的加载状态显示
                    }
                    // 从 context 中解构出 topFiveFimData 和 n
                    const {agentOriginData} = context;
                    // 提取所有不同的 uuid
                    const uniqueUuids = Array.from(new Set(agentOriginData.map(item => item.uuid)));

                    // 构建 uuidData 数组
                    const uuidData = uniqueUuids.map((uuid, index) => ({
                        uuid: uuid,
                        name: uuid
                    }));
                    return(
                        <div style={{ fontWeight: 'bolder', width: '100%', marginTop: '13px' }}>
                            <Card bordered={true}>
                                <Row>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 8,
                                        fontWeight: 'bold',
                                    }}>
                                        <h2 style={{
                                            fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            marginLeft: '0px',
                                        }}>{'执行单次任务'}</h2>
                                    </div>
                                </Row>
                                <div style={{ padding: '20px', }}>
                                    <Row>
                                        <Col span={1} />
                                        <Col span={9}>
                                            <h2 style={{ fontWeight: 'bold' }}>选择主机</h2>
                                            <div style={{
                                                height: '300px',
                                                overflowY: 'scroll',
                                                borderRight: '1px solid #ccc',
                                                paddingRight: '20px',
                                            }}>
                                                {uuidData.map((item) => (
                                                    <div key={item.uuid} style={{ marginBottom: '10px' }}>
                                                        <Checkbox
                                                            checked={selectedUuids.includes(item.uuid)}
                                                            onChange={() => this.handleUuidCheckboxChange(item.uuid)}
                                                            style={{ display: 'inline-block', width: 'calc(100% - 24px)' }}
                                                        >
                                                            {item.name}
                                                        </Checkbox>
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col span={2} />
                                        <Col span={11}>
                                            <div style={{
                                                height: '300px',
                                                overflowY: 'scroll',
                                                borderRight: '1px solid #ccc',
                                                paddingRight: '20px',
                                            }}>
                                                <h2 style={{ fontWeight: 'bold' }}>选择功能</h2>
                                                {functionData.map((item) => (
                                                    <div key={item.func} style={{ marginBottom: '10px' }}>
                                                        <Checkbox
                                                            checked={selectedFunctions.some(f => f.func === item.func)}
                                                            onChange={() => this.handleFunctionCheckboxChange(item.func)}
                                                            style={{ display: 'inline-block', width: 'calc(100% - 24px)' }}
                                                        >
                                                            {item.name}
                                                        </Checkbox>
                                                        {selectedFunctions.some(f => f.func === item.func) && (
                                                            <Input
                                                                placeholder={`输入${item.name}的执行参数`}
                                                                onChange={(e) => this.handleFunctionDataChange(item.func, e.target.value)}
                                                                value={selectedFunctions.find(f => f.func === item.func)?.data || ''}
                                                                style={{ marginTop: '8px', width: '100%' }}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>

                                        <Col span={1} />
                                    </Row>

                                </div>
                                <div style={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
                                    <Button {...blueButton} onClick={this.handleSubmit}>
                                        提交任务
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}

export default InstantTask;

// import React, { useState } from 'react';
// import { Checkbox, Button, Card, Row, Col, Input } from 'antd';
// import { blueButton } from '../../style/config';
//
// interface InstantTaskProps {
//     hosts: { uuid: string, name: string }[];
//     functions: { func: string, name: string }[];
// }
// const InstantTask: React.FC<InstantTaskProps> = ({ hosts, functions }) => {
//     const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
//     const [selectedFunctions, setSelectedFunctions] = useState<{ func: string, data: string }[]>([]);
//     const [inputData, setInputData] = useState<string>('');
//     const uuidData = [
//         { uuid: 'uuid1', name: 'UUID 1' },
//         { uuid: 'uuid2', name: 'UUID 2' },
//         { uuid: 'uuid3', name: 'UUID 3' },
//         { uuid: 'uuid11', name: 'UUID 1' },
//         { uuid: 'uuid22', name: 'UUID 2' },
//         { uuid: 'uuid33', name: 'UUID 3' },
//         { uuid: 'uuid14', name: 'UUID 1' },
//         { uuid: 'uuid25', name: 'UUID 2' },
//         { uuid: 'uuid36', name: 'UUID 3' },
//         { uuid: 'uuid17', name: 'UUID 1' },
//         { uuid: 'uuid28', name: 'UUID 2' },
//         { uuid: 'uuid39', name: 'UUID 3' },
//     ];
//
//     const functionData = [
//         { func: 'func11', name: 'Function 1' },
//         { func: 'func22', name: 'Function 2' },
//         { func: 'func33', name: 'Function 3' },
//         { func: 'func14', name: 'Function 1' },
//         { func: 'func25', name: 'Function 2' },
//         { func: 'func35', name: 'Function 3' },
//         { func: 'func16', name: 'Function 1' },
//         { func: 'func27', name: 'Function 2' },
//         { func: 'func38', name: 'Function 3' },
//         { func: 'func19', name: 'Function 1' },
//         { func: 'func20', name: 'Function 2' },
//         { func: 'func3-', name: 'Function 3' },
//     ];
//     const handleUuidCheckboxChange = (uuid: string) => {
//         const newSelectedUuids = [...selectedUuids];
//         if (newSelectedUuids.includes(uuid)) {
//             newSelectedUuids.splice(newSelectedUuids.indexOf(uuid), 1);
//         } else {
//             newSelectedUuids.push(uuid);
//         }
//         setSelectedUuids(newSelectedUuids);
//     };
//
//     const handleFunctionCheckboxChange = (func: string) => {
//         const newSelectedFunctions = [...selectedFunctions];
//         const index = newSelectedFunctions.findIndex(item => item.func === func);
//         if (index !== -1) {
//             newSelectedFunctions.splice(index, 1);
//         } else {
//             newSelectedFunctions.push({ func, data: '' });
//         }
//         setSelectedFunctions(newSelectedFunctions);
//     };
//
//     const handleFunctionDataChange = (func: string, data: string) => {
//         const newSelectedFunctions = [...selectedFunctions];
//         const index = newSelectedFunctions.findIndex(item => item.func === func);
//         if (index !== -1) {
//             newSelectedFunctions[index].data = data;
//             setSelectedFunctions(newSelectedFunctions);
//         }
//     };
//
//
//     const handleSubmit = () => {
//         const requests = selectedUuids.map(uuid => {
//             const functions = selectedFunctions
//                 .filter(item => item.func && item.data) // Filter out functions without data
//                 .map(item => ({
//                     command: item.func,
//                     data: item.data,
//                 }));
//             return { uuid, functions };
//         });
//
//         console.log('Generated request bodies:', requests);
//         // Perform further actions with requests, such as sending them to a server
//     };
//     return (
//         <div style={{ fontWeight: 'bolder', width: '100%',marginTop: '13px' }}>
//             <Card bordered={true}>
//                 <Row>
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         marginBottom: 8,
//                         fontWeight: 'bold',
//                     }}>
//                         <h2 style={{
//                             fontFamily: 'Microsoft YaHei, SimHei, Arial, sans-serif',
//                             fontSize: '18px',
//                             fontWeight: 'bold',
//                             marginLeft: '0px',
//                         }}>{"执行单次任务"}</h2>
//                     </div>
//                 </Row>
//                 <div style={{ padding: '20px',backgroundColor:'#F6F7FB' }} >
//                     <Row>
//                         <Col span={1}/>
//                         <Col span={9}>
//                             <h2 style={{fontWeight:'bold'}}>选择主机</h2>
//                             <div style={{
//                                 height: '300px',
//                                 overflowY: 'scroll',
//                                 borderRight: '1px solid #ccc',
//                                 paddingRight: '20px',
//                             }}>
//                                 {uuidData.map((item) => (
//                                     <div key={item.uuid} style={{ marginBottom: '10px' }}>
//                                         <Checkbox
//                                             checked={selectedUuids.includes(item.uuid)}
//                                             onChange={() => handleUuidCheckboxChange(item.uuid)}
//                                             style={{ display: 'inline-block', width: 'calc(100% - 24px)' }}
//                                         >
//                                             {item.name}
//                                         </Checkbox>
//                                     </div>
//                                 ))}
//                             </div>
//                         </Col>
//                         <Col span={2} />
//                         <Col span={11}>
//                             <div style={{
//                                 height: '300px',
//                                 overflowY: 'scroll',
//                                 borderRight: '1px solid #ccc',
//                                 paddingRight: '20px',
//                             }}>
//                                 <h2 style={{fontWeight:'bold'}}>选择功能</h2>
//                                 {functionData.map((item) => (
//                                     <div key={item.func} style={{ marginBottom: '10px' }}>
//                                         <Checkbox
//                                             checked={selectedFunctions.some(f => f.func === item.func)}
//                                             onChange={() => handleFunctionCheckboxChange(item.func)}
//                                             style={{ display: 'inline-block', width: 'calc(100% - 24px)' }}
//                                         >
//                                             {item.name}
//                                         </Checkbox>
//                                         {selectedFunctions.some(f => f.func === item.func) && (
//                                             <Input
//                                                 placeholder={`输入${item.name}的执行参数`}
//                                                 onChange={(e) => handleFunctionDataChange(item.func, e.target.value)}
//                                                 value={selectedFunctions.find(f => f.func === item.func)?.data || ''}
//                                                 style={{ marginTop: '8px', width: '100%' }}
//                                             />
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </Col>
//
//                         <Col span={1} />
//                     </Row>
//
//                 </div>
//                 <div style={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
//                     <Button {...blueButton} onClick={handleSubmit}>
//                         提交任务
//                     </Button>
//                 </div>
//             </Card>
//         </div>
//     );
// };
//
// export default InstantTask;
