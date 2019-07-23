const download = require('./lib/download.js')

const file = 'server-macos'
// const url = `https://github.com/fugroup/waveorb-bin/raw/master/${file}`
const url = `https://raw.githubusercontent.com/fugroup/waveorb-bin/master/${file}`
console.log('Downloading ' + url)

async function run() {
  console.log('Downloading file')
  try {
    await download(url, 'server')
    console.log('Download done')
  } catch (e) {
    console.log('Download failed')
    console.log(e.message)
  }
}

run()
