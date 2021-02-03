const fspath = require('path')
const { dir } = require('extras')
const base = fspath.join(process.cwd(), 'migrations')
const t = require('terminal-kit').terminal

let files = []
try {
  files = dir(base)
} catch(e) {
  console.log('No migrations found.')
  process.exit(0)
}

const { loader } = require('presang')

async function migrate() {
  const app = await loader()
  for (const file of files) {
    const script = require(fspath.join(base, file))
    if (typeof script === 'function') {
      t.bold(`* Migrating: ${file}\n`)
      await script(app)
    }
  }
  console.log('Done.')
  process.exit(0)
}

migrate()
