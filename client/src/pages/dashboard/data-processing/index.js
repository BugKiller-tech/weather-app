import React, { Component } from 'react'
import { Paper } from 'material-ui';
import ReactTable from 'react-table';
import 'react-table/react-table';
import Spinner from 'react-spinkit';

import { Snackbar } from 'material-ui';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Api from '../../../api';

class DataProcessing extends Component {

  state = {
    errors: {},
    loading: false,
    data: [],
    snackbarOpen: false,
    snackMessage: '',
    
  }
  
  async componentDidMount() {
    console.log('componenent didmount for the data processing..')
    try {
      const res =  await Api.getUnpublishedDataProcessing();
      console.log(res);
      this.setState({
        data: res.data.data
      })
    } catch(err) {

    }

  }
  
  render() {
    const { data }  = this.state;

    var keys = [];
    if (data.length > 0) {
      keys = Object.keys(data[0]);
    }
    const columns = [];
    keys.map(key => {
      if (key == 'station') return;
      columns.push({
        Header: key,
        accessor: key
      })
    })
    console.log('columns', columns);
    
    return (
      <div className="container-fluid">
      <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackMessage}
          autoHideDuration={5000}
          onRequestClose={() => { this.setState({ snackbarOpen: false }) }}
        />
        <div className="row mt-3">
          <div className="col-md-12">
            <Paper style={{ minHeight: '35vh', padding: '20px' }}>
              <h3>Data cleanup</h3>

              <ReactTable 
                data = { data }
                columns = { columns }
              />
              
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

export default DataProcessing;