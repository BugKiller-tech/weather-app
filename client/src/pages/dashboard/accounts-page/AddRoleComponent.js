import React, { Component } from 'react'
import  { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { SelectField, MenuItem, RaisedButton, List, ListItem, IconButton } from 'material-ui';
import ReactTable from "react-table";
import { fetchAllUsers } from '../../../actions/users.js';






import Spinner from 'react-spinkit';

import api from '../../../api';

import './AddRoleComponent.css';

const allFields = [
  { name: 'className', label: 'Class Name' },
  { name: 'location', label: 'location' },
  { name: 'district', label: 'district' },
  { name: 'village', label: 'village' },
  { name: 'stationName', label: 'stationName' },
  { name: 'date', label: 'date' },
  { name: 'time', label: 'time' },
  { name: 'tempOut', label: 'tempOut' },
  { name: 'hiTemp', label: 'hiTemp' },
  { name: 'lowTemp', label: 'lowTemp' },
  { name: 'outHum', label: 'outHum' },
  { name: 'dewpt', label: 'dewpt' },
  { name: 'avgWindSpeed', label: 'avgWindSpeed' },
  { name: 'hiWindSpeed', label: 'hiWindSpeed' },
  { name: 'windDir', label: 'windDir' },
  { name: 'bar', label: 'bar' },
  { name: 'rain', label: 'rain' },
  { name: 'rainRate', label: 'rainRate' },
  { name: 'heatDD', label: 'heatDD' },
  { name: 'coolDD', label: 'coolDD' },
  { name: 'leafWet', label: 'leafWet' },
  { name: 'batVlt', label: 'batVlt' },
]

class AddRoleComponent extends Component {

  state = {
    selectedLocation: '',
    selectedField: '',


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


  addLocation = () => {
    if (this.state.selectedLocation == '') {
      alert('Please select the location first to add');
      return;
    }

    this.setState( {  loading: true })

    api.addLocationToUser({
      user_id: this.state.currentUser._id,
      location: this.state.selectedLocation
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

  addField = () => {
    if (this.state.selectedField == '') {
      alert('Please select the field first to add');
      return;
    }
    this.setState( {  loading: true })
    api.addFieldToUser({
      user_id: this.state.currentUser._id,
      fieldName: this.state.selectedField
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
    const locationMenuItems = this.props.allLocations.map((name, idx) => {
      return (  <MenuItem value={name} primaryText={name} key={idx} />  )
    })
    const allFieldsItem = allFields.map((name, idx) => {
      return (  <MenuItem value={name.name} primaryText={name.label} key={idx} />  )
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
          <div>
            <IconButton iconClassName="material-icons" onClick={() => { this.deleteLocation(props.value) }}>delete</IconButton>
          </div>
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
            <IconButton iconClassName="material-icons" onClick={() => { this.deleteField(props.value) }}>delete</IconButton>
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
        <div className="text-center">
          { this.state.loading ? (<Spinner name="double-bounce" style={{ display: 'inline-block' }} />) : '' }
        </div>
        <div className="row">
          <div className="col-md-6">
            <SelectField
              floatingLabelText="Available Locations"
              value={this.state.selectedLocation}
              fullWidth={true}
              onChange={(event, index, value) => { this.setState({ selectedLocation: value }); }}
            >
              { locationMenuItems }
            </SelectField>
            <RaisedButton label="Add Location" primary={true} fullWidth={true} onClick={this.addLocation}></RaisedButton>

            <div className="text-center mt-5">
              <ReactTable
                  data={userLocationsItems}
                  columns={locationColumns}
                  defaultPageSize={7}
                  filterable={true}
                  />
            </div>
            
            
          </div>
          <div className="col-md-6">
            <SelectField
              floatingLabelText="Available Locations"
              value={this.state.selectedField}
              fullWidth={true}
              onChange={(event, index, value) => { this.setState({ selectedField: value }); }}
              >
              { allFieldsItem }
            </SelectField>
            <RaisedButton label="Add Field" primary={true} fullWidth={true} onClick={this.addField}></RaisedButton>

            <div className="text-center mt-5">
              <ReactTable
                  data={userFieldsItem}
                  columns={fieldsColumn}
                  defaultPageSize={7}
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