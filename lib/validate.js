var lodash = require('lodash')
var d8a = require('d8a')
var validations = require('waveorb-validations')
var halt = require('./halt.js')

module.exports = function validate($, obj) {
  if (!obj && $ && $.req) {
    obj = $.req.method == 'GET' ? $.query : $.params
  }
  return async function (fields, source) {
    if (!Array.isArray(fields)) fields = [fields]
    if (!source) source = obj

    for (var field of fields) {
      if (typeof field == 'string') {
        field = lodash.get($.app.validations, field.replace(/\./g, '/'))
      }
      if (typeof field == 'function') {
        field = await field($)
      }

      if (!field) continue

      var issues = {}
      var ext = validations($)
      var { locales = {} } = $.app
      var opt = { $, ext, locales, lang: $.lang, lax: true }

      for (var name in field) {
        var spec = lodash.get(field, name)
        var data = lodash.get(source, name)
        var errors = await d8a.validate(spec, data, opt)
        if (errors) issues[name] = errors
      }

      if (!lodash.isEmpty(issues)) {
        halt('validation error', {
          error: { message: $.t('validation.error') },
          ...issues
        })
      }
    }
  }
}
