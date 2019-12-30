const sh = require('shelljs')
const fspath = require('path')
const from = process.argv[3]
const to = process.argv[4]
if (from && to) {
  sh.exec(`scp -rp ${from} ${to}`)
} else {
  console.log('Usage: waveorb deploy [from] [to]')
}
