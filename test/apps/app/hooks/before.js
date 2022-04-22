module.exports = async function($) {
  if ($.req.pathname.endsWith('before')) {
    $.before = 'before'
  }
}