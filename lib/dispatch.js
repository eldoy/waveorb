const hook = require('./hook.js')
const action = require('./action.js')
const page = require('./page.js')
const filters = require('./filters.js')
const setups = require('./setups.js')
const allow = require('./allow.js')
const deny = require('./deny.js')
const validate = require('./validate.js')
const keep = require('./keep.js')
const remove = require('./remove.js')

module.exports = async function dispatch($) {
  let result, data

  $.filters = filters($)
  $.setups = setups($)
  $.allow = allow($)
  $.deny = deny($)
  $.validate = validate($)
  $.keep = keep($)
  $.remove = remove($)

  try {
    // Run before hook
    result = await hook($.app.hooks?.before, $)
    if (typeof result != 'undefined') return result

    if ($.req.method == 'GET') {
      data = await page($)
    } else {
      data = await action($)
    }
  } catch (e) {
    data = e.data
    if (typeof data == 'undefined') {
      console.error(`\n${new Date().toISOString()}`)
      console.error('Error:', e.message)
      data = {
        error: {
          message: e.message,
          name: e.name,
          stack: e.stack
        }
      }
      console.error(data)

      // Run error hook
      result = await hook($.app.hooks?.error, data, $)
      if (typeof result != 'undefined') return result
    }
  }

  // Run after hook
  result = await hook($.app.hooks?.after, data, $)
  if (typeof result != 'undefined') return result

  return data
}
