const lodash = require('lodash')
const validate = require('./validate.js')
const i18n = require('./i18n.js')

module.exports = function validator({ app, db, lang }) {
  if (!app) {
    app = global.app || {}
  }
  if (!db) {
    db = app.objects?.db || global.db || {}
  }
  if (!lang) {
    lang = app.config?.env?.lang || 'en'
  }

  const locales = lodash.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })

  return async function (validation, data) {
    const $ = { app, db, lang, t, params: {}, data: {} }
    if (typeof data.query == 'object') {
      $.params.query = data.query
    }
    if (typeof data.values == 'object') {
      $.params.values = data.values
    }
    try {
      await validate($)(validation, data)
    } catch (e) {
      return e.data
    }
    return {}
  }
}
