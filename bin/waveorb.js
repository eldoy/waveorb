#!/usr/bin/env node
const nodemon = require('nodemon')
const fspath = require('path')
function p(name) {
  return fspath.join(__dirname, '..', 'scripts', `${name}.js`)
}
const scripts = {
  cmd: p('cmd'),
  deploy: p('deploy'),
  help: p('help'),
  serve: p('serve')
}
const arg = (process.argv[2] || 'help')
const script = scripts[arg]
if (arg === 'serve') {
  // Options: https://github.com/remy/nodemon/blob/master/doc/sample-nodemon.md
  const ignore = ['.git', 'node_modules/**/node_modules']
  const env = { NODE_ENV: 'development' }
  nodemon({ script, ignore, env, stdout: false, verbose: true})
  .on('stderr', function(data) {
    process.stdout.write(data.toString())
  })
  .on('stdout', function(data) {
    process.stdout.write(data.toString())
  })
  .on('quit', function () {
    process.exit()
  })
} else {
  // Clear console
  // console.log('\033[2J')
  try {
    require(scripts[arg])
  } catch (e) {
    console.log(`Command not found: ${arg}`)
  }
}
