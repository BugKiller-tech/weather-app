var express = require('express');
var router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });

const controller = require('../controllers/UserController');

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
})
const deleteUserSchema = Joi.object({
  _id: Joi.string().required(),
})
const updateUserSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string(),
})

const add_deleteLocationSchema = Joi.object({
  user_id: Joi.string().required(),
  location: Joi.string().required(),
})

const add_deleteFieldSchema = Joi.object({
  user_id: Joi.string().required(),
  fieldName: Joi.string().required(),
})

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})


router.post('/register', validator.body(registerUserSchema), controller.register);
router.post('/delete', validator.body(deleteUserSchema), controller.delete);
router.post('/update', validator.body(updateUserSchema), controller.update);
router.get('/all', controller.all);




router.post('/addLocation', validator.body(add_deleteLocationSchema), controller.addLocation);
router.post('/deleteLocation', validator.body(add_deleteLocationSchema), controller.deleteLocation);


router.post('/addField', validator.body(add_deleteFieldSchema), controller.addField);
router.post('/deleteField', validator.body(add_deleteFieldSchema), controller.deleteField);



router.post('/login', validator.body(loginSchema), controller.login);
router.post('/checkLogin', controller.checkLogin);


module.exports = router;
