import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { 
  Dialog, Paper, TextField, RaisedButton, 
  Snackbar, IconButton, FloatingActionButton, 
  FontIcon, FlatButton ,
  MenuItem, SelectField,
  Toggle,
} from 'material-ui';

import Spinner from 'react-spinkit';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { fetchAllWeatherStations } from '../../../actions/weather-stations';
import { fetchAllDataPoints } from '../../../actions/data-points';

import api from '../../../api';

class DataPoints extends Component {

  state = {
    errors: {},
    loading: false,

    snackbarOpen: false,
    snackMessage: '',



    modalOpen: false,
    isEditMode: false,
    
    selectedId: '',

    inputData: {
      name: '',
      desc: '',
      isChartDispElement: '',
      relations: []
    },
    selectedStationId: '',
    columnCandidates: [],  // { weatherStation, colName }
    selectedColumnName: '',
  }

  addNew = () => {
    this.setState({
      isEditMode: false,
      modalOpen: true
    })
  }
  closeModal = () => {
    this.setState({ 
      isEditMode: false, 
      modalOpen: false, 
      selectedId: '',
      inputData: {
        name: '',
        desc: '',
        relations: []
      },
    })
  }

  validInput = () => {
    const errors = {};
    if (this.state.inputData.name == '') { errors.name = 'Please input the name first' }
    if (this.state.inputData.desc == '') { errors.desc = 'Please input the description first' }

    this.setState({ errors })
    if (Object.keys(errors).length > 0) return false;
    return true;
  }
  onSubmit = () => {

    if (! this.validInput()) { return }

    if (this.state.isEditMode) {
      this.setState({ loading: true });

      api.updateDataPoint({
        _id: this.state.selectedId,
        ...this.state.inputData
      })
      .then(res => {
        this.setState({
          loading: false,
          modalOpen: false,
          selectedStationId: '',
          selectedColumnName: '',
          selectedId: '',
          columnCandidates: [],
          snackbarOpen: true,
          snackMessage: 'Successfully updated!'
        })
        this.props.fetchAllDataPoints();
      })
      .catch(err => {
        this.setState({
          loading: false,
          snackbarOpen: true,
          snackMessage: err.response.data.message
        })
      })
    } else {
      this.setState({ loading: true });

      api.createDataPoint({
        ...this.state.inputData
      })
      .then(res => {
        this.setState({
          loading: false,
          modalOpen: false,
          selectedStationId: '',
          selectedColumnName: '',
          columnCandidates: [],
          snackbarOpen: true,
          snackMessage: 'Successfully created'
        })
        this.props.fetchAllDataPoints();
      })
      .catch(err => {
        this.setState({
          loading: false,
          snackbarOpen: true,
          snackMessage: err.response.data.message
        })
      })
    }
    
  }
  componentDidMount = () => {
    this.props.fetchAllWeatherStations();
    this.props.fetchAllDataPoints();
  }
  selectWeatherStation = (event, index, value) => { 
    let station = this.props.stations.find((item) => { return item._id == value })
    let stationColumns = [];
    if (station && station.csv_data_format) {
      stationColumns = station.csv_data_format.split(',').map((item, idx) => {
        return <MenuItem  key={idx} value={item.trim()} primaryText={item.trim()} />
      })
    }
    this.setState({ selectedStationId: value, columnCandidates: stationColumns }) 
  }
  addRelation = () => {
    if (this.state.selectedStationId == '') {
      this.setState( {
        snackbarOpen: true,
        snackMessage: 'Please pick the station first'
      })
      return;
    }
    if (this.state.selectedColumnName == '') {
      this.setState( {
        snackbarOpen: true,
        snackMessage: 'Please pick column name'
      })
      return;
    }

    let items = this.state.inputData.relations.filter(item => {
      return item.weatherStation == this.state.selectedStationId
    })
    if (items.length > 0 && this.state.inputData.name != 'time') {
      this.setState({
        snackbarOpen: true,
        snackMessage: 'This weather station is already added'
      }) 
      return;
    }
    if (items.length > 1 && this.state.inputData.name == 'time') {
      this.setState({
        snackbarOpen: true,
        snackMessage: 'You already picked 2 fields for the time data point'
      }) 
      return;
    }

    var formatString = '';
    if (this.state.inputData.name == 'time') {
      formatString = window.prompt('Please input the format if this field date format.', '');
    }

    let newRelation = { weatherStation: this.state.selectedStationId, colName: this.state.selectedColumnName, dateFormatString: formatString }
    this.setState({
      inputData: {
        ...this.state.inputData, relations: [ ...this.state.inputData.relations, newRelation ]  
      },
      selectedStationId: '',
      selectedColumnName: ''
    })
  }

