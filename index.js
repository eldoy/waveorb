var haka = require('haka')
global.esc = haka.esc
global.raw = haka.raw
global.num = haka.num
global.time = haka.time

global.Waveorb = require('./lib/tools.js')

module.exports = global.Waveorb
