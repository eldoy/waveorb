var extras = require('extras')
var d8a = require('d8a')
var halt = require('./halt.js')

module.exports = async function validator($, fields, source) {
  var issues = {}
  var { locales = {} } = $.app
  var settings = { $, locales, lang: $.lang, lax: true }

  for (var name in fields) {
    var spec = extras.get(fields, name)
    var data = extras.get(source, name)
    var errors = await d8a.validate(spec, data, settings)
    if (errors) issues[name] = errors
  }

  if (!extras.isEmpty(issues)) {
    var error = {
      error: { message: $.t('validation.error') },
      ...issues
    }
    halt('validation error', error)
  }
}
