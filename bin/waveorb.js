#!/usr/bin/env -S node --experimental-repl-await
const path = require('path')
const commands = {
  presang: ['serve', 'build', 'sitemap'],
  generate: ['generate'],
  waveorb: ['serve', 'create', 'help', 'cmd', 'ping', 'migrate']
}
const command = (process.argv[2] || 'help').trim()

function moduleBin(name, dir) {
  require(path.join(__dirname, '..', 'node_modules', dir || name, 'bin', `${name}.js`))
}

if (commands.presang.includes(command)) {
  moduleBin('presang')

} else if (commands.generate.includes(command)) {
  require('waveorb-generate')

} else if (commands.waveorb.includes(command)) {
  require(path.join(__dirname, '..', 'scripts', `${command}.js`))

} else {
  console.log(`\nCommand not found: ${command}`)
  console.log(`\nRun 'waveorb help' to see available commands.`)
}
