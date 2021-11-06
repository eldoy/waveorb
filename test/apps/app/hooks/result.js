module.exports = async function(result, $) {
  if ($.req.pathname.endsWith('result')) {
    result.hello = 'bye'
  }
}