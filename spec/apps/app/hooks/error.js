module.exports = async function(error, $) {
  if ($.req.pathname.endsWith('error')) {
    error.something = 'something'
  }
}