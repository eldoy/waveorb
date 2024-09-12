var extras = require('extras')
var validate = require('./validate.js')
var i18n = require('./i18n.js')

module.exports = function validator({ app, db, lang }) {
  if (!app) {
    app = global.app || global._?.app || {}
  }
  if (!db) {
    db = app.objects?.db || global.db || global._?.db || {}
  }
  if (!lang) {
    lang = app.config?.env?.lang || 'en'
  }

  var locales = extras.get(app, 'locales') || {}
  var t = i18n.t({ locales, lang })

  return async function (validation, data) {
    var $ = { app, db, lang, t, params: {}, data: {} }
    if (typeof data.query == 'object') {
      $.params.query = data.query
    }
    if (typeof data.values == 'object') {
      $.params.values = data.values
    }
    try {
      await validate($)(validation, data)
    } catch (e) {
      return e.data || {}
    }
    return {}
  }
}
