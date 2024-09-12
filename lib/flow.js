var extras = require('extras')
var halt = require('./halt.js')

module.exports = function flow($, type) {
  return async function (names) {
    if (typeof names == 'string') names = [names]
    for (var name of names || []) {
      var path = `${type}.${name}`.replace(/\//g, '.')
      var fn = extras.get($.app, path)
      if (typeof fn == 'function') {
        var result = await fn($)
        if (typeof result != 'undefined') {
          halt(`${type} result`, result)
        }
      }
    }
  }
}
