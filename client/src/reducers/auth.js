import * as types from '../actions/ActionTypes'

const initialAuthState = {
  user: null,
  users: []
};

export default function reducer(state = initialAuthState , action) {

  switch(action.type){
    case types.USER_LOGGED_IN:
      return {
        ...state,
        user: action.user
      }
      break;
    case types.USER_LOGGED_OUT:
      return {
        ...state,
        user: null
      }
      break;
    case types.USER_FETCHED_ALL_USERS:
      return {
        ...state,
        users: action.users
      }
      break;
    default:
      break;
  }
  return state;
}