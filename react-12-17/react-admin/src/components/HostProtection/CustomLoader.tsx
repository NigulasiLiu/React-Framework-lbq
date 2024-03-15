// import React from 'react';
// import { Spin, Progress } from 'antd';

// const CustomLoader = ({ isLoading, scanProgress }: { isLoading: boolean; scanProgress: number }) => {
//   return (
//     <Spin spinning={isLoading} size="large" tip="Loading..." style={{ color: 'transparent',}}>
//     {isLoading||1 ? (
//         <div style={{ textAlign: 'center' }}>
//         <Progress
//             type="circle"
//             percent={scanProgress}
//             strokeColor="#4086FF"
//             strokeWidth={5}
//             format={() => `${scanProgress}%`}
//         />
//         <p style={{ marginTop: '10px', color: '#4086FF', fontSize: '16px', fontWeight: 'bold' }}>病毒扫描中...</p>
//         </div>
//     ) : (
//         <div>加载完成的内容</div>
//     )}
//     </Spin>

//   );
// };

// export default CustomLoader;


import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Progress, Col, Row } from 'antd';

const CustomLoader = ({ isLoading, scanProgress }: { isLoading: boolean; scanProgress: number }) => {
    const renderLoader = () => <Spin size="large" tip="Loading..." style={{ color: 'blue',}}/>;
    const renderProgress = () => <Progress 
                 strokeColor="#4086FF"
                 strokeWidth={5}
                 format={() => `${scanProgress}%`} 
                 percent={scanProgress} showInfo={false}/>;

    return (
        <div style={{ padding: '0px' }} aria-live="polite">
            <Row>
            {/* {isLoading ? renderProgress() : renderProgress()} */}
            {/* <Col span={4}>
                {renderLoader()}
            </Col> */}
            <Col span={24}>
                {renderProgress()}
            </Col>
            </Row>
        </div>
    );
};

CustomLoader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    scanProgress: PropTypes.number.isRequired
};

export default CustomLoader;
