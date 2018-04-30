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
  addLocationToUser: (data) => axios.post('/api/user/addLocation', data), 
  deleteLocationFromUser: (data) => axios.post('/api/user/deleteLocation', data), 

  addFieldToUser: (data) => axios.post('/api/user/addField', data), 
  deleteFieldFromUser: (data) => axios.post('/api/user/deleteField', data), 



  fetchAllLocations: () => axios.get('/api/data/allLocations'),
  fetchData: (data) => axios.post('/api/data/getData', data),

  login: (data) => axios.post('/api/user/login', data),
  checkLogin: () => axios.post('/api/user/checkLogin'),
  

}