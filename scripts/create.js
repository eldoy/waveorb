const sh = require('shelljs')
const fs = require('fs')
const fspath = require('path')
const name = process.argv[3] || 'default'
const path = fspath.join(__dirname, '..', 'templates', name, 'app')
if (fs.existsSync(path)) {
  sh.cp('-R', path, '.')
  console.log(`App ${name} copied to 'app' directory`)
} else {
  console.log(`\nTemplate ${name} does not exist.`)
}
