const sh = require('shelljs')
const fspath = require('path')
const name = process.argv[3] || 'minimal'
const path = fspath.join(__dirname, '..', 'templates', name, 'app')
sh.cp('-R', path, '.')
