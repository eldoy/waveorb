const dns = require('dns')
const { run, exit, get } = require('extras')

const mode = process.argv[3]
const config = require('../lib/config.js')(mode)

console.info(`Using config:`)
console.info(config)

// Find git repo address
const repo = config?.git || get(`git config --get remote.origin.url`)
if (!repo) exit('Git repository URL not found!')

// ssh into domain and run deploy.js
function deploy(address) {
  let args = ''
  if (mode) {
    args += ` WAVEORB_DEPLOY_ENV=${mode}`
  }
  if (config.branch) {
    args += ` WAVEORB_DEPLOY_BRANCH=${config.branch}`
  }
  if (config.appdir) {
    args += ` WAVEORB_APP_DIR=${config.appdir}`
  }
  run(
    `ssh root@${address} 'cd waveorb-server &&${args} node deploy.js ${repo}'`
  )
}

// Use specified address if defined
if (config.address) {
  return deploy(config.address)
}

// Find main domain name
let domain = config.domains || ''
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
