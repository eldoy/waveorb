const fs = require('fs')
const tools = require('../lib/tools.js')
const { download } = require('dugg')()

async function main() {
  const file = tools.platformFile()
  if (tools.fileExists(file)) {
    console.log('Server is already downloaded.')
  } else {
    const url = `https://raw.githubusercontent.com/eldoy/waveorb-bin/master/${file}`
    await download(url, {
      ondata: function({ percent }) {
        process.stdout.write(`Server downloading, please wait: ${percent}%\r`)
      }
    })
  }
  fs.chmodSync(file, 0o755)
}

main()
