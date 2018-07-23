const DataProcessing = require('../models/DataProcessing');
const commonResponse = require('../utils/commonResponses');

module.exports = {
  getUnpublishedData: async (req, res) => {
    try {
      const data = await DataProcessing.find({ published: { $ne: true }}).populate('station');
      if (data) {
        return res.json({
          message: 'Success',
          data: data,
        })
      }
      return res.json({
        message: 'Success but empty result',
        data: []
      })
    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await DataProcessing.findOne({ _id: req.body._id });
      if (!data) {
        return res.status(400).json({
          message: 'Can not find the data in server'
        })
      }
      await DataProcessing.deleteOne({ _id: req.body._id });
      return res.json({
        message: 'Successfully deleted'
      });


    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }
  },

  deleteAllUnpublished: async (req, res) => {
    try {
      await DataProcessing.remove({ published: false });
      return res.json({
        message: 'Successfully deleted all'
      })
    } catch (err) {
      commonResponse.sendSomethingWentWrong(req, res, err);
    }

  },

  saveAndPublish: async (req, res) => {

    try {
      const data = req.body.data;

      const exceptKeys = ['_id', 'station', 'published', '__v', 'updatedAt', 'createdAt'];
      data.map(async (item) => {
        let dbItem = await DataProcessing.findOne({ _id: item._id });

        if (!dbItem) return;
        const updateValues = {};
        
        Object.keys(item).map(valueKey => {
          if (exceptKeys.includes(valueKey)) { return }
          updateValues[valueKey] = item[valueKey];
        });
        updateValues['published'] = true;
        
        await DataProcessing.findByIdAndUpdate(item._id, updateValues);
      });

      return res.json({
        message: 'Successfully saved and published',
      })
    } catch (err) {
      commonResponse.sendSomethingWentWrong();
    }
  },
}
