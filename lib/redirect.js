module.exports = function($) {
  return function(location = '/', status = 302) {
    $.res.writeHead(status, { location })
    $.res.end()
    return ''
  }
}
