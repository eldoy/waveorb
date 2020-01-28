const fspath = require('path')
const repl = require('repl')
const waveorb = require('waveorb-client')

const package = require(fspath.join(__dirname, '..', 'package.json'))

const server = process.argv[3] || 'http://localhost:5000'
const client = waveorb(server)

const api = {}
api.help = function() {
  console.log([
    `\nWaveorb cmd v${package.version}\n`,
    `Usage: waveorb cmd [server]\n`,
    `Example: await fetch({ action: 'name' })\n`,
    `Docs: https://waveorb.com/doc/command-line.html#cmd\n`,
    'Available functions:\n',
    Object.keys(api).map(x => `  ${x}()`).join('\n'),
    `\nConnected to ${server}\n`
  ].join('\n'))
}

api.fetch = async function(params, options) {
  try {
    return await client.fetch(params, options)
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
}

api.upload = async function(params, options) {
  try {
    return await client.upload(params, options)
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
}

api.help()

const cmd = repl.start('λ ')
Object.assign(cmd.context, api)
