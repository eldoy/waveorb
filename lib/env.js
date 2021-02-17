const _ = require('lodash')

module.exports = function($) {
  return function(key) {
    return _.get($, key)
  }
}
