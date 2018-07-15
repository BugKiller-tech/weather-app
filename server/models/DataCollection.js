const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    station: {
      type: Schema.Types.ObjectId,
      ref: 'WeatherStation'
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('DataCollection', schema);

