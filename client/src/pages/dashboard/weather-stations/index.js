import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Paper, TextField, RaisedButton, Snackbar, IconButton } from 'material-ui';
import Spinner from 'react-spinkit';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { fetchAllWeatherStations } from '../../../actions/weather-stations';

import api from '../../../api';
import { blue100 } from 'material-ui/styles/colors';
import * as moment from 'moment';

class WeatherStations extends Component {

  state = {
    code: '',
    description: '',
    location: '',
    make: '',
    type: '',
    csv_data_format: '',
    

    
    isEditMode: false,
    selectedWeatherStationId: '',
    
    errors: {},
    loading: false,

    snackbarOpen: false,
    snackMessage: ''
  }

  componentDidMount = () => {
    this.fetchAllStations();
  }
  fetchAllStations = () => {
    this.props.fetchAllWeatherStations();
  }

  isValidInput = () => {
    const errors = {}
    if (this.state.code == '') { errors.code = 'Please input the code' }
    if (this.state.description == '') { errors.description = 'Please input the description' }
    if (this.state.location == '') { errors.location = 'Please input the location' }
    if (this.state.make == '') { errors.make = 'Please input the make' }
    if (this.state.type == '') { errors.type = 'Please input the type' }
    if (this.state.csv_data_format == '') { errors.csv_data_format = 'Please input the csv_data_format' }

    this.setState({ errors });
    if (Object.keys(errors).length > 0 ) { return false }
    return true;
  }

  onSubmit = () => {
    if (!this.isValidInput()) return;

    this.setState({ loading: true });
    if (this.state.isEditMode) {
      api.updateWeatherStation({
        _id: this.state.selectedWeatherStationId,
        code: this.state.code,
        description: this.state.description,
        location: this.state.location,
        make: this.state.make,
        type: this.state.type,
        csv_data_format: this.state.csv_data_format,
        
      })
      .then(res => {
        this.setState({ 
          code: '',
          description: '',
          location: '',
          make: '',
          type: '',
          csv_data_format: '',

          selectedWeatherStationId: '',
          isEditMode: false,
          errors: {},
          loading: false, 
          snackMessage: 'Successfully updated!', 
          snackbarOpen: true 
        });
        this.fetchAllStations();
      })
      .catch(err => {
        this.setState({ 
          loading: false,
          snackMessage: err.response.data.message,
          snackbarOpen: true,
        })
      })
    } else {
      api.createWeatherStation({
        code: this.state.code,
        description: this.state.description,
        location: this.state.location,
        make: this.state.make,
        type: this.state.type,
        csv_data_format: this.state.csv_data_format,

      })
      .then(res => {
        this.setState({ 
          code: '',
          description: '',
          location: '',
          make: '',
          type: '',
          csv_data_format: '',

          errors: {},
          loading: false, 
          snackMessage: 'Successfully created', 
          snackbarOpen: true 
        });
        this.fetchAllStations();
      })
      .catch(err => {
        this.setState({ 
          loading: false,
          snackMessage: err.response.data.message,
          snackbarOpen: true,
        })
      })
    }
  }

  deleteAction = (_id) => {
    confirmAlert({
      title: 'Confirm',
      message: 'Do you want to remove this station?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.deleteAccount(_id);
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }
  deleteAccount = (_id) => {
    api.deleteWeatherStation({
      _id
    })
    .then(res => {
      this.setState({
        snackMessage: 'Successfully removed',
        snackbarOpen: true,
      })
      this.fetchAllStations();
    })
  }
  cancelEdit = () => {
    this.setState({
      code: '',
      description: '',
      location: '',
      make: '',
      type: '',
      csv_data_format: '',

      selectedWeatherStationId: '',
      isEditMode: false,
      errors: {}
    })
  }
  editAccount = (_id) => {
    this.props.stations.filter(station => {
      if (station._id == _id) {
        this.setState({
          code: station.code,
          description: station.description,
          location: station.location,
          make: station.make,
          type: station.type,
          csv_data_format: station.csv_data_format,
          selectedWeatherStationId: _id,
          isEditMode: true,
          errors: {}
        })
      }
    })
  }
  viewFtpAccount = (ftp) => {
    confirmAlert({
      title: 'FTP Info',
      message: `Username: ${ftp.username}Password: ${ftp.password}`,
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui' style={{ minWidth: '300px', background: '#FFF', padding: '20px', borderTop: '5px solid #a8c9ff', borderRadius: '5px', boxShadow: '0px 0px 5px #000a' }}>
            <h3>Ftp Account</h3>
            <p>Username: { ftp.username }</p>
            <p>Password: { ftp.password }</p>
            <div className="text-center">
              <button className="btn btn-secondary btn-block" onClick={onClose}>OK</button>
            </div>
          </div>
        )
      },
    })    
  }


