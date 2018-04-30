import * as types from './ActionTypes'
import api from '../api';

export function userLoggedIn(user) {
  return {
    type: types.USER_LOGGED_IN,
    user
  }
}

export function userLoggedOut() {
  return {
    type: types.USER_LOGGED_OUT
  }
}

export function fetchedAllUsers(users) {
  return {
    type: types.USER_FETCHED_ALL_USERS,
    users
  }
}



export const login = user => dispatch => {
  dispatch(userLoggedIn(user))
  localStorage.user = JSON.stringify(user)
}

export const logout = () => dispatch => {
  localStorage.removeItem('user')
  dispatch(userLoggedOut())
}


export const fetchAllUsers = () => dispatch => {
  api.fetchAllUser()
  .then(res => {
    dispatch(fetchedAllUsers(res.data.users))
  })
  
}
