#!/usr/bin/env -S node --experimental-repl-await
const path = require('path')
const commands = {
  generate: ['generate'],
  waveorb: ['create', 'help', 'cmd', 'ping', 'migrate', 'serve', 'build', 'sitemap']
}
const command = (process.argv[2] || 'help').trim()

if (commands.generate.includes(command)) {
  require('waveorb-generate')

} else if (commands.waveorb.includes(command)) {
  require(path.join(__dirname, '..', 'scripts', `${command}.js`))

} else {
  console.log(`\nCommand not found: ${command}`)
  console.log(`\nRun 'waveorb help' to see available commands.`)
}
