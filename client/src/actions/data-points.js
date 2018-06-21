import * as types from './ActionTypes'
import api from '../api';

export function fetchedAllDataPoints(dataPoints) {
  return {
    type: types.FETCHED_ALL_DATAPOINTS,
    dataPoints
  }
}




export const fetchAllDataPoints = () => dispatch => {
  api.getAllDatapoints()
  .then(res => {
    dispatch(fetchedAllDataPoints(res.data.dataPoints))
  })
  
}
