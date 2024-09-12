var extras = require('extras')
var i18n = require('./i18n.js')
var tools = require('./tools.js')
var bundler = require('./bundler.js')

module.exports = function (app, req, res, server) {
  var { params = {}, files = {}, query = {}, lang = 'en' } = req

  // Set up translations
  var routes = extras.get(app, 'config.routes') || {}
  var link = i18n.link(routes, lang)
  var locales = extras.get(app, 'locales') || {}
  var t = i18n.t({ locales, lang })

  // Configure assets
  var assets = extras.get(app, 'config.assets.bundle')
  var compress = !['test', 'development'].includes(process.env.NODE_ENV)
  var { script, style } = bundler(assets, { compress })

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
    cache: {},
    ...app.objects
  }
}
