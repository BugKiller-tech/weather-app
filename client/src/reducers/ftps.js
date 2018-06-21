import * as types from '../actions/ActionTypes'

const initialAuthState = {
  ftps: []
};

export default function reducer(state = initialAuthState , action) {
  switch(action.type){
    case types.FETCHED_ALL_FTP_ACCOUNTS:
      return {
        ...state,
        ftps: action.ftps
      }
    default:
      break;
  }
  return state;
}