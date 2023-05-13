const dns = require('dns')
const { run, exit, get } = require('extras')
const config = require('../lib/config.js')

const env = process.argv[3]

// Find git repo address
const repo = config?.git || get(`git config --get remote.origin.url`)
if (!repo) exit('Git repository URL not found!')

// ssh into domain and run deploy.js
function deploy(address) {
  const mode = env ? `WAVEORB_DEPLOY_ENV=${env} ` : ''
  run(
    `ssh root@${address} 'cd waveorb-server && ${mode}node deploy.js ${repo}'`
  )
}

// Use specified address if defined
if (config.address) {
  return deploy(config.address)
}

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

dns.lookup(domain, (err, address) => {
  if (err) {
    exit(`The domain ${domain} does not have an ip address!`)
  }
  deploy(address)
})
