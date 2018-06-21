import * as types from '../actions/ActionTypes'

const initialState = {
  stations: []
};

export default function reducer(state = initialState , action) {

  switch(action.type){
    case types.FETCHED_ALL_STATIONS:
      return {
        ...state,
        stations: action.stations
      }
    default:
      break;
  }
  return state;
}