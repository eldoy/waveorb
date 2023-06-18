const lodash = require('lodash')
const halt = require('./halt.js')

module.exports = function gate($, want) {
  return async function (fields) {
    const issues = {}
    for (const name in fields) {
      const keys = Object.keys($.params[name] || [])
      let list = fields[name]
      if (typeof list == 'function') {
        list = await list($)
      }
      for (const key of keys) {
        if (list.includes(key) === want) {
          if (!issues[name]) issues[name] = []
          issues[name].push(key)
        }
      }
    }

    if (!lodash.isEmpty(issues)) {
      halt('field error', {
        error: { message: $.t('validation.field') },
        ...issues
      })
    }
  }
}
