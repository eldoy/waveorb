const hook = require('./hook.js')
const action = require('./action.js')
const page = require('./page.js')
const filters = require('./filters.js')
const setups = require('./setups.js')
const allow = require('./allow.js')
const deny = require('./deny.js')
const validate = require('./validate.js')

module.exports = async function dispatch($) {
  let result, current

  $.filters = filters($)
  $.setups = setups($)
  $.allow = allow($)
  $.deny = deny($)
  $.validate = validate($)

  try {
    // Run before hook
    result = await hook($.app.hooks?.before, $)
    if (typeof result != 'undefined') return result

    if ($.req.method == 'GET') {
      current = await page($)
    } else {
      current = await action($)
    }

    // Run after hook
    result = await hook($.app.hooks?.after, current, $)
    if (typeof result != 'undefined') return result

    return current
  } catch (e) {
    let error = e.data
    if (!error) {
      console.error('Error:', e.message)
      error = {
        error: {
          message: e.message,
          name: e.name,
          stack: e.stack
        }
      }
      console.log(error)
    }

    // Run error hook
    result = await hook($.app.hooks?.error, error, $)
    if (typeof result != 'undefined') return result

    return error
  }
}
