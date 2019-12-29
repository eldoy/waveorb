#!/usr/bin/env node
const fspath = require('path')
const name = process.argv[2] || 'help'
const path = fspath.join(__dirname, '..', 'scripts', `${name}.js`)
try {
  require(path)
} catch (e) {
  console.log(`Command not found: ${name}`)
}
