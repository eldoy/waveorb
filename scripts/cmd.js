const client = require('waveorb-client')
const db = client({ ws: false }).http
const t = require('terminal-kit').terminal
const buffer = []
let open = true

function terminate() {
	// t.grabInput(false)
	setTimeout(function() { process.exit() }, 100)
}

t.bold('Waveorb command line console\n\n')
t('Connecting to http://localhost:4000\n\n')
t.green('Hit CTRL-C to quit.\n\n')

// t.grabInput()
t.on('key', function(name, matches, data) {
  // console.log("'key' event:", name, matches, data)
  if (name === 'CTRL_C') {
    terminate()
  }
})

// const COMMANDS = [
//   // db command
//   /db\((.+\/.+)\)\((.+)\)/
// ]

const history = []
const autoComplete = ["await db('projects/get')()"]

function wrap(input) {
  return `(async function() { ${input} }())`
}

async function execute() {
  t('> ')
  t.inputField(
    { history, autoComplete, autoCompleteMenu: true },
    async function(error, input) {
      let result
      input = wrap(input)
      try {
        result = await eval(input)
      } catch (e) {
        console.log(e.message)
        result = `Unknown command: ${input}`
      }
      t.green('\n%s\n', result)
      execute()
    }
  )
}

execute()

// t.on('terminal', function(name , data) {
// 	console.log("'terminal' event:", name, data)
// })
