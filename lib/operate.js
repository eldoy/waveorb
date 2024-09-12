var extras = require('extras')

module.exports = function operate($, name) {
  return async function (obj, list) {
    if (typeof list == 'string') list = [list]
    if (typeof list == 'function') list = await list($)
    return Array.isArray(obj)
      ? obj.map((x) => extras[name](x, list))
      : extras[name](obj, list)
  }
}
