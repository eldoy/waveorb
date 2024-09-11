module.exports = async function(result, $) {
  if ($.req.pathname.endsWith('after')) {
    result.hello = 'bye'
  }
}