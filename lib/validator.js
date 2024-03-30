const lodash = require('lodash')
const validate = require('./validate.js')
const i18n = require('./i18n.js')

module.exports = function validator({ app = {}, db, lang }) {
  if (!db) {
    db = app.objects?.db || global.db || {}
  }
  if (!lang) {
    lang = app.config?.env?.lang || 'en'
  }

  const locales = lodash.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })
  const $ = { app, db, lang, t, params: {}, data: {} }

  return async function (validation, data) {
    try {
      await validate($)(validation, data)
    } catch (e) {
      return e.data
    }
    return {}
  }
}
