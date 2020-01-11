const fs = require('fs')
const tools = require('../lib/tools.js')
const { download } = require('dugg')()

async function main() {
  const file = tools.platformFile()
  if (tools.fileExists(file)) {
    console.log('Server is already installed.')
  } else {
    const url = `https://raw.githubusercontent.com/fugroup/waveorb-bin/master/${file}`
    await download(url, {
      ondata: function({ percent }) {
        process.stdout.write(`Server installing, please wait: ${percent}%\r`)
      }
    })
  }
  fs.chmodSync(file, 0o755)
}

main()
