const lodash = require('lodash')
const d8a = require('d8a')
const validations = require('waveorb-validations')
const halt = require('./halt.js')

module.exports = function validate($, obj) {
  if (!obj && $ && $.req) {
    obj = $.req.method == 'GET' ? $.query : $.params
  }
  return async function (fields, source) {
    if (!Array.isArray(fields)) fields = [fields]
    if (!source) source = obj

    for (let field of fields) {
      if (typeof field == 'string') {
        field = lodash.get($.app.validations, field.replace(/\./g, '/'))
      }
      if (typeof field == 'function') {
        field = await field($)
      }

      if (!field) continue

      const issues = {}
      let ext = validations($)
      const { locales = {} } = $.app
      const opt = { $, ext, locales, lang: $.lang, lax: true }

      for (const name in field) {
        const spec = lodash.get(field, name)
        const data = lodash.get(source, name)
        const errors = await d8a.validate(spec, data, opt)
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
