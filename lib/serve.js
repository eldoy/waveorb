const _ = require('lodash')
const furu = require('furu')
const tools = require('extras')
const loader = require('./loader.js')
const orb = require('./orb.js')
const actions = require('./actions.js')
const OPTIONS = require('./options.js')

function getOptions(opt, app) {
  const { middleware, routes } = app
  return _.merge(
    OPTIONS,
    { middleware, routes },
    opt
  )
}

async function page($) {
  const name = $.req.route
  const page = name && _.get($.app.pages, name.split('/'))
  if (!page) return

  // Set up content
  $.page = { name }
  $.page.content = await page($)

  if ($.req.redirecting) return ''

  if ($.page.layout !== false) {
    const layoutName = $.page.layout || 'main'
    const layout = _.get($.app.layouts, layoutName)
    if (layout) {
      $.page.content = await layout($)
    }
  }

  return $.page.content
}

async function runHook(hook, ...args) {
  if (typeof hook == 'function') {
    return hook(...args)
  }
}

async function dispatch(req, res, app, server) {
  if (req.params) {
    tools.transform(req.params)
  }

  // Set up orb object ($)
  const $ = orb(app, req, res, server)

  let result, current
  try {
    // Run before hook
    result = await runHook(app.hooks?.before, $)
    if (typeof result != 'undefined') return result

    if (req.method == 'GET') {
      current = await page($)
    } else {
      current = await actions($)
    }

    // Run after hook
    result = await runHook(app.hooks?.after, current, $)
    if (typeof result != 'undefined') return result

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
    result = await runHook(app.hooks?.error, error, $)
    if (typeof result != 'undefined') return result

    return error
  }
}

module.exports = async function(opt, app) {
  if (!app) app = await loader()

  const options = getOptions(opt, app)

  const server = furu(options, function(req, res) {
    return dispatch(req, res, app, server)
  })

  return { server, options, app }
}
