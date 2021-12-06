module.exports = async function(req, res) {
  if (req.pathname.endsWith('/asset.txt')) {
    return 'hello'
  }
}