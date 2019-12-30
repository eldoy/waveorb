const fs = require('fs')

const tools = {}

tools.toObject = function(s) {
  return eval(`[${s}]`)
}

tools.fileExists = function(file) {
  let exists = false
  try {
    exists = !!fs.statSync(file)
  } catch (e) {}
  return exists
}

tools.platformFile = function() {
  const files = { darwin: 'server-macos', win32: 'server-win.exe' }
  return files[process.platform] || 'server-linux'
}

module.exports = tools