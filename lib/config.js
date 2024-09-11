var extras = require('extras')
var env = require('./env.js')

module.exports = function config(mode = env()) {
  return extras.env('waveorb.json', mode)
}
