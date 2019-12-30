const sh = require('shelljs')
const fspath = require('path')
const path = fspath.join(__dirname, '..', 'node_modules', 'presang', 'bin', 'presang.js')
sh.exec(`${path} build`)
