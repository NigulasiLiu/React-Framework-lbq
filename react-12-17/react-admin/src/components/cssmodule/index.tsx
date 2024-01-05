/**
 *
 * 添加注释
 * Created by SEELE on 2018/1/12
 *
 */
import React, { Component } from 'react';
import { Col, Card, Row } from 'antd';
import BreadcrumbCustom from '../widget/BreadcrumbCustom';
import styles from './index.module.less';

class VirusScanning extends Component {
    render() {
        return (
            <div>
                <BreadcrumbCustom breads={['VirusScanning']} />
                <Row gutter={16}>
                    <Col md={24}>
                        <Card title="VirusScanning" bordered={false}>
                            <div className={styles.header}>
                                <p>Hello VirusScanning</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default VirusScanning;
