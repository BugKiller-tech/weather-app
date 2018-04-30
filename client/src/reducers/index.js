import { combineReducers } from 'redux';
import auth from './auth';
import weatherData from './weatherData';


export default combineReducers({
    auth,
    weatherData
});