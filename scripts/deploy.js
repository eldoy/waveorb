const dns = require('dns')
const { run, exit, get } = require('extras')
const config = require('../lib/config.js')

// Find git repo address
let repo = config?.git || get(`git config --get remote.origin.url`)
if (!repo) exit('Git repository URL not found!')

// Find main domain name
let domain = config.domains
if (typeof domain == 'object') {
  domain = domain[0] || ''
  if (typeof domain != 'string') {
    domain = domain.names || ''
  }
}
domain = domain.split(' ')[0]

if (!domain) exit(`No valid domain name was found!`)

const env = process.argv[3]

dns.lookup(domain, (err, ip) => {
  if (err) {
    exit(`The domain ${domain} does not have an ip address!`)
  }
  // ssh into domain and run deploy.js
  const mode = env ? `WAVEORB_DEPLOY_ENV=${env} ` : ''
  run(`ssh root@${ip} 'cd waveorb-server && ${mode}node deploy.js ${repo}'`)
})
