const orb = require('./orb.js')
const actions = require('./actions.js')
const page = require('./page.js')

function runHook(hook, ...args) {
  if (typeof hook == 'function') {
    return hook(...args)
  }
}

module.exports = async function dispatch($) {

  let result, current

  try {
    // Run before hook
    result = await runHook($.app.hooks?.before, $)
    if (typeof result != 'undefined') return result

    if ($.req.method == 'GET') {
      current = await page($)
    } else {
      current = await actions($)
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
