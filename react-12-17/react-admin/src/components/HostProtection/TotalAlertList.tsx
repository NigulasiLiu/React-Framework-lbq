import React from 'react';
import { Card, Col, Row, Form, Input, Button, message,Modal,Table,Descriptions } from 'antd';
import axios from 'axios';
import FetchDataForElkeidTable from '../OWLTable/FetchDataForElkeidTable';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import AlertList from './AlertList';
import { hostalertColumns } from '../Columns';


interface TotalAlertListProps{

};

interface TotalAlertListStates{
};


class TotalAlertList extends React.Component<TotalAlertListProps,TotalAlertListStates> {
  constructor(props:any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (

        <div style={{ marginTop: '0px' }}>
        <AlertList
          apiEndpoint={"http://localhost:5000/api/files/logs/hostalertlist/host_1"}
          columns={hostalertColumns}
          currentPanel="hostalertlist"
        />
      </div>
    );
  }
}

export default TotalAlertList;

