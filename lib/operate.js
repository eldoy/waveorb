const _ = require('lodash')

module.exports = function operate($, name) {
  return async function (obj, list) {
    if (typeof list == 'string') list = [list]
    if (typeof list == 'function') list = await list($)
    return Array.isArray(obj)
      ? obj.map((x) => _[name](x, list))
      : _[name](obj, list)
  }
}
