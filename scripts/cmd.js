const path = require('path')
const repl = require('repl')
const { loader } = require(path.join(__dirname, '..', 'index.js'))
const package = require(path.join(__dirname, '..', 'package.json'))

const api = {}

console.log(`
  Waveorb cmd v${package.version}
  Usage: waveorb cmd
  Docs: https://waveorb.com/doc/command-line.html#cmd

  Built in properties:
    app - app object
`)

async function start() {
  const cmd = repl.start('ᚠ ')
  api.app = await loader()
  Object.assign(cmd.context, api)
}
start()
