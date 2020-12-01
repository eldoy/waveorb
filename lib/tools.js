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

tools.sortByNumber = function(list) {
  return list.sort(function(a, b) {
    return (parseInt(a) || 0) - (parseInt(b) || 0)
  })
}

module.exports = tools
