const sh = require('shelljs')
const fspath = require('path')
const from = process.argv[3]
const to = process.argv[4]
if (from && to) {
  const scp = `scp -rp ${from} root@${to}:/root`
  console.log(scp)
  sh.exec(scp)
  const ssh = `ssh root@${to} 'systemctl restart waveorb@1'`
  console.log(ssh)
  sh.exec(ssh)
} else {
  console.log('Usage: waveorb deploy [from] [to]')
}
