module.exports = async $ => {
  if ($.req.pathname == '/middleware') {
    return { hello: 'middle' }
  }
}