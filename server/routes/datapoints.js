var express = require('express');
var router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });

const controller = require('../controllers/DataPointController');

const createSchema = Joi.object({
  name: Joi.string().required(),
  desc: Joi.string().required(),
  isChartDispElement: Joi.boolean(),
  relations: Joi.array().required(),
});
const deleteSchema = Joi.object({
  _id: Joi.string().required(),
});
const updateSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  desc: Joi.string().required(),
  isChartDispElement: Joi.boolean(),
  relations: Joi.array().required(),
});


router.post('/create', validator.body(createSchema), controller.create);
router.post('/delete', validator.body(deleteSchema), controller.delete);
router.post('/update', validator.body(updateSchema), controller.update);
router.get('/all', controller.all);


module.exports = router;
