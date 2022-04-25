const _ = require('lodash')
const filters = require('./filters.js')
const allow = require('./allow.js')
const deny = require('./deny.js')
const validate = require('./validate.js')

module.exports = async function($, options = {}) {
  if (typeof options == 'string') {
    options = { name: options }
  }

  // Extract action from pathname, defaults to index
  // Removes /api/ from beginning of paths to accommodate production servers
  if (!options.name) {
    options.name = $.req.pathname.replace(/^\/api\//, '/')
  }

  const routeName = `post#${options.name}`
  const fileName = _.get($.app.routes, routeName) || ''
  const filePath = fileName.replace(/\//g, '.')
  const action = _.get($.app.actions, filePath)

  if (typeof action != 'function') return null

  $.filters = filters($)
  $.allow = allow($)
  $.deny = deny($)
  $.validate = validate($)

  return action($)
}
