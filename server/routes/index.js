var express = require('express');
var router = express.Router();
const path = require('path')

var users = require('./users');
var weatherdatas = require('./weatherdatas');
var ftps = require('./ftps');
var weatherStations = require('./weatherstations');

const checkAuth = require('../middlewares/checkAuth');



router.use('/api/user', users);

router.use(checkAuth)

router.use('/api/data', weatherdatas);
router.use('/api/ftps', ftps);
router.use('/api/weatherstations', weatherStations);




/* GET home page. */
router.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

module.exports = router;
