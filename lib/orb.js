const _ = require('lodash')
const i18n = require('./i18n.js')
const tools = require('extras')
const env = require('./env.js')
const bundler = require('./bundler.js')

module.exports = function(app, client, params = {}) {
  const path = _.get(params, 'path') || _.get(client, 'req.pathname') || '/'

  // Set up language
  const method = client.req && client.req.method && client.req.method.toUpperCase()
  const cookieLang = client.req && client.req.cookie && client.req.cookie('lang')
  const defaultLang = process.env.WAVEORB_LANG || _.get(app, 'config.env.lang') || _.get(app, 'config.routes.lang') || 'en'
  lang = params.lang || i18n.getLang(path) || method === 'POST' && cookieLang || defaultLang

  // Update lang cookie
  if (cookieLang) {
    if (method === 'GET' && cookieLang !== lang) {
      client.req.cookie('lang', lang)
    } else if(method === 'POST' && cookieLang === defaultLang) {
      client.req.cookie('lang', null)
    }
  }

  // Set up translations
  const routes = _.get(app, 'config.routes') || {}
  const link = i18n.link(routes, lang)
  const locales = _.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })

  const assets = _.get(app, 'config.assets.bundle')
  const bundle = _.get(client, 'req.headers.x-waveorb-build')
  const { script, style } = bundler(assets, { bundle })
  const $ = { app, tools, lang, link, t, script, style, params, ...client }
  $.env = env($)
  return $
}
