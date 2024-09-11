var lodash = require('lodash')
var tomarkup = require('tomarkup')
var brainmatter = require('brainmatter')
var skjema = require('skjema')
var lowcode = require('lavkode')
var { load } = require('conficurse')
var env = require('./env.js')
var version = require('./version.js')
var route = require('./route.js')
var transform = require('./transform.js')
var validator = require('./validator.js')
var DEFAULT_LOCALES = require('./locales.js')

var waveorbConfig = require('./config')()

// Load app
module.exports = async function (options = {}) {
  if (typeof options == 'string') {
    options = { path: options }
  }
  if (!options.path) {
    options.path = process.env.WAVEORB_APP || 'app'
  }
  if (options.config) {
    waveorbConfig = { ...waveorbConfig, ...options.config }
  }

  // Set env
  var mode = env()

  // Set version
  version()

  var { path } = options
  var hooks = load(`${path}/hooks`)

  if (mode == 'development' && !process.env.WAVEORB_CMD) {
    console.time('App load time')
  }

  var app = { objects: {} }

  // Run init hook before we do more
  if (typeof hooks.init == 'function') {
    await hooks.init(app)
  }

  var config = load(`${path}/config`)
  var markdown = tomarkup({ file: false, ...config.markdown })
  var mail = load(`${path}/mail`)
  var middleware = load(`${path}/middleware`)
  var util = load(`${path}/util`)
  var plugins = load(`${path}/plugins`)

  var locales = lodash.merge(
    {},
    DEFAULT_LOCALES,
    load(`${path}/locales`),
    options.locales
  )

  var matchers = load(`${path}/matchers`)
  var filters = load(`${path}/filters`)
  var setups = load(`${path}/setups`)
  var flows = load(`${path}/flows`)
  var validations = load(`${path}/validations`)
  var collections = load(`${path}/collections`)
  var apis = load(`${path}/apis`)
  var models = load(`${path}/models`)
  var transformers = load(`${path}/transformers`)
  var converters = load(`${path}/converters`)

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
    validations,
    collections,
    apis,
    models,
    transformers,
    converters,
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

  function onload(props) {
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

  function onrequire({ content }) {
    if (!waveorbConfig.transform) {
      return content
    }
    return transform(content)
  }

  var htmlLoadOptions = { onload }
  if (waveorbConfig.transform) {
    htmlLoadOptions.onrequire = onrequire
  }

  var scripts = load(`${path}/scripts`, { onload })
  var views = load(`${path}/views`, htmlLoadOptions)
  var components = load(`${path}/components`, htmlLoadOptions)
  var elements = load(`${path}/elements`, htmlLoadOptions)

  // Add to app object
  app = {
    scripts,
    views,
    components,
    elements,
    ...app
  }

  var actions = load(`${path}/actions`, { onload })
  var schema = load(`${path}/schema`)
  skjema.model(schema, actions)

  var layouts = load(`${path}/layouts`, htmlLoadOptions)
  var pages = load(`${path}/pages`, htmlLoadOptions)
  var routes = route(actions, pages, config)

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
  for (var key in plugins) {
    if (typeof plugins[key] == 'function') {
      var result = await plugins[key](app)

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

  if (mode == 'development' && !process.env.WAVEORB_CMD) {
    console.timeEnd('App load time')
  }

  // Set up validator
  app.validator = validator({ app })

  return app
}
