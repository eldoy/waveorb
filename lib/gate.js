var extras = require('extras')
var halt = require('./halt.js')

module.exports = function gate($, want) {
  return async function (fields) {
    var issues = {}
    for (var name in fields) {
      var keys = Object.keys($.params[name] || [])
      var list = fields[name]
      if (typeof list == 'function') {
        list = await list($)
      }
      for (var key of keys) {
        if (list.includes(key) === want) {
          if (!issues[name]) issues[name] = []
          issues[name].push(key)
        }
      }
    }

    if (!extras.isEmpty(issues)) {
      halt('field error', {
        error: { message: $.t('validation.field') },
        ...issues
      })
    }
  }
}
