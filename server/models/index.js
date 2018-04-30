const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const dbConfig = require('../config/db');
const moment = require('moment');

const url = dbConfig.MONGODB_URL;


const WeatherData = require('./WeatherData');

module.exports = function() {
  console.log('Trying to connect to server now....');
  mongoose.connect(url)
  mongoose.connection.once('open', async () => {
    console.log('Connected to server.... :)');

    
      // console.log('start convert......')
      // try{
      //   const datas = await WeatherData.find({});
        
      //   for (var i=0; i< datas.length; i++) {
      //     const dateTime = moment(datas[i].date + ' ' + datas[i].time, 'DD/MM/YY HH/mm').unix();
      //     datas[i].dateTime = dateTime
      //     await datas[i].save();
      //     console.log(`processed ${i} count...`)
      //   }
      //   console.log('update ended:):):)')

      // } catch (err) {
      //   console.log('catch block')
      //   console.log(err);
      // }


  })
  
}