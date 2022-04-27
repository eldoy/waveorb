const _ = require('lodash')
const tomarkup = require('tomarkup')
const fpath = require('path')
const { load } = require('conficurse')
const { tree } = require('extras')
const route = require('./route.js')
const DEFAULT_LOCALES = require('./locales.js')
const ROOT = process.cwd()

const version = require('./version.js')()

// Load app
module.exports = async function(options = {}) {
  if (typeof options == 'string') {
    options = { path: options }
  }
  if (!options.path) {
    options.path = process.env.WAVEORB_APP || 'app'
  }

  const { path } = options
  const hooks = load(`${path}/hooks`)

  let app = {}

  // Run init hook before we do more
  if (typeof hooks.init == 'function') {
    await hooks.init(app)
  }

  const config = load(`${path}/config`)
  const markdown = tomarkup(config.markdown)
  const mail = load(`${path}/mail`)
  const middleware = load(`${path}/middleware`)
  const plugins = load(`${path}/plugins`)
  const locales = _.merge(
    {},
    DEFAULT_LOCALES,
    load(`${path}/locales`),
    options.locales
  )

  const filters = load(`${path}/filters`)
  const setups = load(`${path}/setups`)
  const actions = load(`${path}/actions`)
  const layouts = load(`${path}/layouts`)

  function markup({ base, ext, content }) {
    // Support markdown pages
    if (ext == 'md') {
      const { html, data } = markdown(content)
      return async function($) {
        $.page.title = data.title ||
          (base[0].toUpperCase() + base.slice(1)).replace(/[-_\.]/g, ' ')
        $.page.description = data.description || ''
        return html
      }
    }
    return content
  }

  const pages = load(`${path}/pages`, markup)
  const views = load(`${path}/views`, markup)

  const routes = route(actions, pages, config)

  // App object
  app = {
    config,
    mail,
    middleware,
    plugins,
    locales,
    filters,
    setups,
    hooks,
    actions,
    layouts,
    pages,
    views,
    markdown,
    routes,
    objects: {},
    // Overwrite with whatever was set in init hook
    ...app
  }

  // Load plugins
  for (const key in plugins) {
    if (typeof plugins[key] == 'function') {
      app.objects[key] = await plugins[key](app)
    }
  }

  return app
}
