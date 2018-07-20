import React, {Component} from 'react'
import {PropTypes} from 'prop-types';

import {connect} from 'react-redux';
import {
  SelectField,
  MenuItem,
  RaisedButton,
  List,
  ListItem,
  IconButton,
  FontIcon
} from 'material-ui';
import ReactTable from "react-table";
import {fetchAllUsers} from '../../../actions/users.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Spinner from 'react-spinkit';
import api from '../../../api';
import './AddRoleComponent.css';

class AddRoleComponent extends Component {

  state = {
    selectedLocations: [],
    selectedFields: [],

    currentUser: {},
    locations: [],
    fields: [],

    loading: false,
    errors: {}
  }

  componentDidMount = () => {
    this.setState({currentUser: this.props.user, locations: this.props.user.locations, fields: this.props.user.fields})
  }

  updateUsers = () => {
    this
      .props
      .fetchAllUsers();
  }

  addLocations = () => {
    if (this.state.selectedLocations.length == 0) {
      alert('Please select the location first to add');
      return;
    }

    this.setState({loading: true})

    api
      .addLocationsToUser({
      user_id: this.state.currentUser._id,
      locations: this
        .state
        .selectedLocations
        .map(data => data.value)
    })
      .then(res => {
        this.setState({locations: res.data.locations, selectedLocations: [], loading: false})
        this.updateUsers();
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }
  deleteLocation = (id) => {
    if (!window.confirm('Do you want to remove this location from this account?')) {
      return
    }
    alert(id);

    this.setState({loading: true})
    api
      .deleteLocationFromUser({user_id: this.state.currentUser._id, location: id})
      .then(res => {
        this.setState({locations: res.data.locations, loading: false})
        this.updateUsers();
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }

  addFields = () => {
    if (this.state.selectedFields.length == 0) {
      alert('Please select the field first to add');
      return;
    }

    this.setState({loading: true})
    api
      .addFieldsToUser({
      user_id: this.state.currentUser._id,
      fieldIds: this
        .state
        .selectedFields
        .map(field => field.value)
    })
      .then(res => {
        this.setState({fields: res.data.fields, selectedFields: [], loading: false})
        this.updateUsers();
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }
  deleteField = (_id) => {
    if (!window.confirm('Do you want to remove this field from this account?')) {
      return
    }

    this.setState({loading: true})
    api
      .deleteFieldFromUser({user_id: this.state.currentUser._id, fieldId: _id})
      .then(res => {
        this.setState({fields: res.data.fields, loading: false})
        this.updateUsers();
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }

  render() {
    const allLocationsOption = this
      .props
      .allWeatherStations
      .map((item, idx) => {
        return {value: item._id, label: item.code}
      });

    const user = this.state.currentUser;
    const {locations, fields} = this.state;

    const locationColumns = [
      {
        Header: 'Location',
        accessor: 'label'
      }, {
        Header: 'Action',
        accessor: '_id',
        maxWidth: 100,
        Cell: props => <i
            className="material-icons"
            style={{
            cursor: 'pointer'
          }}
            onClick={() => {
            this.deleteLocation(props.value)
          }}>delete_forever</i>
      }
    ]

    console.log('current user locations', locations);
    const userLocationsItems = locations.map((item, idx) => {
      return {label: item.code, _id: item._id}
    })

    const fieldsColumn = [
      {
        Header: 'Field',
        accessor: 'label'
      }, {
        Header: 'Action',
        accessor: 'value',
        maxWidth: 100,
        Cell: props => <i
            className="material-icons"
            style={{
            cursor: 'pointer'
          }}
            onClick={() => {
            this.deleteField(props.value)
          }}>delete_forever</i>
      }
    ]

    const userFieldsItem = fields.map((item, idx) => {
      return {label: item.name, value: item._id}
    });

    const allFields = this
      .props
      .allDataPoints
      .map(item => {
        return {value: item._id, label: item.name}
      })

    return (
      <div className="AddRoleComponent p-1">
        <div className="user-info">
          User Name:
          <strong>{user.username}
          </strong>
        </div>
        {this.state.loading && (
          <div className="loading-indicator">
            <Spinner
              name="double-bounce"
              style={{
              display: 'inline-block'
            }}/>
          </div>
        )}
        <div className="row">
          <div className="col-md-6">
            <Select
              name="form-locations"
              className="mt-3 mb-3"
              value={this.state.selectedLocations}
              onChange={(selectedFields) => {
              this.setState({selectedLocations: selectedFields})
            }}
              multi={true}
              options={allLocationsOption}/>

            <RaisedButton
              label="Add Location"
              primary={true}
              fullWidth={true}
              onClick={this.addLocations}></RaisedButton>

            <div className="text-center mt-2">
              <ReactTable
                data={userLocationsItems}
                columns={locationColumns}
                defaultPageSize={5}
                filterable={true}/>
            </div>

          </div>
          <div className="col-md-6">
            <Select
              name="form-fields"
              className="mt-3 mb-3"
              value={this.state.selectedFields}
              onChange={(selectedFields) => {
              this.setState({selectedFields: selectedFields})
            }}
              multi={true}
              options={allFields}/>
            <RaisedButton
              label="Add Field"
              primary={true}
              fullWidth={true}
              onClick={this.addFields}></RaisedButton>

            <div className="text-center mt-2">
              <ReactTable
                data={userFieldsItem}
                columns={fieldsColumn}
                defaultPageSize={5}
                filterable={true}/>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

AddRoleComponent.propTypes = {
  user: PropTypes.object.isRequired,
  fetchAllUsers: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    // allLocations: state.weatherData.allLocations,
    allWeatherStations: state.stations.stations,
    allDataPoints: state.dataPoints.dataPoints
  }
}

export default connect(mapStateToProps, {fetchAllUsers})(AddRoleComponent);