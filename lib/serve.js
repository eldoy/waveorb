const _ = require('lodash')
const sirloin = require('sirloin')
const markup = require('./markup.js')
const orb = require('./orb.js')
const tools = require('extras')
const { config } = require('./setup.js')
const loader = require('./loader.js')
const actions = require('./actions.js')

// Current hook and result helper variable
let hook, result

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
    options.ssl = { key, cert }
  }

  const server = sirloin(options)

  async function dispatch(fn, client, params) {
    if (params) {
      tools.transform(params)
    }

    const $ = orb(app, client, params)

    try {
      // Run before hook
      if (typeof (hook = app.hooks.before) == 'function') {
        result = await hook($)
        if (typeof result != 'undefined') return result
      }

      const current = await fn($)

      // Run after hook
      if (typeof (hook = app.hooks.after) == 'function') {
        result = await hook(current, $)
        if (typeof result != 'undefined') return result
      }

      return current

    } catch (e) {

      let error = e.data
      if (!error) {
        console.error('Error:', e.message)
        error = {
          error: {
            message: e.message, name: e.name, stack: e.stack
          }
        }
        console.log(error)
      }

      // Run error hook
      if (typeof (hook = app.hooks.error) == 'function') {
        result = await hook(error, $)
        if (typeof result != 'undefined') return result
      }

      return error
    }
  }

  // GET requests
  server.get('*', async function(req, res) {
    if (app.assets.has(req.pathname)) return
    const { query } = req
    const client = { query, req, res, server }
    return dispatch(markup, client)
  })

  // POST requests
  server.post('*', function(req, res) {
    const { params, files, query } = req
    const client = { files, query, req, res, server }
    return dispatch(actions, client, params)
  })

  return { server, options, app }
}
