var lodash = require('lodash')

module.exports = async function ($) {
  var name = $.req.route
  var action = name && lodash.get($.app.actions, name.split('/'))

  if (typeof action != 'function') return

  return action($)
}
