var express = require('express');
var router = express.Router();
const path = require('path')

var users = require('./users');
var weatherdatas = require('./weatherdatas');

const checkAuth = require('../middlewares/checkAuth');



router.use('/api/user', users);

router.use(checkAuth)

router.use('/api/data', weatherdatas);





/* GET home page. */
router.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

module.exports = router;