  render () {
    const { errors, isEditMode } = this.state;
    const stationColumns = [
      {
        Header: 'Code',
        accessor: 'code'
      },
      {
        Header: 'Description',
        accessor: 'description'
      },
      {
        Header: 'Location',
        accessor: 'location'
      },
      {
        Header: 'Make',
        accessor: 'make'
      },
      {
        Header: 'Type',
        accessor: 'type'
      },
      {
        Header: 'CSV Data Format',
        accessor: 'csv_data_format'
      },
      {
        Header: 'Relative Path',
        accessor: 'ftp',
        Cell: props => <div>
          { props.value.relative_path }
        </div>
      },
      {
        Header: 'FTP Account',
        accessor: 'ftp',
        Cell: props => <div>
          <IconButton iconClassName="material-icons" onClick={() => { this.viewFtpAccount(props.value) }}>remove_red_eye</IconButton>
        </div>
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
        Cell: props => <div>
          { moment(props.value).format('MMMM Do YYYY') }
        </div>
      },      
      {
        Header: 'Action',
        accessor: '_id',
        Cell: props => <div>
          { !props.original.isAutoGenerated && 
            (<IconButton iconClassName="material-icons" onClick={() => { this.deleteAction(props.value) }}>delete</IconButton>)
          }
          <IconButton iconClassName="material-icons" onClick={() => { this.editAccount(props.value) }}>mode_edit</IconButton>
        </div>
      }
    ]
    return (
      <div className='ftp-accounts'>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackMessage}
          autoHideDuration={5000}
          onRequestClose={() => { this.setState({ snackbarOpen: false }) }}
        />
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-md-4">
              <Paper style={{ minHeight: '90vh', padding: '20px' }}>
                <h3>Create Weather Station</h3>
                <div>
                  <TextField 
                      hintText="Code" type="text" floatingLabelText="Code"
                      name="code"
                      errorStyle={{ float: 'left' }}
                      errorText={ errors.code ? errors.code : '' }
                      onChange={ (e) => { this.setState({ code: e.target.value }) }}
                      value={ this.state.code }
                      fullWidth={true}
                    />
                  <TextField 
                    hintText="Description" type="text" floatingLabelText="Description"
                    name="description"
                    errorStyle={{ float: 'left' }}
                    errorText={ errors.description ? errors.description : '' }
                    onChange={ (e) => { this.setState({ description: e.target.value }) }}
                    value={ this.state.description }
                    fullWidth={true}
                  />
                  <TextField 
                    hintText="Location" type="text" floatingLabelText="Location"
                    name="location"
                    errorStyle={{ float: 'left' }}
                    errorText={ errors.location ? errors.location : '' }
                    onChange={ (e) => { this.setState({ location: e.target.value }) }}
                    value={ this.state.location }
                    fullWidth={true}
                  />
                  <TextField 
                    hintText="Make" type="text" floatingLabelText="Make"
                    name="make"
                    errorStyle={{ float: 'left' }}
                    errorText={ errors.make ? errors.make : '' }
                    onChange={ (e) => { this.setState({ make: e.target.value }) }}
                    value={ this.state.make }
                    fullWidth={true}
                  />
                  <TextField 
                    hintText="Type" type="text" floatingLabelText="Type"
                    name="type"
                    errorStyle={{ float: 'left' }}
                    errorText={ errors.type ? errors.type : '' }
                    onChange={ (e) => { this.setState({ type: e.target.value }) }}
                    value={ this.state.type }
                    fullWidth={true}
                  />
                  <TextField 
                    hintText="Csv Data Format" type="text" floatingLabelText="Csv Data Format"
                    name="csv_data_format"
                    errorStyle={{ float: 'left' }}
                    errorText={ errors.csv_data_format ? errors.csv_data_format : '' }
                    onChange={ (e) => { this.setState({ csv_data_format: e.target.value }) }}
                    value={ this.state.csv_data_format }
                    fullWidth={true}
                  />
                  <div className="text-sm text-secondary">Please write the items separate by comma</div>
                  <div className="text-center mt-3">
                    <RaisedButton label={ isEditMode ? 'Save Changes' : 'Create Weather Station' } primary={true} fullWidth={true} onClick={this.onSubmit} /> &nbsp; &nbsp;
                    { isEditMode ? <RaisedButton label="Cancel" primary={false} fullWidth={true} onClick={ this.cancelEdit } /> : '' }
                    <br/>
                    { this.state.loading ? (<Spinner name="wave" style={{ display: 'inline-block' }} />) : '' }
                  </div>
                </div>
              </Paper>
            </div>
            <div className="col-md-8">
              <Paper style={{ minHeight: '90vh', padding: '20px' }}>
                <h3>All Weather Stations</h3>
                <ReactTable 
                  columns = {stationColumns}
                  data={this.props.stations}
                  defaultPageSize={10}
                  filterable={true}
                />
              </Paper>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

WeatherStations.propTypes = {
  fetchAllWeatherStations: PropTypes.func.isRequired,
}
const mapStateToProps = (state, ownProps) => {
  return {
    stations: state.stations.stations
  }
}

export default connect(mapStateToProps, { fetchAllWeatherStations })(WeatherStations);