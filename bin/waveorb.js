#!/usr/bin/env node --experimental-repl-await
const fspath = require('path')
const commands = {
  presang: ['serve', 'build'],
  sverd: ['boot', 'install', 'update', 'deploy'],
  waveorb: ['create', 'get', 'help', 'cmd']
}
const command = (process.argv[2] || 'help').trim()

function moduleBin(name) {
  require(fspath.join(__dirname, '..', 'node_modules', name, 'bin', `${name}.js`))
}

if (commands.presang.includes(command)) {
  moduleBin('presang')

} else if (commands.sverd.includes(command)) {
  moduleBin('sverd')

} else if (commands.waveorb.includes(command)) {
  require(fspath.join(__dirname, '..', 'scripts', `${command}.js`))

} else {
  console.log(`\nCommand not found: ${command}`)
  console.log(`\nRun 'waveorb help' to see available commands.`)
}
