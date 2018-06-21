const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    
    relations:[{
        weatherStation: {
          type: Schema.Types.ObjectId,
          ref: 'WeatherStation'
        },
        colName: String
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DataPoint', schema);

