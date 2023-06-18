const lodash = require('lodash')

module.exports = async function ($) {
  const name = $.req.route
  const action = name && lodash.get($.app.actions, name.split('/'))

  if (typeof action != 'function') return

  return action($)
}
