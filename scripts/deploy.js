var dns = require('node:dns')
var extras = require('extras')

var mode = process.argv[3]
var config = require('../lib/config.js')(mode)

console.log(`Using config:`)
console.log(config)

// Find git repo address
var repo = config?.git || extras.capture(`git config --get remote.origin.url`)

if (!repo) {
  extras.exit('Git repository URL not found!')
}

// ssh into domain and run deploy.js
function deploy(address) {
  var args = ''
  if (mode) {
    args += ` WAVEORB_DEPLOY_ENV=${mode}`
  }
  if (config.branch) {
    args += ` WAVEORB_DEPLOY_BRANCH=${config.branch}`
  }
  extras.exec(
    `ssh root@${address} 'cd waveorb-server &&${args} node deploy.js ${repo}'`
  )
}

// Use specified address if defined
if (config.address) {
  return deploy(config.address)
}

// Find main domain name
var domain = config.domains || ''
if (typeof domain == 'object') {
  domain = domain[0] || ''
  if (typeof domain != 'string') {
    domain = domain.names || ''
  }
}
domain = domain.split(' ')[0]

if (!domain) {
  extras.exit(`No valid domain name was found!`)
}

dns.lookup(domain, (err, address) => {
  if (err) {
    extras.exit(`The domain ${domain} does not have an ip address!`)
  }
  deploy(address)
})
