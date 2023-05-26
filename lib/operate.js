const _ = require('lodash')

module.exports = function operate($, name) {
  return async function (obj, list) {
    if (typeof list == 'string') list = [list]
    if (typeof list == 'function') list = await list($)
    const wasArray = Array.isArray(obj)
    if (!wasArray) obj = [obj]
    const result = obj.map((x) => _[name](x, list))
    return wasArray ? result : result[0]
  }
}