  editAccount = (_id) => {
    let dataPoint = this.props.dataPoints.find((item) => {
      return item._id == _id
    })
    this.setState({
      isEditMode: true,
      selectedId: _id,
      inputData: {
        name: dataPoint.name,
        desc: dataPoint.desc,
        isChartDispElement: dataPoint.isChartDispElement,
        relations: dataPoint.relations,
      },
      modalOpen: true,
    })
  }

  deleteAction = (_id) => {
    confirmAlert({
      title: 'Confirm',
      message: 'Do you want to remove this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.deleteDatapoint(_id);
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  deleteDatapoint = (_id) => {
    this.setState({ loading: true })
    api.deleteDataPoint({
      _id: _id
    })
    .then(res => {
      this.setState({
        loading: false,
        modalOpen: false,
        selectedStationId: '',
        selectedColumnName: '',
        columnCandidates: [],
        snackbarOpen: true,
        snackMessage: 'Successfully deleted!'
      })
      this.props.fetchAllDataPoints();
    }).catch(err => {
      this.setState( {
        snackbarOpen: true,
        snackMessage: 'can not delete the data point'
      })
    });
  }

  connectedStationNames = (relations) => {
    let names = '';
    relations.map(item => {
      let foundStation = this.props.stations.find(station => {return  station._id == item.weatherStation })
      if (foundStation) 
        return foundStation.code;
      else  
        return 'Unknown';
    }).forEach(element => {
      names += element + ',\n\n';            
    });
    return names;
  }

  displayConnectedStations = (relations) => {
    confirmAlert({
      title: 'Connected Stations',
      message: this.connectedStationNames(relations),
      buttons: [
        {
          label: ' OK ',
          onClick: () => {}
        }
      ]
    })
  }
  removeStationFromRelation = (id) => {
    const relations = this.state.inputData.relations.filter(item => {
      return item.weatherStation !== id
    })
    this.setState({ inputData: { ...this.state.inputData, relations: relations } })
  }


  render () {
    const { errors, isEditMode, modalOpen, inputData, selectedStationId, selectedColumnName, columnCandidates } = this.state;
    const datapointsColumns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Description',
        accessor: 'desc'
      },
      {
        Header: 'Connected Weather Stations',
        accessor: 'relations',
        Cell: props => {
          if (props.original.name != 'time') {
            return (
              <span className="badge badge-success" style={{ cursor: 'pointer'}} onClick={ () => this.displayConnectedStations(props.value) }>
                &nbsp;&nbsp;{ props.value.length }&nbsp;&nbsp;
              </span>
            )
          } else {
            return (<div></div>)
          }
        }
      },
      {
        Header: 'Chart field ?',
        accessor: 'isChartDispElement',
        Cell: props => <span>{ props.value ? 'YES' : 'NO' }</span>
      },
      {
        Header: 'Action',
        accessor: '_id',
        Cell: props => <div>
          {props.original.name != 'time' && <IconButton iconClassName="material-icons" style={{ padding: '0px', width: '20px', height: '20px' }}  onClick={() => { this.deleteAction(props.value) }}>delete</IconButton>}
          &nbsp;&nbsp;&nbsp;
          <IconButton iconClassName="material-icons" style={{ padding: '0px', width: '20px', height: '20px' }} onClick={() => { this.editAccount(props.value) }}>mode_edit</IconButton>
        </div>
      }
    ];

    const modalAcctions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeModal}
      />,
      <FlatButton
        label={ isEditMode ? 'Save Changes' : 'Create' }
        primary={true}
        // keyboardFocused={true}
        onClick={this.onSubmit}
      />,
    ];

