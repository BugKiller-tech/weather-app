const DataPoint = require('../models/DataPoint');
const commonResponse = require('../utils/commonResponses');

module.exports = {
  removeDuplicates: () => {

  },


  create: async (req, res) => {
    try {
      const item1 = await DataPoint.findOne({ name: req.body.name });
      if (item1) {
        return res.status(400).json({
          message: 'This name is already taken'
        })
      }

      const newItem = await DataPoint.create({
        name: req.body.name,
        desc: req.body.desc,
        isChartDispElement: req.body.isChartDispElement,
        relations: req.body.relations
      })

      return res.json({
        message: 'Successfully created the data point'
      })


    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }

  },
  update: async (req, res) => {
    try {
      const dataPoint = await DataPoint.findOne({ _id: req.body._id })
      if (!dataPoint) {
        return res.json({
          message: 'Can not find the data point'
        })
      }

      dataPoint.name = req.body.name;
      dataPoint.desc = req.body.desc;
      dataPoint.isChartDispElement = req.body.isChartDispElement;
      dataPoint.relations = req.body.relations;

      await dataPoint.save();

      return res.json({
        message: 'Successfully updated the data point'
      })

    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }

  },
  delete: async (req, res) => {
    try {
      const dataPoint = await DataPoint.findOne({ _id: req.body._id })
      if (!dataPoint) {
        return res.json({
          message: 'Can not find the data point'
        })
      }

      await DataPoint.deleteOne({ _id: req.body._id });

      return res.json({
        message: 'Successfully updated the data point'
      })
    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }

  },
  all: async (req, res) => {
    try {
      const dataPoints = await DataPoint.find({}).sort({ 'createdAt': -1 });
      return res.json({
        message: 'Successfully fetched all data points',
        dataPoints
      })
    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }
  }
}