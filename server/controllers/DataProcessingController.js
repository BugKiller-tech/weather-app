const DataProcessing = require('../models/DataProcessing');
const commonResponse = require('../utils/commonResponses');

module.exports = {
  getUnpublishedData: async (req, res) => {
    try {
      const data = await DataProcessing.find({ published: { $ne: true }}).populate('station');
      res.json({
        message: 'Success',
        data: data,
      })
    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }

  },
}