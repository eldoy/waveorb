const path = require('path')
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
const tmp = path.join(os.tmpdir(), extras.hex())
const template = process.argv[4] || 'default'
let repo = 'https://github.com/eldoy/waveorb-templates.git'
let dir = path.join(tmp, template)

// Support http and git templates
if (/^(https?:|\w+@)/.test(template)) {
  repo = template
  dir = tmp
}

extras.run(`git clone --quiet --depth 1 ${repo} ${tmp}`)

if (!extras.exist(dir)) {
  console.log(`\nTemplate ${template} does not exist.`)
  process.exit(1)
}

extras.copy(path.join(dir, '*'), '.')
extras.copy(path.join(dir, '.*'), '.')

t('\nInstalling packages, please wait...\n\n')
extras.run('npm install', { silent: true })

t.bold(`\nWaveorb app created, now do:\n\n`)
if (name != '.') t.green(`cd ${name}\n`)
t.green(`npm run dev\n\n`)
console.log(
  [
    `Docs: https://waveorb.com/docs`,
    `Issues: https://github.com/eldoy/waveorb/issues\n`,
    `Created by Eldøy Projects, https://eldoy.com`
  ].join('\n')
)
