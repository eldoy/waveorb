module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
}
