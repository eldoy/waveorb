const lodash = require('lodash')

module.exports = function operate($, name) {
  return async function (obj, list) {
    if (typeof list == 'string') list = [list]
    if (typeof list == 'function') list = await list($)
    return Array.isArray(obj)
      ? obj.map((x) => lodash[name](x, list))
      : lodash[name](obj, list)
  }
}
