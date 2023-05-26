const _ = require('lodash')
const { dot, clean } = require('extras')

module.exports = function operate($, want) {
  return async function (obj, list) {
    if (typeof list == 'function') list = await list($)
    if (!Array.isArray(obj)) obj = [obj]
    for (const item of obj) {
      for (const key in dot(item)) {
        if (list.includes(key) === want) {
          _.set(item, key, undefined)
        }
      }
    }
    clean(obj, 'undefined')
  }
}
