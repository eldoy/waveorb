const { exist, read } = require('extras')

let config = {}
if (exist('waveorb.json')) {
  config = read('waveorb.json')
} else if (exist('waveorb.js')) {
  config = read('waveorb.js')
}

module.exports = { config }
