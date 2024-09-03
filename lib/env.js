const extras = require('extras')

module.exports = function env() {
  let env = process.env.NODE_ENV
  if (extras.exist('.env')) {
    try {
      env = extras.read('.env').trim()
    } catch (e) {
      console.log(e.message)
      console.log(e)
    }
    process.env.NODE_ENV = env
  }
  return env
}
