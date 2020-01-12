#!/usr/bin/env node
const fspath = require('path')
const sh = require('shelljs')
const commands = {
  presang: ['serve', 'build'],
  sverd: ['boot', 'install', 'update', 'deploy'],
  waveorb: ['create', 'get', 'help', 'cmd']
}
const command = (process.argv[2] || 'help').trim()

function moduleBin(name) {
  const path = fspath.join(__dirname, '..', 'node_modules', name, 'bin', `${name}.js`)
  sh.exec(`${path} ${command}`)
}

if (commands.presang.includes(command)) {
  moduleBin('presang')

} else if (commands.sverd.includes(command)) {
  moduleBin('sverd')

} else if (commands.waveorb.includes(command)) {
  const path = fspath.join(__dirname, '..', 'scripts', `${command}.js`)
  require(path)

} else {
  console.log(`Command not found: ${command}`)
  console.log(`\nRun 'waveorb help' to see available commands.`)
}
