const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');


const schema = new Schema(
  {
    _id: String,
    className: String,
    location: String,
    district: String,
    village: String,
    stationName: String,
    date: String,
    time: String,
    dateTime: Number,
    tempOut: String,
    hiTemp: String,
    lowTemp: String,
    outHum: String,
    dewpt: String,
    avgWindSpeed: String,
    hiWindSpeed: String,
    windDir: String,
    bar: String,
    rain: String,
    rainRate: String,
    heatDD: String,
    coolDD: String,
    leafWet: String,
    batVlt: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WeatherData', schema, 'weatherdata');

