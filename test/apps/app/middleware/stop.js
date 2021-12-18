module.exports = async (req, res) => {
  if (req.pathname == '/middleware') {
    return { hello: 'middle' }
  }
}