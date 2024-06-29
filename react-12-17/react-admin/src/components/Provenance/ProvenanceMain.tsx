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


class Provenance extends Component {
    render() {
        return (
            <div className='main'>
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
                                <ShortButton buttonText="节点/边过滤配置修改" />
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