var extras = require('extras')
var tools = { ...extras }

// Set up validate
var locales = null
tools.validate = async function (fields, source = {}) {
  var validator = require('./validator.js')
  var i18n = require('./i18n.js')
  var conficurse = require('conficurse')
  locales ??= conficurse.load('app/locales')
  var $ = { app: locales, t: i18n.t() }
  try {
    await validator($, fields, source)
  } catch (e) {
    return e.data
  }
  return {}
}

// Set up markdown
var markdown = null
tools.markdown = function (str) {
  if (typeof markdown == 'function') {
    return markdown(str)
  }
  var tomarkup = require('tomarkup')
  var markdownConfig = extras.env('app/config/markdown')
  markdown = tomarkup({ file: false, ...markdownConfig })
  return markdown(str)
}

module.exports = tools
