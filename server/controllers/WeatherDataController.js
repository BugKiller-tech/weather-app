const WeatherData = require('../models/WeatherData');

module.exports = {
  allLocations: async (req, res) => {
    try {
      const data = await WeatherData.find({}).distinct('location');
      if (data) {
        return res.json({
          message: 'Successfully fetched the data',
          locations: data
        })
      }
    } catch (err) {
      return res.status(400).json({
        message: 'something went wrong'
      })
    }
    
  }, 
  getData: async (req, res) => {
    try {
      const query = { 
        dateTime: { $gte: req.body.startDate, $lte: req.body.endDate } ,
      }
      
      if (req.session.user.locations) {
        query.location = req.session.user.locations
      }

      const data = await WeatherData.find(query).sort({ dateTime: 1, location: 1 }).limit(10000);
      if (data) {
        return res.json({
          message: 'Successfully fetched data',
          data: data
        })
      }
      return res.json({
        message: 'fetched empty data',
        data: []
      })
    } catch(err) {
      res.status(400).json({
        message: 'something went wrong'
      })
    }
    
  }
  
}