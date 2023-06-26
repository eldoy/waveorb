const lodash = require('lodash')
const tomarkup = require('tomarkup')
const brainmatter = require('brainmatter')
const skjema = require('skjema')
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
  const scripts = load(`${path}/scripts`)

  const schema = load(`${path}/schema`)
  const models = skjema.model(schema)
  const form = function(name) {
    return skjema.form(models[name])
  }
  for (const name in models) {
    if (!actions[name]) {
      actions[name] = {}
    }
    for (const action in skjema.actions) {
      if (!actions[name][action]) {
        actions[name][action] = skjema.actions[action](models[name])
      }
    }
  }

  function titled(base, { html, data }) {
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

  function markup({ base, ext, content }) {
    if (ext == 'md') {
      return titled(base, markdown(content))
    }
    if (ext == 'html') {
      return titled(base, brainmatter(content))
    }
    return content
  }

  const pages = load(`${path}/pages`, markup)
  const views = load(`${path}/views`, markup)
  const components = load(`${path}/components`, markup)
  const elements = load(`${path}/elements`, markup)
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
    schema,
    form,
    model: skjema,
    objects: {},
    // Merge in what was already set earlier
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
