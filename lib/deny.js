const gate = require('./gate.js')

module.exports = function deny($) {
  return gate($, true)
}
