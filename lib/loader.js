const lodash = require('lodash')
const tomarkup = require('tomarkup')
const brainmatter = require('brainmatter')
const skjema = require('skjema')
const lowcode = require('lavkode')
const { load } = require('conficurse')
const env = require('./env.js')
const version = require('./version.js')
const route = require('./route.js')
const transform = require('./transform.js')
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

  let app = { objects: {} }

  // Run init hook before we do more
  if (typeof hooks.init == 'function') {
    await hooks.init(app)
  }

  const config = load(`${path}/config`)
  const markdown = tomarkup({ file: false, ...config.markdown })
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
  const flows = load(`${path}/flows`)

  // Add to app object
  app = {
    hooks,
    config,
    markdown,
    mail,
    middleware,
    util,
    plugins,
    locales,
    matchers,
    filters,
    setups,
    flows,
    ...app
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

  function prepare(props) {
    // Run file hook (not async)
    if (typeof hooks.file == 'function') {
      var file = hooks.file(app, props)
      if (typeof file != 'undefined') {
        return file
      }
    }
    var { base, ext, content, dir } = props

    if (ext == 'md') {
      return titled(base, markdown(content))
    }
    if (ext == 'html') {
      return titled(base, brainmatter(content))
    }

    if (ext == 'yml' || ext == 'json') {
      if (dir.startsWith('app/layouts')) {
        return lowcode.layout(content)
      }
      if (dir.startsWith('app/pages')) {
        return lowcode.page(content)
      }
      if (dir.startsWith('app/actions')) {
        return lowcode.action(content)
      }
    }
    return content
  }

  const scripts = load(`${path}/scripts`, prepare)
  let removeHook = transform()
  const views = load(`${path}/views`, prepare)
  const components = load(`${path}/components`, prepare)
  const elements = load(`${path}/elements`, prepare)
  removeHook()

  // Add to app object
  app = {
    scripts,
    views,
    components,
    elements,
    ...app
  }

  const actions = load(`${path}/actions`, prepare)
  const schema = load(`${path}/schema`)
  skjema.model(schema, actions)

  removeHook = transform()
  const layouts = load(`${path}/layouts`, prepare)
  const pages = load(`${path}/pages`, prepare)
  removeHook()
  const routes = route(actions, pages, config)

  // Add to app object
  app = {
    actions,
    schema,
    layouts,
    pages,
    routes,
    form: skjema,
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

      // Implode plugins
      plugins[key] = result
    }
  }

  // Run load hook before return
  if (typeof hooks.load == 'function') {
    await hooks.load(app)
  }

  return app
}
