var html6 = require('html6')
var { addHook } = require('pirates')

// var matcher = /return[\S\s]*?`([\S\s]*)`/m
var matcher = /return[\S\s]*?`([\S\s]*?)`/g

function converter(content, name) {
  console.log('CONVERTING', name)
  var matches = [...content.matchAll(matcher)]
  for (var match of matches) {
    var html = html6(match[1])
    console.log({ html })
    content = content.replace(match[1], html)
  }
  console.log(content)
  return content
}

module.exports = function transform() {
  return addHook(converter, { exts: ['.js'] })
}
