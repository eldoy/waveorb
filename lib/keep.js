var operate = require('./operate.js')

module.exports = function keep($) {
  return operate($, 'pick')
}
