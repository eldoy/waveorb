const tools = require('../lib/tools.js')
const { exec, execSync } = require('child_process')

async function main() {
  const file = tools.platformFile()
  if (tools.fileExists(file)) {
    const server = exec(`./${file}`)

    server.stdout.on('data', function(data) {
      process.stdout.write(data.toString())
    })

    server.stderr.on('data', function(data) {
      process.stdout.write(data.toString())
    })

  } else {
    console.log(`Server not found, run 'waveorb install' and try again.`)
  }
}

main()
