const client = require('waveorb-client')
const db = client({ ws: false }).http
const t = require('terminal-kit').terminal
const tools = require('../lib/tools.js')

function terminate() {
	setTimeout(function() { process.exit() }, 100)
}

t.bold('Waveorb command line console\n\n')
t('Connecting to http://localhost:4000\n\n')
t.green('Hit CTRL-C to quit.\n\n')

t.on('key', function(name, matches, data) {
  // console.log("'key' event:", name, matches, data)
  if (name === 'CTRL_C') {
    terminate()
  }
})

function updateBuffers(input) {
  for (const arr of [history, autoComplete]) {
    if (arr.includes(input)) {
      arr.splice(arr.indexOf(input), 1)
    }
    arr.push(input)
  }
}

let history = []
let autoComplete = ["db('projects/get')()"]

async function run(input = '') {
  input = input.trim()
  updateBuffers(input)

  let match
  if (match = input.match(/^help$/)) {
    t.green.bold('\n\n    help')
    t.green('    show help and usage\n')
    t.green.bold('    db')
    t.green('      the db command\n\n')
  } else if (match = input.match(/^db\(['"]?(.+\/.+?)['"]?\)\((.*)\)$/)) {
    let [cmd, path, arg] = match
    console.log({ cmd, path, arg })
    arg = tools.toObject(arg)
    console.log({ argobject: arg })
    const result = await db(path)(...arg)

    // console.log({ result })
    t.green('\n%s\n', JSON.stringify(result, null, 2))
  } else {
    t.red('\nCommand not found\n')
  }
}

function wrap(input) {
  return `(async function() { ${input} }())`
}

async function execute() {
  t('> ')
  t.inputField(
    { history, autoComplete, autoCompleteMenu: true },
    async function(error, input) {
      try {
        await run(input)
      } catch (e) {
        t.dim(e.message)
      }
      execute()
    }
  )
}

execute()
