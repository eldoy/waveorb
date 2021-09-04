const dns = require('dns')
const { run, exit, get } = require('extras')
const { config } = require('../lib/setup.js')

// Find git repo address
let repo = config?.git || get(`git config --get remote.origin.url`)
if (!repo) exit('Git repository URL not found!')

const domain = (config.domains || config.domains?.[0]?.names || '').split(' ')[0]
if (!domain) exit(`No valid domain name was found!`)

dns.lookup(domain, (err, ip) => {
  if(err) {
    exit(`The domain ${domain} does not have an ip address!`)
  }
  // ssh into domain and run deploy.js
  run(`ssh root@${ip} 'cd waveorb-server && node deploy.js ${repo}'`)
})
