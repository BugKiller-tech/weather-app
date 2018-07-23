var express = require('express');
var router = express.Router();
const path = require('path')

var users = require('./users');
var weatherdatas = require('./weatherdatas');
var ftps = require('./ftps');
var weatherStations = require('./weatherstations');
var datapoints = require('./datapoints');
var dataprocessigns = require('./dataprocessings');

const checkAuth = require('../middlewares/checkAuth');



router.use('/api/user', users);

router.use(checkAuth)

router.use('/api/data', weatherdatas);
router.use('/api/ftps', ftps);
router.use('/api/weatherstations', weatherStations);
router.use('/api/datapoints', datapoints);
router.use('/api/dataprocessings', dataprocessigns);



/* GET home page. */
router.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'))
});

module.exports = router;
