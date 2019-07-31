const http = require('https')
const fs = require('fs')
const { exec, execSync } = require('child_process')
const download = require('../lib/download.js')

async function main() {
  const os = process.platform
  const files = {
    darwin: 'server-macos',
    win32: 'server-win.exe'
  }
  const file = files[os] || 'server-linux'

  let serverFileExists = false
  try {
    serverFileExists = !!fs.statSync(file)
  } catch (e) {}

  // Download file if it doesn't exist
  if (!serverFileExists) {
    const url = `https://raw.githubusercontent.com/fugroup/waveorb-bin/master/${file}`
    await download(url)
  }
  fs.chmodSync(file, 0o755)

  const server = exec(`./${file}`)

  server.stdout.on('data', function(data) {
    process.stdout.write(data.toString())
  })

  server.stderr.on('data', function(data) {
    process.stdout.write(data.toString())
  })
}

main()
