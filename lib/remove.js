const operate = require('./operate.js')

module.exports = function remove($) {
  return operate($, true)
}
