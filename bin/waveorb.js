#!/usr/bin/env -S node --experimental-repl-await
const fspath = require('path')
const commands = {
  presang: ['serve', 'build', 'sitemap'],
  sverd: ['boot', 'install', 'update', 'deploy'],
  generate: ['generate'],
  translate: ['translate'],
  waveorb: ['serve', 'create', 'help', 'cmd', 'ping', 'migrate']
}
const command = (process.argv[2] || 'help').trim()

function moduleBin(name, dir) {
  require(fspath.join(__dirname, '..', 'node_modules', dir || name, 'bin', `${name}.js`))
}

if (commands.presang.includes(command)) {
  moduleBin('presang')

} else if (commands.sverd.includes(command)) {
  moduleBin('sverd')

} else if (commands.generate.includes(command)) {
  require('waveorb-generate')

} else if (commands.translate.includes(command)) {
  process.env.SNAKK_EXEC = 'waveorb'
  require('snakk')

} else if (commands.waveorb.includes(command)) {
  require(fspath.join(__dirname, '..', 'scripts', `${command}.js`))

} else {
  console.log(`\nCommand not found: ${command}`)
  console.log(`\nRun 'waveorb help' to see available commands.`)
}
