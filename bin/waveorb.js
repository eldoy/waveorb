#!/usr/bin/env node
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

try {
  require(scripts[arg])
} catch (e) {
  console.log(`Command not found: ${arg}`)
}
