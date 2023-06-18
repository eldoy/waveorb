const lodash = require('lodash')
const halt = require('./halt.js')

module.exports = function flow($, type) {
  return async function (names) {
    if (typeof names == 'string') names = [names]
    for (const name of names || []) {
      const path = `${type}.${name}`.replace(/\//g, '.')
      const fn = lodash.get($.app, path)
      if (typeof fn == 'function') {
        const result = await fn($)
        if (typeof result != 'undefined') {
          halt(`${type} result`, result)
        }
      }
    }
  }
}
