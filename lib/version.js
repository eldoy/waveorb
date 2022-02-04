const { get, read } = require('extras')

module.exports = function version(v = process.env.WAVEORB_APP_VERSION) {
  // Try from git
  if (!v) {
    v = get(`git log -n1 --format=format:"%h"`)
  }

  // Try from package.json
  if (!v) {
    try {
      v = read('package.json').version
    } catch(e) {}
  }

  if (v) {
    process.env.WAVEORB_APP_VERSION = v
  }

  console.log('Version:', process.env.WAVEORB_APP_VERSION || '?')
}