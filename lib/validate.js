var extras = require('extras')
var d8a = require('d8a')
var halt = require('./halt.js')

module.exports = function validate($, obj) {
  if (!obj && $ && $.req) {
    obj = $.req.method == 'GET' ? $.query : $.params
  }
  return async function (fields, source) {
    if (!Array.isArray(fields)) fields = [fields]
    if (!source) source = obj

    for (var field of fields) {
      if (typeof field == 'function') {
        field = await field($)
      }

      if (!field) continue

      var issues = {}
      var { locales = {} } = $.app
      var opt = { $, locales, lang: $.lang, lax: true }

      for (var name in field) {
        var spec = extras.get(field, name)
        var data = extras.get(source, name)
        var errors = await d8a.validate(spec, data, opt)
        if (errors) issues[name] = errors
      }

      if (!extras.isEmpty(issues)) {
        halt('validation error', {
          error: { message: $.t('validation.error') },
          ...issues
        })
      }
    }
  }
}
