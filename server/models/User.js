const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const schema = new Schema({
  name: String,
  username: String,
  passwordHash: String,
  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WeatherStation'
    }
  ],
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'DataPoint'
    }
  ]
}, {timestamps: true});

schema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.setPassword = function (password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
  console.log(this);
}

module.exports = mongoose.model('User', schema);