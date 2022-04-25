const _ = require('lodash')
const halt = require('./halt.js')

module.exports = function filters($) {
  return async function(filters) {
    for (const name of filters || []) {
      const filterPath = `filters.${name}`.replace(/\//g, '.')
      const filter = _.get($.app, filterPath)
      if (typeof filter == 'function') {
        const result = await filter($)
        if (typeof result != 'undefined') {
          halt('filter result', result)
        }
      }
    }
  }
}