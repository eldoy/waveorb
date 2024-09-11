var path = require('path')
var extras = require('extras')
var base = path.join(process.cwd(), 'migrations')
var t = require('terminal-kit').terminal

let files = []
try {
  files = extras.dir(base)
} catch (e) {
  console.log('No migrations found.')
  process.exit()
}

var loader = require('../lib/loader.js')

async function migrate() {
  var app = await loader()
  for (var file of files) {
    var script = require(path.join(base, file))
    if (typeof script === 'function') {
      t.bold(`* Migrating: ${file}\n`)
      await script(app)
    }
  }
  console.log('Done.')
  process.exit()
}

migrate()
