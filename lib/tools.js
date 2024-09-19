var extras = require('extras')

var tools = { ...extras }

var markdownConfig = null
var markdownTransformer = null

tools.markdown = function (str) {
  var tomarkup = require('tomarkup')
  markdownConfig ??= extras.env('app/config/markdown')
  markdownTransformer ??= tomarkup({ file: false, ...markdownConfig })
  return markdownTransformer(str)
}

module.exports = tools
