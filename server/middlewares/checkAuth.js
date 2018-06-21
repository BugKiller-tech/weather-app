module.exports = function(req, res, next){
  if(!req.session.user) {
    res.status(401).json({
      success: false,
      message: 'You are not logged in'
    })
  }else{
    next();
  }
}