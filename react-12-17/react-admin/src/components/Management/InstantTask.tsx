import React, { Component } from 'react';
import { Checkbox, Button, Card, Row, Col, Input, message } from 'antd';
import { blueButton } from '../../style/config';
import { DataContext, DataContextType } from '../ContextAPI/DataManager';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Isolate_decrypt_Data, Once_Task_API, Task_Data_API } from '../../service/config';


interface InstantTaskProps {
}
interface InstantTaskState {
    selectedUuids: string[];
    selectedFunctions: { func: string, data: string, parseAsJson: boolean }[];
    uuidError: boolean;
}

class InstantTask extends Component<InstantTaskProps, InstantTaskState> {
    state: InstantTaskState = {
        selectedUuids: [],
        selectedFunctions: [],
        uuidError: false,
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
                selectedFunctions: [...selectedFunctions, { func, data: '', parseAsJson: false }],
            });
        }
    };

    handleFunctionDataChange = (func: string, data: string, parseAsJson: boolean) => {
        const { selectedFunctions } = this.state;
        let parsedData = data;
        if (parseAsJson) {
            try {
                parsedData = JSON.parse(data);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }
        }
        const updatedFunctions = selectedFunctions.map(item => {
            if (item.func === func) {
                return { ...item, data: parsedData };
            }
            return item;
        });
        this.setState({
            selectedFunctions: updatedFunctions,
        });
    };


    handleSubmit = () => {
        const { selectedUuids, selectedFunctions } = this.state;

        if (selectedUuids.length === 0 || selectedFunctions.length === 0) {
            this.setState({ uuidError: true });
            message.error('请选择至少一个主机和一个功能');
            return;
        }
        const token = localStorage.getItem('jwt_token');
        // 遍历选中的每个 uuid
        selectedUuids.forEach(uuid => {
            // 遍历选中的每个 func
            selectedFunctions.forEach(item => {
                // 只处理有数据的功能
                if (item.func && item.data) {

                    // 构造 job_id
                    const job_id = `${uuid}:${item.func}`;
                    const Task_API = item.func!=="micro_isolate_decrypt"?
                        (Once_Task_API + `?job_id=${job_id}`):(Isolate_decrypt_Data)
                    // 构造请求体
                    const requestBody = item.func!=="micro_isolate_decrypt"?{
                        // data: item.parseAsJson ? item.data : { value: item.data },
                        data: item.data,
                        uuid: uuid,
                        func: item.func,
                    }:item.data
                    ;
                    // 发送单独的 POST 请求
                    axios.post(Task_API, requestBody, {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : undefined,
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(response => {
                            message.success(`POST请求成功，job_id为 ${job_id}`);
                            // 这里可以根据需要刷新页面或者重新加载数据
                            console.log(`POST请求成功，job_id为 ${job_id}:`, response.data);
                            // 在此处输出消息或者进行其他处理
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
            { func: 'asset_mapping_scan', name: '资产测绘' },
            { func: 'start_check_scan', name: '基线检查' },
            { func: 'switch_nmap_scan', name: 'switch_nmap_scan' },
            { func: 'start_file_integrity', name: '文件完整性检验' },
            { func: 'switch_os_info', name: 'switch_os_info' },
            { func: 'monitor_directory', name: '目录监测' },
            { func: 'monitor_processes', name: '进程监测' },
            { func: 'vuln_scan_start', name: '漏洞扫描' },
            { func: 'start_honeypot', name: '开启蜜罐' },
            { func: 'micro_isolate_encrypt', name: '文件隔离' },
            { func: 'micro_isolate_decrypt', name: '隔离文件解密' },
            { func: 'ssh_log_filter', name: '暴力破解' },
            { func: 'command_hunting_job', name: '权限提升和防御规避' },
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
                                                            style={{ fontSize:'16px',display: 'inline-block', width: 'calc(100% - 24px)', borderBottom:'solid 1px #ccc', paddingRight: '5px' }}
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
                                                            style={{ fontSize:'16px',display: 'inline-block', borderBottom:'solid 1px #ccc', width: 'calc(100% - 24px)' }}
                                                        >
                                                            {item.name}
                                                        </Checkbox>
                                                        {/*{selectedFunctions.some(f => f.func === item.func) && (*/}
                                                        {/*    <Input*/}
                                                        {/*        placeholder={`输入${item.name}的执行参数`}*/}
                                                        {/*        onChange={(e) => this.handleFunctionDataChange(item.func, e.target.value)}*/}
                                                        {/*        value={selectedFunctions.find(f => f.func === item.func)?.data || ''}*/}
                                                        {/*        style={{ marginTop: '8px', width: '100%' }}*/}
                                                        {/*    />*/}
                                                        {/*)}*/}{selectedFunctions.some(f => f.func === item.func) && (
                                                        <div>
                                                            <Checkbox
                                                                checked={selectedFunctions.find(f => f.func === item.func)?.parseAsJson || false}
                                                                onChange={(e) => {
                                                                    const updatedFunctions = selectedFunctions.map(f => {
                                                                        if (f.func === item.func) {
                                                                            return { ...f, parseAsJson: e.target.checked };
                                                                        }
                                                                        return f;
                                                                    });
                                                                    this.setState({ selectedFunctions: updatedFunctions });
                                                                }}
                                                            >
                                                                组装为JSON
                                                            </Checkbox>
                                                            <Input
                                                                placeholder={`输入${item.name}的执行参数或者任意值`}
                                                                onChange={(e) => this.handleFunctionDataChange(item.func, e.target.value, selectedFunctions.find(f => f.func === item.func)?.parseAsJson || false)}
                                                                value={selectedFunctions.find(f => f.func === item.func)?.data || ''}
                                                                style={{ marginTop: '8px', width: '100%' }}
                                                            />
                                                        </div>
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
