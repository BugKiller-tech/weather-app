import { combineReducers } from 'redux';

import auth from './auth';
import weatherData from './weatherData';
import ftps from './ftps';
import stations from './stations';


export default combineReducers({
    auth,
    weatherData,
    ftps,
    stations,
});