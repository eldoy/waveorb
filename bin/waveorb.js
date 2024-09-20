#!/usr/bin/env -S node --experimental-repl-await
var path = require('node:path')
var commands = {
  generate: ['generate'],
  waveorb: [
    'create',
    'boot',
    'upgrade',
    'deploy',
    'help',
    'cmd',
    'ping',
    'migrate',
    'serve',
    'build',
    'sitemap',
    'locales'
  ]
}
var command = (process.argv[2] || 'help').trim()

if (commands.generate.includes(command)) {
  require('waveorb-generate')
} else if (commands.waveorb.includes(command)) {
  require(path.join(__dirname, '..', 'scripts', `${command}.js`))
} else {
  console.log(`\nCommand not found: ${command}`)
  console.log(`\nRun 'waveorb help' to see available commands.`)
}
