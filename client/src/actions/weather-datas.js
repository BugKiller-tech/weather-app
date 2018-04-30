import * as types from './ActionTypes'
import api from '../api';

export function fetchedAllLocations(allLocations) {
  return {
    type: types.FETCHED_ALL_LOCATIONS,
    allLocations
  }
}




export const fetchAllLocations = () => dispatch => {
  api.fetchAllLocations()
  .then(res => {
    dispatch(fetchedAllLocations(res.data.locations))
  })
  
}
