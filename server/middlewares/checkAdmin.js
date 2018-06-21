module.exports = function(req, res, next){
  if(!req.session.user || req.session.user.isAdmin) {
    res.status(401).json({
      success: false,
      message: 'You are not admin in'
    })
  }else{
    next();
  }
}