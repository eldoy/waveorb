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
  } catch (e) {
    console.log('FILE DOES NOT EXIST')
  }

  // Download file if it doesn't exist
  if (!serverFileExists) {
    const url = `https://raw.githubusercontent.com/fugroup/waveorb-bin/master/${file}`
    console.log('DOWNLOAD URL:', url)
    await download(url)
  }
  console.log('Starting server')
  fs.chmodSync(file, 0o755)

  const server = exec(`./${file}`)

  server.stdout.on('data', function(data) {
    process.stdout.write(data.toString())
  })

  server.stdout.on('exit', function(data) {
    console.log('SERVER EXIT')
    console.log(data)
  })

  server.stdout.on('error', function(data) {
    console.log('SERVER ERROR')
    console.log(data)
  })

  server.stdout.on('end', function(data){
    console.log('SERVER END')
    console.log(data)
  })

  // TODO: Find out if both of these are needed
  server.stderr.on('data', function(data) {
    process.stdout.write(data.toString())
  })

  server.stderr.on('error', function(data) {
    process.stdout.write(data.toString())
  })
}

main()