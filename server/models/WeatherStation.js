const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// id, code, description, location, make, date, type, relative folder path, csv data format.

const schema = new Schema(
  {
    code: String,
    description: String,
    location: String,
    make: String,
    type: String,
    // relative_path: String,
    csv_data_format: String,
    ftp: {
      type: Schema.Types.ObjectId,
      ref: 'FtpAccount'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WeatherStation', schema);

