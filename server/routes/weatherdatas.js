var express = require('express');
var router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });

const controller = require('../controllers/WeatherDataController');


const getDataSchema = Joi.object({
  // startDate: Joi.number().required(),
  // endDate: Joi.number().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
})

router.get('/allLocations', controller.allLocations);
router.post('/getData', validator.body(getDataSchema), controller.getData);


module.exports = router;
