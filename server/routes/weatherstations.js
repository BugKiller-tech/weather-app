var express = require('express');
var router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });

const controller = require('../controllers/WeatherStationController');

const createSchema = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  make: Joi.string().required(),
  type: Joi.string().required(),
  csv_data_format: Joi.string().required(),
});
const deleteSchema = Joi.object({
  _id: Joi.string().required(),
});
const updateSchema = Joi.object({
  _id: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  make: Joi.string().required(),
  type: Joi.string().required(),
  csv_data_format: Joi.string().required(),
});


router.post('/create', validator.body(createSchema), controller.create);
router.post('/delete', validator.body(deleteSchema), controller.delete);
router.post('/update', validator.body(updateSchema), controller.update);
router.get('/all', controller.all);


module.exports = router;
