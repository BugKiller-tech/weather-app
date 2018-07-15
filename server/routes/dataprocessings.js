var express = require('express');
var router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });
const controller = require('../controllers/DataProcessingController');

const checkAdmin = require('../middlewares/checkAdmin');






const createSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});


router.use(checkAdmin);


router.get('/getUnpublished', controller.getUnpublishedData);
// router.post('/getUpu', validator.body(createSchema), controller.create);
// router.post('/delete', validator.body(deleteSchema), controller.delete);
// router.post('/update', validator.body(updateSchema), controller.update);
// router.get('/all', controller.all);


module.exports = router;
