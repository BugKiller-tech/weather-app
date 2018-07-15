import axios from 'axios'


const config = {
  headers: {
      'content-type': 'multipart/form-data'
  }
}


export default {
  registerUser: (data) => axios.post('/api/user/register', data),
  updateUser: (data) => axios.post('/api/user/update', data),
  deleteUser: (data) => axios.post('/api/user/delete', data),
  fetchAllUser: () => axios.get('/api/user/all'),

  addLocationsToUser: (data) => axios.post('/api/user/addLocations', data), 
  deleteLocationFromUser: (data) => axios.post('/api/user/deleteLocation', data), 

  addFieldsToUser: (data) => axios.post('/api/user/addFields', data), 
  deleteFieldFromUser: (data) => axios.post('/api/user/deleteField', data), 



  fetchAllLocations: () => axios.get('/api/data/allLocations'),
  fetchData: (data) => axios.post('/api/data/getData', data),

  login: (data) => axios.post('/api/user/login', data),
  checkLogin: () => axios.post('/api/user/checkLogin'),
  

  createFtpAccount: (data) => axios.post('/api/ftps/create', data),
  deleteFtpAccount: (data) => axios.post('/api/ftps/delete', data),
  updateFtpAccount: (data) => axios.post('/api/ftps/update', data),
  getAllFtpAccount: () => axios.get('/api/ftps/all'),


  createWeatherStation: (data) => axios.post('/api/weatherstations/create', data),
  deleteWeatherStation: (data) => axios.post('/api/weatherstations/delete', data),
  updateWeatherStation: (data) => axios.post('/api/weatherstations/update', data),
  getAllWeatherStation: () => axios.get('/api/weatherstations/all'),


  createDataPoint: (data) => axios.post('/api/datapoints/create', data),
  deleteDataPoint: (data) => axios.post('/api/datapoints/delete', data),
  updateDataPoint: (data) => axios.post('/api/datapoints/update', data),
  getAllDatapoints: () => axios.get('/api/datapoints/all'),


  getUnpublishedDataProcessing: () => axios.get('/api/dataprocessings/getUnpublished'),
}