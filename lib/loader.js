const _ = require('lodash')
const marked = require('marked')
const prism = require('prismjs')
require('prismjs/components/')()
const { load } = require('conficurse')
const DEFAULT_LOCALES = require('./locales.js')
const DEFAULT_FUNCTIONS = require('./functions.js')

const markdownOptions = {
  renderer: new marked.Renderer(),
  highlight: function(code, lang = 'md') {
    return prism.highlight(code, prism.languages[lang], lang)
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
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
  marked.setOptions(_.merge({}, markdownOptions, config.markdown))

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
  const pages = load(`${path}/pages`, function({ ext, content }) {
    // Support markdown pages
    if (ext == 'md') {
      const data = {}
      const matches = content.match(/---(.+?)---/s)
      if (matches) {
        content = content.replace(matches[0], '')
        matches[1].split('\n').forEach(line => {
          const [key, value = ''] = line.split(':').map(item => item.trim())
          data[key] = value
        })
      }
      return { ...data, content: marked(content) }
    }
    return content
  })

  const app = {
    config,
    mail,
    middleware,
    plugins,
    locales,
    filters,
    actions,
    layouts,
    pages
  }

  // Load plugins
  for (const key in plugins) {
    if (typeof plugins[key] === 'function') {
      await plugins[key](app)
    }
  }

  return app
}
