const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const os = require('os')
const extras = require('extras')
const t = require('terminal-kit').terminal

const name = process.argv[3]

if (!name) {
  console.log(`\nUsage: waveorb create [name]`)
  console.log(`\nPlease specify a directory name.`)
  process.exit(1)
}

if (name != '.') {
  if (extras.exist(name)) {
    console.log(`\nThe ${name} directory already exists.`)
    console.log(`\nPlease remove it or use another name.`)
    process.exit(1)
  } else {
    extras.mkdir(name)
    process.chdir(name)
  }
}

// Clone the template repo
const repo = 'https://github.com/eldoy/waveorb-templates.git'
const tmp = path.join(os.tmpdir(), extras.hex())
extras.run(`git clone --quiet --depth 1 ${repo} ${tmp}`)

const template = process.argv[4] || 'default'
const dir = path.join(tmp, template)

if (!extras.exist(dir)) {
  console.log(`\nTemplate ${template} does not exist.`)
  process.exit(1)
}

extras.copy(path.join(dir, '*'), '.')
extras.run('npm --quiet install')

console.log(`\nWaveorb app created, now do:\n`)
t.green(`cd ${name}\nnpm run serve\n\n`)
console.log([
  `Docs: https://waveorb.com/docs.html`,
  `Issues: https://github.com/eldoy/waveorb/issues\n`,
  `Created by Eldøy Projects, https://eldoy.com`
].join('\n'))