    const stationOptions = this.props.stations.map((item, idx) => {
      return (
        <MenuItem  key={idx} value={item._id} primaryText={item.code} />
      )
    })

    const addedColumnsRender = this.state.inputData.relations.map((item, idx) => {
      const station = this.props.stations.find(element => {
        return element._id == item.weatherStation
      })
      return (
        <tr>
          <td>{ station.code }</td>
          <td>{item.colName } { item.dateFormatString  ? ' (' + item.dateFormatString + ')' : '' } </td>
          <td>
            <i className="material-icons" onClick={() => { this.removeStationFromRelation(item.weatherStation) }}>delete_forever</i>
          </td>
        </tr>
      )
    })

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
            <div className="col-md-12">
              <Paper style={{ minHeight: '35vh', padding: '20px' }}>
                <h3>Data Points</h3>
                <FloatingActionButton
                  onClick={this.addNew}
                >
                  <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>
                <ReactTable 
                  columns={datapointsColumns}
                  data={this.props.dataPoints}
                />
              </Paper>
            </div>
          </div>

          <Dialog
            title={ isEditMode ? 'Update Data Point' : 'Add New Data Point' }
            actions={modalAcctions}
            // modal={false}
            open={modalOpen}
            onRequestClose={this.closeModal}
            autoScrollBodyContent={true}
          >
            <div className="row">
              <div className="col-md-12">
                <TextField 
                  hintText="Name" type="text" floatingLabelText="Name"
                  name="name"
                  errorStyle={{ float: 'left' }}
                  errorText={ errors.name ? errors.name : '' }
                  onChange={ (e) => { this.setState({ inputData: { ...inputData, name: e.target.value }} )} }
                  value={ inputData.name }
                  disabled = { inputData.name == 'time' }
                  fullWidth={true}
                />
                <TextField 
                  hintText="Description" type="text" floatingLabelText="Description"
                  name="desc"
                  errorStyle={{ float: 'left' }}
                  errorText={ errors.desc ? errors.desc : '' }
                  onChange={ (e) => { this.setState({ inputData: { ...inputData, desc: e.target.value }} )} }
                  value={ inputData.desc }
                  fullWidth={true}
                />
                <Toggle
                  label="Make Chart in dashboard"
                  toggled={inputData.isChartDispElement}
                  style={{ maxWidth: `300px` }}
                  onToggle={(e, checked) => {
                    this.setState({ inputData: { ...inputData, isChartDispElement: checked } })
                  }}
                />


                <div className="row border border-info">
                  <div className="col-md-5">
                    <SelectField
                      floatingLabelText="Please pick weather station"
                      value={selectedStationId}
                      fullWidth={true}
                      onChange={ this.selectWeatherStation}
                    >
                      {stationOptions }
                    </SelectField>
                  </div>
                  <div className="col-md-5">
                    <SelectField
                      floatingLabelText="Please pick column"
                      value={selectedColumnName}
                      fullWidth={true}
                      onChange={ (e, idx, value) => { this.setState({ selectedColumnName: value }) }}
                    >
                      {columnCandidates }
                    </SelectField>
                  </div>
                  <div className="col-md-2">
                    <RaisedButton
                      primary={true}
                      style={{ position: 'absolute', bottom: '0' }}
                      label="Add"
                      onClick={this.addRelation}
                    />
                  </div>
                </div>
                { this.state.loading ? (<Spinner name="rotating-plane" style={{ display: 'inline-block' }} />) : '' }
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Weather Station</th>
                      <th scope="col">Column</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    { addedColumnsRender }
                  </tbody>
                </table>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    )
  }
}

DataPoints.propTypes = {
  fetchAllWeatherStations: PropTypes.func.isRequired,
  fetchAllDataPoints: PropTypes.func.isRequired,
}
const mapStateToProps = (state, ownProps) => {
  return {
    stations: state.stations.stations,
    dataPoints: state.dataPoints.dataPoints,
  }
}

export default connect(mapStateToProps, { fetchAllWeatherStations, fetchAllDataPoints })(DataPoints);