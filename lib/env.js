const { exist, read } = require('extras')

module.exports = function env() {
  if (exist('.env')) {
    let env = process.env.NODE_ENV
    try {
      env = read('.env').trim()
    } catch (e) {
      console.log(e.message)
      console.log(e)
    }
    process.env.NODE_ENV = env
  }
}
