import * as types from '../actions/ActionTypes'

const initialAuthState = {
  allLocations: []
};

export default function reducer(state = initialAuthState , action) {

  switch(action.type){
    case types.FETCHED_ALL_LOCATIONS:
      return {
        ...state,
        allLocations: action.allLocations
      }
      break;
    default:
      break;
  }
  return state;
}