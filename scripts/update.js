const dns = require('dns')
const { run, exit } = require('extras')
const config = require('../lib/config.js')()

const domain = (config.domains || config.domains?.[0]?.names || '').split(
  ' '
)[0]
if (!domain) exit(`No valid domain name was found!`)

dns.lookup(domain, (err, ip) => {
  if (err) {
    exit(`The domain ${domain} does not have an ip address!`)
  }
  // ssh into domain and run update.js
  run(`ssh root@${ip} 'cd waveorb-server && node update.js'`)
})
