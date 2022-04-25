const orb = require('./orb.js')
const action = require('./action.js')
const page = require('./page.js')
const filters = require('./filters.js')
const allow = require('./allow.js')
const deny = require('./deny.js')
const validate = require('./validate.js')

function runHook(hook, ...args) {
  if (typeof hook == 'function') {
    return hook(...args)
  }
}

module.exports = async function dispatch($) {

  let result, current

  $.filters = filters($)
  $.allow = allow($)
  $.deny = deny($)
  $.validate = validate($)

  try {
    // Run before hook
    result = await runHook($.app.hooks?.before, $)
    if (typeof result != 'undefined') return result

    if ($.req.method == 'GET') {
      current = await page($)
    } else {
      current = await action($)
    }

    // Run after hook
    result = await runHook($.app.hooks?.after, current, $)
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
    result = await runHook($.app.hooks?.error, error, $)
    if (typeof result != 'undefined') return result

    return error
  }
}
