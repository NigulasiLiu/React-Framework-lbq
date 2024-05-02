import React from 'react';
import { Card, Col, Row, Form, Input, Button, message,Modal,Table,Descriptions } from 'antd';
import axios from 'axios';
import FetchDataForElkeidTable from '../ElkeidTable/FetchDataForElkeidTable';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import WhiteList from '../WhiteList';
import { hostalertColumns } from '../tableUtils';


interface TotalWhiteListProps{

};

interface TotalWhiteListStates{
};


class TotalWhiteList extends React.Component<TotalWhiteListProps,TotalWhiteListStates> {
  constructor(props:any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (

        <div style={{ marginTop: '0px' }}>
        <WhiteList
          apiEndpoint={"http://localhost:5000/api/files/logs/hostWhiteList/host_1"}
          columns={hostalertColumns}
          currentPanel="hostWhiteList"
        />
      </div>
    );
  }
}

export default TotalWhiteList;

