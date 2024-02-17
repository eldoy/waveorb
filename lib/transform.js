var html6 = require('html6')

var matcher = /return[\S\s]*?`([\S\s]*?)`/g

module.exports = function transform(content) {
  var matches = [...content.matchAll(matcher)]
  for (var match of matches) {
    var html = html6(match[1])
    content = content.replace(match[1], html)
  }
  return content
}
