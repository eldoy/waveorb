const _ = require('lodash')
const i18n = require('./i18n.js')
const tools = require('extras')
const env = require('./env.js')
const bundler = require('./bundler.js')

module.exports = function(app, client = {}) {
  // Set up language
  const { req } = client
  const cookieLang = req.cookie('lang')
  const defaultLang = _.get(app, 'config.env.lang') || 'en'
  const lang = i18n.getLang(req.pathname)
    || cookieLang
    || defaultLang

  // Update lang cookie
  if (cookieLang) {
    if (cookieLang !== lang) {
      req.cookie('lang', lang)
    } else if(cookieLang === defaultLang) {
      req.cookie('lang', null)
    }
  }

  // Set up translations
  const routes = _.get(app, 'config.routes') || {}
  const link = i18n.link(routes, lang)
  const locales = _.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })
  const assets = _.get(app, 'config.assets.bundle')
  const bundle = process.env.NODE_ENV == 'production'
  const { script, style } = bundler(assets, { bundle })
  const data = {}
  const $ = {
    app,
    tools,
    lang,
    link,
    t,
    script,
    style,
    data,
    ...client,
    ...app.objects
  }
  $.env = env($)
  return $
}
