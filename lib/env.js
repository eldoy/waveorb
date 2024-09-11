var extras = require('extras')

module.exports = function env() {
  var mode = process.env.NODE_ENV
  if (extras.exist('.env')) {
    try {
      mode = extras.read('.env').trim()
    } catch (e) {
      console.log(e.message)
      console.log(e)
    }
    process.env.NODE_ENV = mode
  }
  return mode
}
