module.exports = async $ => {
  $.res.setHeader('Access-Control-Allow-Origin', 'http://localhost')
  $.res.setHeader('Access-Control-Allow-Credentials', 'true')
}
