module.exports =  {
  sendSomethingWentWrong: (req, res, err) => {
    res.status(400).json({
      message: 'something went wrong'
    })    
  }
}