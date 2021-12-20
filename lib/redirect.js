module.exports = function($) {
  return function(location = '/', status = 302) {
    if ($.page) $.page.redirect = true
    $.res.statusCode = status
    $.res.setHeader('location', location)
    return ''
  }
}
