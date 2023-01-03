const tools = require('extras')
const { validate } = require('d8a')
const version = require('./lib/version.js')
const action = require('./lib/action.js')
const page = require('./lib/page.js')
const dispatch = require('./lib/dispatch.js')
const bundler = require('./lib/bundler.js')
const i18n = require('./lib/i18n.js')
const loader = require('./lib/loader.js')
const locales = require('./lib/locales.js')
const orb = require('./lib/orb.js')
const serve = require('./lib/serve.js')
const sitemap = require('./lib/sitemap.js')
const settings = require('./lib/settings.js')
const config = require('./lib/config.js')
const host = require('./lib/host.js')
const util = require('./lib/util.js')

module.exports = {
  tools,
  validate,
  version,
  action,
  page,
  dispatch,
  bundler,
  i18n,
  loader,
  locales,
  orb,
  serve,
  sitemap,
  settings,
  config,
  host,
  util
}
