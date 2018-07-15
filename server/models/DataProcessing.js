const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    station: {
      type: Schema.Types.ObjectId,
      ref: 'WeatherStation'
    },
    // blablabla,
    published: {
      type: Schema.Types.Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('DataProcessing', schema);

