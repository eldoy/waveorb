var gate = require('./gate.js')

module.exports = function allow($) {
  return gate($, false)
}
