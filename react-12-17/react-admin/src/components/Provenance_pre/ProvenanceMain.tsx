import React, { Component } from 'react';
import ShortButton from './ShortButton'
import Modal from './Modal'
import Popover from './Popover'
import ProvenanceGraph from './ProvenanceGraph'
import Selector from './Selector'
import TrackedFileTable from './TrackedFileTable'
import TransforBox from './TransforBox'
import UploadConfig from './UploadConfig'
import CollectTrackObject from './TrackObject'
import TimeRangeAndButton from './TimeRangeAndButton';
import { Divider, Row } from 'antd';
import './provenance.css'

export const buttonStyle = {
    style: {
        borderStyle: 'hidden',
        transition: 'opacity 0.3s', // 添加过渡效果
        opacity: 1, // 初始透明度
    },
    onMouseEnter: (e: { currentTarget: { style: { opacity: number; }; }; }) => {
        e.currentTarget.style.opacity = 0.7; // 鼠标进入时将透明度设置为0.7
    },
    onMouseLeave: (e: { currentTarget: { style: { opacity: number; }; }; }) => {
        e.currentTarget.style.opacity = 1; // 鼠标离开时恢复透明度
    }
};


class Provenance extends Component {
    render() {
        return (
            <div className='main' style={{ fontFamily: '宋体, sans-serif', fontWeight: 'bold' }}>
                <Row>
                    <div className='head'>
                        <Selector />
                        <Popover />
                        <Modal buttonText="查看日志" />
                        <Modal buttonText="使用帮助" />
                        <UploadConfig />
                    </div>
                    <Divider />
                    <div className='body'>
                        <div className='info_left'>
                            <TimeRangeAndButton />
                            <TransforBox useVertexData={true} />
                            <TransforBox useVertexData={false} />
                            <div className='two_button)'>
                                <ShortButton buttonText="节点/边过滤配置修改"/>
                                <CollectTrackObject />
                            </div>
                            <TrackedFileTable />
                        </div>
                        <div className='graph_right'>
                            <ProvenanceGraph />
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}

export default Provenance;