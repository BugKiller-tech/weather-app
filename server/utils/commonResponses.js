module.exports = {
  sendSomethingWentWrong: (req, res, err) => {
    return res
      .status(400)
      .json({message: 'something went wrong'})
  }
}