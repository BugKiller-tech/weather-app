import * as types from './ActionTypes';
import api from '../api';

export function fetchedAllWeatherStations(stations) {
  return {
    type: types.FETCHED_ALL_STATIONS,
    stations,
  }
}







export const fetchAllWeatherStations = () => dispatch => {
  api.getAllWeatherStation()
  .then(res => {
    console.log('all weather station is..', res.data);
    dispatch(fetchedAllWeatherStations(res.data.stations))
  })    
}