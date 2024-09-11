var path = require('path')
var repl = require('repl')
var { loader } = require(path.join(__dirname, '..', 'index.js'))
var package = require(path.join(__dirname, '..', 'package.json'))

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

  var app = await loader()

  var objects
  if (typeof app.hooks.cmd == 'function') {
    objects = await app.hooks.cmd(app)
  }

  // Load db if it exists
  var db = app.objects.db

  // Load these objects into the cmd context
  var api = {
    app,
    db,
    ...objects
  }

  var cmd = repl.start('ᚠ ')
  Object.assign(cmd.context, api)
}
start()
