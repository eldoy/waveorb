module.exports = async function($) {
  if ($.req.pathname.endsWith('dispatch')) {
    $.dispatch = 'dispatch'
  }
}