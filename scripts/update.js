var dns = require('node:dns')
var extras = require('extras')
var config = require('../lib/config.js')()

var domain = (config.domains || config.domains?.[0]?.names || '').split(' ')[0]
if (!domain) {
  extras.exit(`No valid domain name was found!`)
}

dns.lookup(domain, (err, ip) => {
  if (err) {
    extras.exit(`The domain ${domain} does not have an ip address!`)
  }
  // ssh into domain and run update.js
  extras.exec(`ssh root@${ip} 'cd waveorb-server && node update.js'`)
})
