const _ = require('lodash')
const sirloin = require('sirloin')
const markup = require('./markup.js')
const orb = require('./orb.js')
const { transform } = require('extras')
const { config } = require('./setup.js')
const loader = require('./loader.js')
const actions = require('./actions.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

// Set up port. WAVEORB_PORT takes precedence.
let port = 5000
if (process.env.WAVEORB_PORT) {
  port = parseInt(process.env.WAVEORB_PORT)
} else if (process.env.NODE_ENV == 'production' && typeof config.proxy == 'string') {
  port = parseInt(config.proxy.split(':').reverse()[0])
}

const SERVER_OPTIONS = {
  port,
  host: process.env.WAVEORB_HOST,
  dir: process.env.WAVEORB_ASSETS || 'app/assets'
}

module.exports = async function(options = {}, app) {
  if (!app) app = await loader()
  console.log(`Mode: ${process.env.NODE_ENV}`)
  options = _.merge(SERVER_OPTIONS, options)

  const cert = process.env.WAVEORB_SSL_CERT
  const key = process.env.WAVEORB_SSL_KEY
  if (cert && key) {
    console.log(`Using cert ${cert}`)
    console.log(`Using key ${key}`)
    options.ssl = { key, cert }
  }

  const server = sirloin(options)

  // Apply middleware
  for (const m in app.middleware) {
    const fn = app.middleware[m]
    typeof fn == 'function' && server.use(fn)
  }

  function hook(name, a, b) {
    if (typeof app.hooks[name] == 'function') {
      return app.hooks[name](a, b)
    }
  }

  async function dispatch(fn, client, params) {
    if (params) transform(params)
    const $ = orb(app, client, params)

    try {
      const dispatchHook = await hook('dispatch', $)
      if (typeof dispatchHook != 'undefined') return dispatchHook
      const result = await fn($)
      const resultHook = await hook('result', result, $)
      if (typeof resultHook != 'undefined') return resultHook
      return result
    } catch (e) {
      let error = e.data
      if (!error) {
        console.error('Error:', e.message)
        error = { error: { message: e.message, name: e.name, stack: e.stack } }
        console.log(error)
      }
      const errorHook = await hook('error', error, $)
      if (typeof errorHook != 'undefined') return errorHook
      return error
    }
  }

  // Markup requests
  server.get('*', function(req, res) {
    if (app.assets.has(req.pathname)) return
    const client = { query: req.query, req, res, server }
    return dispatch(markup, client)
  })

  // Websocket requests
  server.action('*', function(params, socket) {
    const client = { socket, server }
    return dispatch(actions, client, params)
  })

  // HTTP requests
  server.post('*', function(req, res) {
    const { params, files, query } = req
    const client = { files, query, req, res, server }
    return dispatch(actions, client, params)
  })

  return { server, options, app }
}
