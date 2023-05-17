const extras = require('extras')
const env = require('./env.js')

module.exports = function config(mode = env()) {
  return extras.env('waveorb.json', mode)
}
