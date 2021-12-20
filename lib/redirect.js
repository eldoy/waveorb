module.exports = function($) {
  return function(location = '/', status = 302) {
    if ($.page) $.page.redirect = true
    $.res.writeHead(status, { location })
    $.res.end()
    return ''
  }
}
