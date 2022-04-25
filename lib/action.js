const _ = require('lodash')
const filters = require('./filters.js')
const allow = require('./allow.js')
const deny = require('./deny.js')
const validate = require('./validate.js')

module.exports = async function($) {
  const name = $.req.route
  let action = name && _.get($.app.actions, name.split('/'))

  if (typeof action != 'function') return

  $.filters = filters($)
  $.allow = allow($)
  $.deny = deny($)
  $.validate = validate($)

  return action($)
}
