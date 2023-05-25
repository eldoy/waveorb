const _ = require('lodash')
const { dot, clean } = require('extras')

module.exports = function operate($, want) {
  return async function (obj, list) {
    if (typeof list == 'function') list = await list($)
    for (const key in dot(obj)) {
      if (list.includes(key) === want) {
        _.set(obj, key, undefined)
      }
    }
    clean(obj, 'undefined')
  }
}
