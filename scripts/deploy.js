const dns = require('dns')
const { run, read, exit, get } = require('extras')

// Find git repo address
let repo = get(`git config --get remote.origin.url`)
if (!repo) exit('Git repository URL not found!')

// Find domain from waveorb.json
let config
try {
  config = read('waveorb.json')
} catch(e) {
  exit(`No waveorb.json file found!`)
}

const domain = (config.domains || config.domains?.[0]?.names || '').split(' ')[0]
if (!domain) exit(`No valid domain name was found!`)

dns.lookup(domain, (err, ip) => {
  if(err) {
    exit(`The domain ${domain} does not have an ip address!`)
  }
  // ssh into domain and run deploy.js
  run(`ssh root@${ip} 'cd waveorb-server && node deploy.js ${repo}'`)
})
