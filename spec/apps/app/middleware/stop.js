module.exports = async function(req, res) {
  if (req.pathname == '/middleware') {
    return { hello: 'middle' }
  }
}