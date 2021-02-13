const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const os = require('os')
const sh = require('shelljs')

const appName = process.argv[3]

if (!appName) {
  console.log(`\nUsage: waveorb create [name]`)
  console.log(`\nPlease specify a directory name.`)
  process.exit(1)
}

if (fs.existsSync(appName)) {
  console.log(`\nThe ${appName} directory already exists.`)
  console.log(`\nPlease delete it and try again.`)
  process.exit(1)
}

const repo = 'https://github.com/eldoy/waveorb-templates.git'
const dir = crypto.randomBytes(20).toString('hex')
const tmp = path.join(os.tmpdir(), dir)
sh.exec(`git clone --depth 1 ${repo} ${tmp}`)

const templateName = process.argv[4] || 'default'
const dir = path.join(tmp, templateName)

if (fs.existsSync(dir)) {
  sh.cp('-R', dir, appName)
  console.log([
    `\nApp ${templateName} copied to ${appName}, now do:\n`,
    `cd ${appName}`,
    `npm i`,
    `npm run serve\n`,
    `Docs: https://waveorb.com/docs.html`,
    `Issues: https://github.com/eldoy/waveorb/issues\n`,
    `Created by Eldøy Projects, https://eldoy.com`
  ].join('\n'))
} else {
  console.log(`\nTemplate ${templateName} does not exist.`)
}
