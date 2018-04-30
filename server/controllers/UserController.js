const User = require('../models/User');
const superadminInfo = require('../config/superadmin');

module.exports = {
  register: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({
          message: 'there is user that has same username'
        })
      }
      const newUser = await User.create(req.body);
      newUser.setPassword(req.body.password)
      await newUser.save();

      if (newUser) {
        return res.json({
          message: 'Successfully registered new account'
        });
      }
      return res.status(400).json({
        message: 'Can not make the account'
      })
    } catch(err) {
      res.status.json({
        message: 'Something went wrong'
      })
    }   
  },

  delete: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body._id });
      if (!user) {
        return res.status(400).json({
          message: 'can not find like this user'
        })
      }
      const deleteduser = await User.deleteOne({ _id: req.body._id })
      if (deleteduser) {
        return res.json({
          message: 'Successfully deleted account'
        });
      }
      return res.status(400).json({
        message: 'Can not delete the account'
      })
    } catch(err) {
      res.status.json({
        message: 'Something went wrong'
      })
    }   
  },

  update: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body._id });
      if (!user) {
        return res.status(400).json({
          message: 'can not find like this user'
        })
      }
      const data = Object.assign({}, req.body);
      delete data._id;
      
      user.username = req.body.username;
      user.name = req.body.name;

      if (req.body.password) {
        user.setPassword(req.body.password)
      }
      await user.save();
      return res.json({
        message: 'Successfully updated account'
      });
 
    } catch(err) {
      res.status.json({
        message: 'Something went wrong'
      })
    }   
  },


  all: async (req, res) => {
    try {
      const users = await User.find({}).sort({'createdAt': -1});
      return res.json({
        message: 'Successfully fetched users',
        users
      })
      
    } catch(err) {
      res.status.json({
        message: 'Something went wrong'
      })
    }   
  },





  addLocation: async (req, res) => {
    try {
      const newUser = await User.update({ _id: req.body.user_id }, {$addToSet: { locations : req.body.location }}, { new: true })
      const user = await User.findOne({ _id: req.body.user_id});
      return res.json({
        message: 'Successfully added',
        locations: user.locations
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  deleteLocation: async (req, res) => {
    try {
      const newUser = await User.update({ _id: req.body.user_id },  { $pullAll: { locations: [req.body.location] } }, { new: true })
      const user = await User.findOne({ _id: req.body.user_id});
      return res.json({
        message: 'Successfully removed',
        locations: user.locations
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },



  addField: async (req, res) => {
    try {
      const newUser = await User.update({ _id: req.body.user_id }, {$addToSet: { fields : req.body.fieldName }}, { new: true })
      const user = await User.findOne({ _id: req.body.user_id});
      return res.json({
        message: 'Successfully added',
        fields: user.fields
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },

  deleteField: async (req, res) => {
    try {
      const newUser = await User.update({ _id: req.body.user_id },  { $pullAll: { fields: [req.body.fieldName] } }, { new: true })
      const user = await User.findOne({ _id: req.body.user_id});
      return res.json({
        message: 'Successfully removed',
        fields: user.fields
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }
  },





  login: async(req, res) => {
    if (req.body.username == superadminInfo.username && req.body.password == superadminInfo.password) {
      // this is the super admin
      req.session.user = {
        username: superadminInfo.username,
        isAdmin: true
      }
      return res.json({
        message: 'logged in',
        user: req.session.user
      })
    }

    try {
      const user = await User.findOne({ username: req.body.username })
      if (user) {
        
        if (user.isValidPassword(req.body.password)) {
          req.session.user = user;
          const data = user;
          data.isAdmin = false;
          delete data.passwordHash;
          return res.json({
            message: 'logged in with account',
            user: data
          })
        } else {
          return res.status(400).json({
            message: 'The credential is incorrect'
          })

        }
      }

      return res.status(400).json({
        message: 'Wrong credentials'
      })

    } catch(err) {
      console.log(err);
      res.status(400).json({
        message: 'something went wrong'
      })
    }
    
  },


  checkLogin: async(req, res) => {
    if (req.session.user) {
      return res.json({
        message: 'logged in status',
        username: req.session.user.username,
        isAdmin: req.session.user.isAdmin,
      })
    }

    return res.status(400).json({
      message: 'not logged in status'
    })
  }

  
    
}