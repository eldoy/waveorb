const _ = require('lodash')
const tomarkup = require('tomarkup')
const { load } = require('conficurse')
const { dot } = require('extras')
const DEFAULT_LOCALES = require('./locales.js')
const DEFAULT_FUNCTIONS = require('./functions.js')

function sortRoutes(routes) {
  var sorted = {}
  function base(str) {
    return str.split('/').map(y => y[0] == '_' ? '_' : y).join('/')
  }
  Object.keys(routes).sort((a, b) => {
    a = base(a)
    b = base(b)
    if (a < b) return 1
    else if (a > b) return -1
    return 0
  }).forEach(x => sorted[x] = routes[x])

  return sorted
}

/** Load and configure app */
module.exports = async function(options = {}) {
  if (typeof options === 'string') {
    options = { path: options }
  }
  if (!options.path) {
    options.path = process.env.WAVEORB_APP || 'app'
  }

  const { path } = options
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
  const actions = load(`${path}/actions`)

  // Add default functions to actions
  for (const model in actions) {
    const items = actions[model]
    if (!_.isPlainObject(items)) continue
    for (const key in items) {
      const action = items[key]
      if (!_.isPlainObject(action)) continue
      const name = typeof action.main === 'string' ? action.main : key
      if (typeof action.main !== 'function' &&
        action.main !== false &&
        DEFAULT_FUNCTIONS[name]
      ) {
        action.main = DEFAULT_FUNCTIONS[name](model)
      }
    }
  }

  const layouts = load(`${path}/layouts`)
  const pages = load(`${path}/pages`, function({ base, ext, content }) {
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
  })

  // Add routes to app from config and pages
  let routes = dot(pages, '/')
  for (const key in routes) {
    routes[key] = key.split('/').join('.')
  }
  const routemap = config.routes?.routemap || {}
  for (const key in routemap) {
    const val = routemap[key].replace(/^.+@/, '').split('/').join('.')
    const page = _.get(pages, val)
    if (typeof page == 'function') {
      const id = key.slice(1).replace(/\.html$/, '').replace(/\/$/, '/index')
      if (id) routes[id] = val
    }
  }
  routes = sortRoutes(routes)

  const app = {
    config,
    mail,
    middleware,
    plugins,
    locales,
    filters,
    actions,
    layouts,
    pages,
    markdown,
    routes
  }

  // Load plugins
  for (const key in plugins) {
    if (typeof plugins[key] === 'function') {
      await plugins[key](app)
    }
  }

  return app
}
