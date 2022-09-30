const _ = require('lodash')
const d8a = require('d8a')
const validations = require('waveorb-validations')
const halt = require('./halt.js')

module.exports = function validate($, obj) {
  if (!obj) obj = $.req.method == 'GET' ? $.query : $.params
  return async function (fields) {
    const issues = {}
    let ext = validations($)
    const { locales = {} } = $.app
    const opt = { $, ext, locales, lax: true }

    for (const name in fields) {
      const spec = _.get(fields, name)
      const data = _.get(obj, name)
      const errors = await d8a.validate(spec, data, opt)
      if (errors) {
        issues[name] = errors
      }
    }

    if (!_.isEmpty(issues)) {
      halt('validation error', {
        error: { message: $.t('validation.error') },
        ...issues
      })
    }
  }
}
