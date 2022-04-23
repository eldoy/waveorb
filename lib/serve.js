const _ = require('lodash')
const sirloin = require('sirloin')
const markup = require('./markup.js')
const orb = require('./orb.js')
const tools = require('extras')
const OPTIONS = require('./options.js')
const loader = require('./loader.js')
const actions = require('./actions.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

// Current hook and result helper variable
let hook, result

module.exports = async function(options = {}, app) {
  if (!app) app = await loader()
  console.log(`Mode: ${process.env.NODE_ENV}`)
  options = _.merge(OPTIONS, options)

  const server = sirloin(options)

  async function dispatch(req, res) {
    // TODO: Remove, handled by Furu
    if (req.method == 'GET' && app.assets.has(req.pathname)) return

    tools.transform(req.params || {})

    const $ = orb(app, req, res, server)
    const fn = req.method == 'GET' ? markup : actions

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
  server.get('*', dispatch)

  // POST requests
  server.post('*', dispatch)

  return { server, options, app }
}
