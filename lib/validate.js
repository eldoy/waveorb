const _ = require('lodash')
const d8a = require('d8a')
const validations = require('waveorb-validations')
const halt = require('./halt.js')

module.exports = function validate($) {
  return async function(fields) {
    const issues = {}
    let ext = validations($)
    const opt = { $, ext, lax: true }

    for (const name in fields) {
      const spec = _.get(fields, name)
      const data = _.get($.params, name)
      const errors = await d8a.validate(spec, data, opt)
      if (errors) {
        issues[name] = errors
      }
    }

    if (!_.isEmpty(issues)) {
      halt('validation error', {
        error: { message: $.t('validation.error') }, ...issues
      })
    }
  }
}