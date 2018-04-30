import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Paper, TextField, RaisedButton, Snackbar, Divider, IconButton, Dialog, FlatButton } from 'material-ui';
import ReactTable from "react-table";
import 'react-table/react-table.css'

import { connect } from 'react-redux';
import { fetchAllUsers } from '../../../actions/users';
import { fetchAllLocations } from '../../../actions/weather-datas';


import Spinner from 'react-spinkit';

import AddRoleComponent from './AddRoleComponent';


import api from '../../../api';

class RegisterUser extends Component {

  state = {
    name: '',
    username: '',
    password: '',
    errors: {},

    selectedUserId: '',
    selectedUserObject: {},
    isEditMode: false,

    snackbarOpen: false,
    snackMessage: '',
    loading: false,


    isOpenModal: false,
  }

  componentDidMount = () => {
    this.fetchAllUsers()
  }

  fetchAllUsers = () => {
    this.props.fetchAllUsers();
    this.props.fetchAllLocations();
  }

  deleteUser = (_id) => {
    if (!window.confirm('Do you want to delete this account?')) { return }

    api.deleteUser({ _id })
    .then(res => {
      this.fetchAllUsers();
    })
    .catch(err => {
    })
  }
  
  editUser = (_id) => {
    this.props.users.filter(user => {
      if (user._id == _id) {
        this.setState({
          name: user.name,
          username: user.username,
          password: '',
          
          selectedUserId: _id,
          isEditMode: true,
          errors: {}
        });

      }
    })
  }
  cancelEdit = () => {
    this.setState({
      name: '',
      username: '',
      password: '',
      selectedUserId: '',
      isEditMode: false,
      errors: {}
    })
  }

  addRole = (_id) => {
    this.props.users.filter(user => {
      if (user._id == _id) {
        this.setState({
          selectedUserId: _id,
          selectedUserObject: user,
          isOpenModal: true
        })
      }
    })

  }
  dismissDialog = () => {
    this.setState({
      selectedUserId: '',
      isOpenModal: false
    })
  }

  onSubmit = () => {
    const errors = {}

    if (this.state.name == '' ) { errors.name = 'Please provide name' }
    if (this.state.username == '' ) { errors.username = 'Please provide username' }
    if (!this.state.isEditMode && this.state.password == '' ) { errors.password = 'Please provide password' }

    this.setState({ errors });
    if (Object.keys(errors).length > 0 ) { return }

    this.setState({ loading: true})
    if (this.state.isEditMode) {
      const data = {
        name: this.state.name,
        username: this.state.username,
        _id: this.state.selectedUserId,
      }
      if (this.state.password) { data.password = this.state.password }

      api.updateUser(data)
      .then(res => {
        this.setState({
          name: '',
          username: '',
          password: '',
          errors: {},
          isEditMode: false,
          selectedUserId: '',

          snackMessage: 'Successfully updated account!',
          snackbarOpen: true,
          loading: false
        })
        this.fetchAllUsers();
      })
      .catch(err => {
        console.log(err.response)
        this.setState({ 
          loading: false,
          snackMessage: err.response.data.message,
          snackbarOpen: true        
        })
      })
      .catch(err => {
        console.log(err.response)
        this.setState({ 
          loading: false,
          snackMessage: err.response.data.message,
          snackbarOpen: true        
        })
      })
    } else {
      api.registerUser({
        name: this.state.name,
        username: this.state.username,
        password: this.state.password
      })
      .then(res => {
        this.setState({
          name: '',
          username: '',
          password: '',
          errors: {},
          snackMessage: 'Successfully registered',
          snackbarOpen: true,
          loading: false
        })
        this.fetchAllUsers();
      })
      .catch(err => {
        console.log(err.response)
        this.setState({ 
          loading: false,
          snackMessage: err.response.data.message,
          snackbarOpen: true        
        })
      })
    }
  }

  render () {
    const { errors, isEditMode } = this.state;
    const users = this.props.users;

    const userColumns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'User Name',
        accessor: 'username'
      },
      {
        Header: 'Action',
        accessor: '_id',
        Cell: props => 
          <div>
            <IconButton iconClassName="material-icons" onClick={() => { this.deleteUser(props.value) }}>delete</IconButton>
            <IconButton iconClassName="material-icons" onClick={() => { this.editUser(props.value) }}>mode_edit</IconButton>
            <IconButton iconClassName="material-icons" onClick={() => { this.addRole(props.value) }}>playlist_add</IconButton>
          </div>
      }
    ]

    return (

      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4">
            <Paper style={{ minHeight: '80vh', padding: '20px' }}>
            { isEditMode ? (<h3>Edit Account</h3>) : (<h3>Register New Account</h3>) }
              
              <div>
                <div>
                  <TextField 
                    hintText="Name" floatingLabelText="Name" 
                    name="name" 
                    errorStyle= {{ float: "left" }}
                    errorText = { errors.name ? errors.name : '' }
                    onChange={ (e) => { this.setState({ name: e.target.value, errors: {} }) } }
                    value={this.state.name}
                    fullWidth={true}
                    />
                  <TextField 
                    hintText="User Name" type="text" floatingLabelText="User Name" 
                    name="username" 
                    errorStyle= {{ float: "left" }}
                    errorText = { errors.username ? errors.username : '' }
                    onChange={ (e) => { this.setState({ username: e.target.value }) } } 
                    value={this.state.username}
                    fullWidth={true}
                    />
                  <TextField 
                    hintText="Password" type="text" floatingLabelText="Password" 
                    name="password" 
                    errorStyle= {{ float: "left" }}
                    errorText = { errors.password ? errors.password : '' }
                    onChange={ (e) => { this.setState({ password: e.target.value }) } } 
                    value={this.state.password}
                    fullWidth={true}
                    />
                    <div className="text-center mt-3">
                      <RaisedButton label={ isEditMode ? 'Save Changes' : 'Register Account' } primary={true} onClick={this.onSubmit} /> &nbsp; &nbsp;
                      { isEditMode ? <RaisedButton label="Cancel" primary={false} onClick={ this.cancelEdit } /> : '' }
                      <br/>
                      { this.state.loading ? (<Spinner name="wave" style={{ display: 'inline-block' }} />) : '' }
                  </div>
                </div>

                <Snackbar
                  open={this.state.snackbarOpen}
                  message={this.state.snackMessage}
                  autoHideDuration={5000}
                  onRequestClose={() => { this.setState({ snackbarOpen: false }) }}
                />
              </div>
            </Paper>
          </div>
          <div className="col-md-8">
            <Paper  style={{ minHeight: '80vh', padding: '20px' }}>
              <h3>All Users</h3>
              
              <ReactTable
                data={users}
                columns={userColumns}
                defaultPageSize={10}
                filterable={true}
                />
            </Paper>
          </div>
        </div>


        <Dialog
          title="Add Account Permission"
          actions = {[
            <FlatButton
              label="Close"
              primary={true}
              onClick={this.dismissDialog}
            />
          ]}
          modal={false}
          autoScrollBodyContent={true}
          open={this.state.isOpenModal}
          onRequestClose={this.dismissDialog}
        >
          <AddRoleComponent user={this.state.selectedUserObject} />         
        </Dialog>
      </div>


      
    )
  }
}

RegisterUser.propTypes = {
  fetchAllUsers: PropTypes.func.isRequired,
  fetchAllLocations: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    users: state.auth.users
  }
}

export default connect(mapStateToProps, { fetchAllUsers, fetchAllLocations })(RegisterUser) 