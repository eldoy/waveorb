const extras = require('extras')

module.exports = function version(v = process.env.WAVEORB_APP_VERSION) {
  // Get last commit hash from git
  if (!v) {
    v = extras.capture(`git log -n1 --format=format:"%h"`)
  }

  // Get version from package.json
  if (!v) {
    try {
      v = extras.read('package.json').version
    } catch (e) {}
  }

  if (v) {
    process.env.WAVEORB_APP_VERSION = v
  }
}
