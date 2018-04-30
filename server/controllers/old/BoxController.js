const Box = require('../models/Box');
const NewDevice = require('../models/NewDevice');


module.exports = {
  register: async (req, res) => {
    // console.log(req.body);    
    try {

      const existBox = await Box.findOne({ stockId: req.body.stockId, name: req.body.name });
      if (existBox) {
        return res.status(400).json({
          message: 'Already exist the box with same name'
        })
      }



      const box = await Box.create(req.body);
      if (box) {
        return res.json({
          message: 'Successfully created',
          box
        })
      } else {
        return res.status(400).json({
          message: 'can not create the box',
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
      const box = await Box.deleteOne({ _id: req.body._id })
      return res.json({
        message: 'Success',
        box
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  appendDevice: async(req, res) => {
    try {
      const box = await Box.update({ _id: req.body.boxId }, {$addToSet: { deviceIds: req.body.deviceId }}, { new: true })
      return res.json({
        message: 'Successfully added',
        box
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  removeDevice: async(req, res) => {
    try {
      await Box.update({ _id: req.body.boxId }, { $pullAll: { deviceIds: [req.body.deviceId] } })
      return res.json({
        message: 'Successfully removed device from box'
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  fetchDevices: async (req, res) => {
    try {
      const boxs = await Box.findOne({ _id: req.body.boxId });
      
      if (boxs && boxs.deviceIds) {
        return res.json({
          message: 'Fetched successfully',
          deviceIds: boxs.deviceIds
        })
      } else {
        return res.json({
          message: 'Fetched successfully',
          deviceIds: []
        })
      }
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  updateSpaceValue: async(req, res) => {
    try {
      const box = await Box.findOne({ deviceIds: {"$in": [req.query.deviceId]} });
      if (!box) {

        // register the id temporarily

        const newDevice = await NewDevice.findOne({ deviceId: req.query.deviceId })
        if (!newDevice) {
          await NewDevice.create({ deviceId: req.query.deviceId  })
        }


        return res.status(400).json({
          message: 'Can not find box registered this device'
        })
      }
      
      var added = false;
      if (box.spaces) {
        box.spaces = box.spaces.map(space => {
          if (space.deviceId == req.query.deviceId && space.spaceName == req.query.spaceName) {
            space.amount = req.query.amount;
            added = true;
          }
          return space;
        })
      } else {
        box.spaces = []
      }

      if (!added) {
        box.spaces.push({
          deviceId: req.query.deviceId,
          spaceName: req.query.spaceName,
          displayName: req.query.deviceId + '_' + req.query.spaceName,
          amount: req.query.amount
        })
      }
      await box.save();

      return res.json({ 
        box
      });
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
    // await Box.update({
    //     deviceIds: {"$in": [req.body.deviceId]}
    // },
    // {
      
    // })
  },

  all: async (req, res) => {
    try {
      const boxs = await Box.find({});
      return res.json({
        message: 'Fetched successfully',
        boxs
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  boxsForStock: async (req, res) => {
    try {
      const boxs = await Box.find({ stockId: req.body.stockId })
      return res.json({
        message: `Fetched boxs inside stock`,
        boxs
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  clearNewDevices: async (req, res) => {
    try {
      await NewDevice.remove({})
      message: 'Successfully removed'
    } catch (err) {
      res.status(400).json({
        message: 'Something went wrong!'
      })
    }
    
  }
}