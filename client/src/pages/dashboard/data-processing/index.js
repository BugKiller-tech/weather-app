import React, { Component, Fragment } from 'react'
import { 
  Paper, Snackbar, RaisedButton, FontIcon, IconButton, Dialog, FlatButton, TextField,
} from 'material-ui';

import ReactTable from 'react-table';
import 'react-table/react-table';
import Spinner from 'react-spinkit';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import ProgressButton from 'react-progress-button';
import moment from 'moment';

import Api from '../../../api';


class DataProcessing extends Component {

  state = {
    errors: {},
    loading: false,
    data: [],
    snackbarOpen: false,
    snackMessage: '',
  }
  
  componentDidMount = () => {
    console.log('componenent didmount for the data processing..');
    this.fetchDataFromServer();
  }

  fetchDataFromServer = async () => {
    this.setState({ loading: true });
    Api.getUnpublishedDataProcessing().then(res => {
      this.setState({ loading: false, data: res.data.data })
    })
    .catch(err => {
      this.setState({ loading: false, snackMessage: 'something went wrong', snackbarOpen: true })
    });
  }

  delete = (_id) => {
    confirmAlert({
      title: 'Confirm',
      message: 'Do you want to remove this ',
      buttons: [{
          label: 'Yes',
          onClick: () => { this.deleteItem(_id); }
        }, { 
          label: 'No', onClick: () => {} 
        }
      ]
    })
  }
  deleteItem = (_id) => {
    this.setState({ loading: true });
    Api.deleteDataProcessing({ _id: _id })
    .then(res => {
      this.setState({ loading: false, snackMessage: 'Successfully deleted', snackbarOpen: true });
      this.fetchDataFromServer();
    })
    .catch( err => {
      this.setState({ loading: false, snackMessage: err.response.data.message, snackbarOpen: true });
    });
  }
  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#ffffff" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          // if (cellInfo.column.id == 'time') {
          //   data[cellInfo.index][cellInfo.column.id] = new Date(Date.parse(e.target.innerHTML));
          // } else {
          //   data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          // }
          
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: cellInfo.column.id == 'time' ?  moment(this.state.data[cellInfo.index][cellInfo.column.id]).toISOString() : this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  saveDataAndPublish = () => {
    this.setState({ loading: true });
    Api.saveAndPublish({
      data: this.state.data
    })
    .then(res => {
      this.setState({ loading: false, snackMessage: res.data.message, snackbarOpen: true, data: [] });
    })
    .catch(err => {
      this.setState({ loading: false, snackMessage: err.response.data.message, snackbarOpen: true });
    })
  }

  deleteAll = () => {
    if (!window.confirm('Do you want to delete all the unpublished data')) { return; }
    this.setState({ loading: true });
    Api.deleteAllUnpublished()
    .then(res => {
      this.setState({ loading: false, snackMessage: res.data.message, snackbarOpen: true });
      this.fetchDataFromServer();
    })
    .catch(err => {
      this.setState({ loading: false, snackMessage: err.response.data.message, snackbarOpen: true });
    })
  }
  
  render() {
    const { data, isEditMode, modalOpen }  = this.state;

    var keys = [];
    if (data.length > 0) {
      keys = Object.keys(data[0]);
    }
    const columns = []; const editColumns = [];
    const exceptKeys = ['_id', 'published', '__v', 'time', 'updatedAt', 'createdAt'];
    keys.map(key => {
      if (exceptKeys.includes(key)) { return }
      if (key == 'station') {
        columns.push({
          Header: 'Station',
          accessor: 'station',
          Cell: data => (<div>{data.value.code}</div>)
        })
        return;
      }
      columns.push({ Header: key, accessor: key, Cell: this.renderEditable });
      editColumns.push(key);
    });
    columns.push({ 'Header': 'Time',  accessor: 'time', Cell: this.renderEditable })
    columns.push({
      Header: 'Action',
      accessor: '_id',
      Cell: (data) => (
        <Fragment>
          <IconButton iconClassName="material-icons" onClick={() => { this.delete(data.value) }} style={{ padding: '0px', width: '20px', height: '20px' }} >delete</IconButton>
        </Fragment>
      ),
      width: 100,
    });
    return (
      <div className="container-fluid text-center">
      <Snackbar
        open={this.state.snackbarOpen}
        message={this.state.snackMessage}
        autoHideDuration={5000}
        onRequestClose={() => { this.setState({ snackbarOpen: false }) }}
        />
        { this.state.loading && (
          <div className="loading-indicator">
            <Spinner name="double-bounce" style={{ display: 'inline-block' }} />
          </div>
        )}
        <div className="row mt-3">
          <div className="col-md-12">
            <Paper style={{ minHeight: '35vh', padding: '20px' }}>
              <h3>Data cleanup</h3>
              <div>
                <RaisedButton
                  label="Save and Publish"
                  primary={true}
                  onClick = {this.saveDataAndPublish}
                ></RaisedButton> 
                &nbsp;&nbsp;&nbsp;
                <RaisedButton
                  label="Delete All"
                  secondary={true}
                  onClick = {this.deleteAll}
                ></RaisedButton>
              </div>
              <ReactTable 
                data = { data }
                columns = { columns }
                defaultPageSize={10}
                style={{ background: '#EEEEEE' }}
              />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

export default DataProcessing;