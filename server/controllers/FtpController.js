const FtpAccount = require('../models/FtpAccount');
module.exports = {
  create: async (req, res) => {
    try {
      const ftp1 = await FtpAccount.findOne({
        username: req.body.username
      });
      if (ftp1) {
        return res.status(400).json({
          message: 'The account is already exist'
        })
      }
      const ftp2 = await FtpAccount.create({
        username: req.body.username,
        password: req.body.password,
        relative_path: req.body.username
      });

      if (ftp2) {
        return res.json({
          message: 'Successfully created ftp account'
        })
      }

    } catch (err) {
      res.status(400).json({
        message: 'something went wrong'
      })
    }
  },
  delete: async (req, res) => {
    try {
      const ftp1 = await FtpAccount.findOne({ _id: req.body._id });
      if (!ftp1) {
        return res.status(400).json({
          message: 'can not find the ftp account'
        })
      }
      const deletedFtp = await FtpAccount.deleteOne({ _id: req.body._id })
      if (deletedFtp) {
        return res.json({
          message: 'Successfully deleted ftp account'
        })
      }
      return res.status(400).json({
        message: 'can not delete the account'
      })
    } catch (err) {
      res.status(400).json({
        message: 'something went wrong'
      })
    }
  },
  update: async (req, res) => {
    try {
      const ftp1 = await FtpAccount.findOne({ _id: req.body._id });
      if (!ftp1) {
        return res.status(400).json({
          message: 'can not find the ftp account'
        })
      }
      ftp1.username = req.body.username;
      ftp1.password = req.body.password;
      await ftp1.save();
      return res.json({
        message: 'Successfully deleted ftp account'
      })
    } catch (err) {
      res.status(400).json({
        message: 'something went wrong'
      })
    }
  },
  all: async (req, res) => {
    try{
      const ftps = await FtpAccount.find({}).sort({ 'createdAt': -1 });
      return res.json({
        messaage: 'Successfully fetched all account',
        ftps
      });
    } catch(err) {
      res.status(400).json({
        message: 'Something went wrong'
      })
    }
  }
}