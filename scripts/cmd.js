const path = require('path')
const repl = require('repl')
const { loader } = require(path.join(__dirname, '..', 'index.js'))
const package = require(path.join(__dirname, '..', 'package.json'))

console.log(`
  Waveorb cmd v${package.version}
  Usage: waveorb cmd
  Docs: https://waveorb.com/doc/command-line#cmd

  Built in properties:
    app - app object
`)

async function start() {
  // Indicate that we are running a cmd session
  process.env.WAVEORB_CMD = 1

  const cmd = repl.start('ᚠ ')
  const app = await loader()

  let objects
  if (typeof app.hooks.cmd == 'function') {
    objects = await app.hooks.cmd(app)
  }

  // Load db if it exists
  const db = app.objects.db

  // Load these objects into the cmd context
  const api = {
    app,
    db,
    ...objects
  }
  Object.assign(cmd.context, api)
}
start()
