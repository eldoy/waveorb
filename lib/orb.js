const _ = require('lodash')
const i18n = require('./i18n.js')
const tools = require('extras')
const bundler = require('./bundler.js')

module.exports = function (app, req, res, server) {
  const { params = {}, files = {}, query = {}, lang = 'en' } = req

  // Set up translations
  const routes = _.get(app, 'config.routes') || {}
  const link = i18n.link(routes, lang)
  const locales = _.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })

  // Configure assets
  const assets = _.get(app, 'config.assets.bundle')
  const compress = !['test', 'development'].includes(process.env.NODE_ENV)
  const { script, style } = bundler(assets, { compress })

  // Return orb ($) object
  return {
    app,
    req,
    res,
    server,
    params,
    files,
    query,
    tools,
    lang,
    link,
    t,
    script,
    style,
    data: {},
    ...app.objects
  }
}
