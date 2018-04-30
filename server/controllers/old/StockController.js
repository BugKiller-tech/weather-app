const Stock = require('../models/Stock');


module.exports = {
  register: async (req, res) => {
    // console.log(req.body);    
    try {

      const checkStock = await Stock.findOne({ name: req.body.name });

      if (checkStock) {
        return res.status(400).json({
          message: 'Already exist same stock'
        })
      }

      const stock = await Stock.create(req.body);
      if (stock) {
        return res.json({
          message: 'Successfully created',
          stock: stock
        })
      } else {
        return res.status(400).json({
          message: 'can not create the stock',
          stock: null
        })
      }
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },
  delete: async (req, res) => {
    try {
      const stock = await Stock.remove({ _id: req.body._id })
      return res.json({
        message: 'Success',
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },
  all: async (req, res) => {
    try {
      const stocks = await Stock.find({});
      return res.json({
        message: 'Fetched successfully',
        stocks
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }

  },
}