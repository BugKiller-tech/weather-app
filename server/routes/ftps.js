var express = require('express');
var router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });

const controller = require('../controllers/FtpController');

const createSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
const deleteSchema = Joi.object({
  _id: Joi.string().required(),
});
const updateSchema = Joi.object({
  _id: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});


router.post('/create', validator.body(createSchema), controller.create);
router.post('/delete', validator.body(deleteSchema), controller.delete);
router.post('/update', validator.body(updateSchema), controller.update);
router.get('/all', controller.all);


module.exports = router;
