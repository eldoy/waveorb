const _ = require('lodash')
const furu = require('furu')
const tools = require('extras')
const markup = require('./markup.js')
const orb = require('./orb.js')
const loader = require('./loader.js')
const actions = require('./actions.js')
const OPTIONS = require('./options.js')

// Current hook and result helper variable
let hook, result

module.exports = async function(options = {}, app) {
  if (!app) app = await loader()

  options = _.merge(OPTIONS, options)
  options.middleware = app.middleware

  const server = furu(options, dispatch)

  async function dispatch(req, res) {
    // TODO: Remove, handled by Furu
    // if (req.method == 'GET' && app.assets.has(req.pathname)) return

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

  return { server, options, app }
}
