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
  

}