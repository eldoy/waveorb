var hook = require('./hook.js')
var action = require('./action.js')
var page = require('./page.js')
var filters = require('./filters.js')
var setups = require('./setups.js')
var allow = require('./allow.js')
var deny = require('./deny.js')
var validate = require('./validate.js')
var keep = require('./keep.js')
var remove = require('./remove.js')

module.exports = async function dispatch($) {
  var result, data

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
