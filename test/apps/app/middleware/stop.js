module.exports = async (req, res) => {
  console.log(req.pathname)
  if (req.pathname == '/middleware') {
    return { hello: 'middle' }
  }
}