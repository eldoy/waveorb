const tools = require('extras')
const { validate } = require('d8a')
const version = require('./lib/version.js')
const actions = require('./lib/actions.js')
const bundler = require('./lib/bundler.js')
const i18n = require('./lib/i18n.js')
const loader = require('./lib/loader.js')
const locales = require('./lib/locales.js')
const markup = require('./lib/markup.js')
const orb = require('./lib/orb.js')
const pager = require('./lib/pager.js')
const serve = require('./lib/serve.js')
const sitemap = require('./lib/sitemap.js')

module.exports = {
  tools,
  validate,
  version,
  actions,
  bundler,
  i18n,
  loader,
  locales,
  markup,
  orb,
  pager,
  serve,
  sitemap
}
