import React, { Component } from 'react'
import  { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { SelectField, MenuItem, RaisedButton, List, ListItem, IconButton, FontIcon } from 'material-ui';
import ReactTable from "react-table";
import { fetchAllUsers } from '../../../actions/users.js';


import Select from 'react-select';
import 'react-select/dist/react-select.css';



import Spinner from 'react-spinkit';

import api from '../../../api';

import './AddRoleComponent.css';

const allFields = [
  { value: 'className', label: 'Class Name' },
  { value: 'location', label: 'location' },
  { value: 'district', label: 'district' },
  { value: 'village', label: 'village' },
  { value: 'stationName', label: 'stationName' },
  { value: 'date', label: 'date' },
  { value: 'time', label: 'time' },
  { value: 'tempOut', label: 'tempOut' },
  { value: 'hiTemp', label: 'hiTemp' },
  { value: 'lowTemp', label: 'lowTemp' },
  { value: 'outHum', label: 'outHum' },
  { value: 'dewpt', label: 'dewpt' },
  { value: 'avgWindSpeed', label: 'avgWindSpeed' },
  { value: 'hiWindSpeed', label: 'hiWindSpeed' },
  { value: 'windDir', label: 'windDir' },
  { value: 'bar', label: 'bar' },
  { value: 'rain', label: 'rain' },
  { value: 'rainRate', label: 'rainRate' },
  { value: 'heatDD', label: 'heatDD' },
  { value: 'coolDD', label: 'coolDD' },
  { value: 'leafWet', label: 'leafWet' },
  { value: 'batVlt', label: 'batVlt' },
]

class AddRoleComponent extends Component {

  state = {
    selectedLocations: [],
    selectedFields: [],


    currentUser: {},
    locations: [],
    fields: [],



    loading: false,
    errors: {},
  }

  componentDidMount = () => {
    this.setState({
      currentUser: this.props.user,
      locations: this.props.user.locations,
      fields: this.props.user.fields,
    })
  }

  updateUsers = () => {
    this.props.fetchAllUsers();
  }


  addLocations = () => {
    if (this.state.selectedLocations.length == 0) {
      alert('Please select the location first to add');
      return;
    }

    this.setState( {  loading: true })

    api.addLocationsToUser({
      user_id: this.state.currentUser._id,
      locations: this.state.selectedLocations.map(data => data.value)
    })
    .then(res => {
      this.setState({
        locations: res.data.locations,
        selectedLocations: [],
        loading: false
      })
      this.updateUsers();
    })
    .catch(err => {
      this.setState({
        loading: false
      })
    })
  }
  deleteLocation = (locationName) => {
    if (!window.confirm('Do you want to remove this location from this account?')) { return }

    this.setState( {  loading: true })
    api.deleteLocationFromUser({
      user_id: this.state.currentUser._id,
      location: locationName
    })
    .then(res => {
      this.setState({
        locations: res.data.locations,
        loading: false
      })
      this.updateUsers();
    })
    .catch(err => {
      this.setState({
        loading: false
      })
    })
  }

  addFields = () => {
    if (this.state.selectedFields.length == 0) {
      alert('Please select the field first to add');
      return;
    }

    this.setState( {  loading: true })
    api.addFieldsToUser({
      user_id: this.state.currentUser._id,
      fieldNames: this.state.selectedFields.map(field => field.value)
    })
    .then(res => {
      this.setState({
        fields: res.data.fields,
        selectedFields: [],
        loading: false
      })
      this.updateUsers();
    })
    .catch(err => {
      this.setState({
        loading: false
      })
    })
  }
  deleteField = (fieldName) => {
    if (!window.confirm('Do you want to remove this field from this account?')) { return }

    this.setState( {  loading: true })
    api.deleteFieldFromUser({
      user_id: this.state.currentUser._id,
      fieldName: fieldName
    })
    .then(res => {
      this.setState({
        fields: res.data.fields,
        loading: false
      })
      this.updateUsers();
    })
    .catch(err => {
      this.setState({
        loading: false
      })
    })
  }

  render () {
    const allLocationsOption = this.props.allLocations.map((name, idx) => {
      return {
        value: name,
        label: name
      }
    })
    
    const user = this.state.currentUser;
    const { locations, fields } = this.state;


    const locationColumns = [
      {
        Header: 'Location',
        accessor: 'label'
      },
      {
        Header: 'Action',
        accessor: 'label',
        maxWidth: 100,
        Cell: props => 
        <i className="material-icons" onClick={() => { this.deleteLocation(props.value) }}>delete_forever</i>
      }
    ]

    const userLocationsItems = locations.map((name, idx) => {
      return { label: name }
    })


    const fieldsColumn = [
      {
        Header: 'Field',
        accessor: 'label'
      },
      {
        Header: 'Action',
        accessor: 'label',
        maxWidth: 100,
        Cell: props => 
          <i className="material-icons" onClick={() => { this.deleteField(props.value) }}>delete_forever</i>
      }
    ]

    const userFieldsItem = fields.map((name, idx) => {
      return { label: name }
    })


    return (
      <div className="AddRoleComponent p-1">
        <div className="user-info">
          User Name: <strong>{ user.username } </strong>
        </div>
          { this.state.loading ? (
            <div className="loading-indicator">
              <Spinner name="double-bounce" style={{ display: 'inline-block' }} />
            </div>
          ) : '' }
        <div className="row">
          <div className="col-md-6">
            <Select
              name="form-locations"
              className="mt-3 mb-3"
              value={this.state.selectedLocations}
              onChange={(selectedFields) => { this.setState({ selectedLocations: selectedFields }) }}
              multi={true}
              options={allLocationsOption}
            />
            
            <RaisedButton label="Add Location" primary={true} fullWidth={true} onClick={this.addLocations}></RaisedButton>

            <div className="text-center mt-2">
              <ReactTable
                  data={userLocationsItems}
                  columns={locationColumns}
                  defaultPageSize={5}
                  filterable={true}
                  />
            </div>
            
            
          </div>
          <div className="col-md-6">
            <Select
              name="form-fields"
              className="mt-3 mb-3"
              value={this.state.selectedFields}
              onChange={(selectedFields) => { this.setState({ selectedFields: selectedFields }) }}
              multi={true}
              options={allFields}
            />
            <RaisedButton label="Add Field" primary={true} fullWidth={true} onClick={this.addFields}></RaisedButton>

            <div className="text-center mt-2">
              <ReactTable
                  data={userFieldsItem}
                  columns={fieldsColumn}
                  defaultPageSize={5}
                  filterable={true}
                  />
            </div>
            
          </div>
        </div>
      </div> 
    )
  }
}

AddRoleComponent.propTypes = {
  user: PropTypes.object.isRequired,
  fetchAllUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    allLocations: state.weatherData.allLocations,
  }
}

export default connect(mapStateToProps, { fetchAllUsers })(AddRoleComponent);