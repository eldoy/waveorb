const fspath = require('path')
const package = require(fspath.join(__dirname, '..', 'package.json'))
console.log(`\nWaveorb cmd v${package.version}\n`)

const server = process.argv[3]
if (!server) {
  console.log(`Usage: waveorb cmd [server]`)
  console.log(`Example: waveorb cmd http://localhost:5000`)
  process.exit(1)
}

const repl = require('repl')
const waveorb = require('waveorb-client')
const client = waveorb(server)

const api = {}
api.help = function() {
  console.log('\nInteract with your waveorb server.\n\n')
  console.log('Example usage:\n  result = await fetch({})\n')
}

api.fetch = async function(args) {
  try {
    return await client.fetch(args)
  } catch (e) {
    console.log(`${e.name}: ${e.message}`)
  }
}

console.log([
  'Available functions:\n',
  Object.keys(api).map(x => `  ${x}`).join('\n'),
  ''
].join('\n'))

const cmd = repl.start('λ ')
Object.assign(cmd.context, api)
