#!/usr/bin/env node
const fspath = require('path')
const COMMANDS = ['build', 'cmd', 'create', 'deploy', 'serve', 'help']
const command = process.argv[2] || 'help'

if (COMMANDS.includes(command)) {
  const path = fspath.join(__dirname, '..', 'scripts', `${command}.js`)
  require(path)
} else {
  console.log(`Command not found: ${command}`)
}
