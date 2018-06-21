import * as types from '../actions/ActionTypes'

const initialState = {
  dataPoints: []
};

export default function reducer(state = initialState , action) {
  switch(action.type){
    case types.FETCHED_ALL_DATAPOINTS:
      return {
        ...state,
        dataPoints: action.dataPoints
      }
    default:
      break;
  }
  return state;
}