import React, { Component } from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './style.css'
import { Paper, CircularProgress, Snackbar } from 'material-ui';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/users';

import api from '../../api';

class Login extends Component {

  state = {
    username: '',
    password: '',

    loading: false,
    errors: {},


    snackbarOpen: false,
    snackMessage: '',
  };
  
  valueChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  isValidateInput = () => {
    const errors = {}
    if (this.state.username == '') {
      errors.username = 'Username can not be blank'
    }
    if (this.state.password == '') {
      errors.password = 'Password can not be blank'
    }
    this.setState({
      errors
    })
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
  }

  onLogin = () => {
    if (!this.isValidateInput()) { return; }


    this.setState({ loading: true })
    api.login({
      username: this.state.username,
      password: this.state.password
    })
    .then(res => {

      this.props.login(res.data.user);

      this.setState({ 
        loading: false ,
        snackbarOpen: true,
        snackMessage: 'Successfully logged in'
      })
      
      this.props.history.push('/dashboard');

    })
    .catch(err => {
      this.setState({ 
        snackbarOpen: true,
        snackMessage: err.response.data.message,
        loading: false
       })
    })
    
  }
  render () {

    const style = {
      button: {
        margin: '0 auto',
        display: 'block'
      }
    }

    const { errors } = this.state;

    return (
      <div className='login'>
        <Paper className='login-box' zDepth={3}>
          <div className='text-center'><h2>WeatherAdda</h2></div>
          <TextField
            hintText="Username"
            errorText={ errors.email ? errors.email : '' }
            fullWidth={true}
            name='username'
            type='text'
            value={this.state.username}
            onChange={this.valueChange}
            /> <br/>
          <TextField
            hintText="Password"
            errorText={ errors.password ? errors.password : '' }
            fullWidth={true}
            name='password'
            type='password'
            onChange={this.valueChange}
            /> <br/>
          <RaisedButton label="Log In" primary={true} style={style.button} onClick={this.onLogin} /> <br/>
          { this.state.loading ? <CircularProgress /> : '' }
        </Paper>



        <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackMessage}
            autoHideDuration={5000}
            onRequestClose={() => { this.setState({ snackbarOpen: false }) }}
          />
      </div>
    )
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
}


export default connect(null, { login })(Login);