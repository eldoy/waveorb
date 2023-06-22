const lodash = require('lodash')
const tomarkup = require('tomarkup')
const { load } = require('conficurse')
const env = require('./env.js')
const version = require('./version.js')
const route = require('./route.js')
const DEFAULT_LOCALES = require('./locales.js')

// Load app
module.exports = async function (options = {}) {
  if (typeof options == 'string') {
    options = { path: options }
  }
  if (!options.path) {
    options.path = process.env.WAVEORB_APP || 'app'
  }

  // Set env
  env()

  // Set version
  version()

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
  const util = load(`${path}/util`)
  const plugins = load(`${path}/plugins`)
  const locales = lodash.merge(
    {},
    DEFAULT_LOCALES,
    load(`${path}/locales`),
    options.locales
  )

  const matchers = load(`${path}/matchers`)
  const filters = load(`${path}/filters`)
  const setups = load(`${path}/setups`)
  const actions = load(`${path}/actions`)
  const flows = load(`${path}/flows`)
  const layouts = load(`${path}/layouts`)

  function markup({ base, ext, content }) {
    // Support markdown pages
    if (ext == 'md') {
      const { html, data } = markdown(content)
      return async function ($) {
        $.page.title =
          $.page.title ||
          data.title ||
          (base[0].toUpperCase() + base.slice(1)).replace(/[-_\.]/g, ' ')
        $.page.description = $.page.description || data.description || ''
        $.page.layout = $.page.layout || data.layout
        return html
      }
    }
    // Support HTML pages
    if (ext == 'html') {
      return async function ($) {
        return content
      }
    }
    return content
  }

  const pages = load(`${path}/pages`, markup)
  const views = load(`${path}/views`, markup)
  const components = load(`${path}/components`, markup)
  const routes = route(actions, pages, config)

  // App object
  app = {
    config,
    mail,
    middleware,
    util,
    plugins,
    locales,
    matchers,
    filters,
    setups,
    hooks,
    actions,
    flows,
    layouts,
    pages,
    views,
    components,
    markdown,
    routes,
    objects: {},
    // Merge in what was set in init hook
    ...app
  }

  // Load plugins
  for (const key in plugins) {
    if (typeof plugins[key] == 'function') {
      const result = await plugins[key](app)

      // This is unpacked into the root of the '$' object on each request
      if (typeof result != 'undefined') {
        app.objects[key] = result
      }

      // Implode plugin
      plugins[key] = result
    }
  }

  // Run load hook before return
  if (typeof hooks.load == 'function') {
    await hooks.load(app)
  }

  return app
}
