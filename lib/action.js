var extras = require('extras')

module.exports = async function ($) {
  var name = $.req.route
  var action = name && extras.get($.app.actions, name.split('/'))

  if (typeof action != 'function') return

  return action($)
}
