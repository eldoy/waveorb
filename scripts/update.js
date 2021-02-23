const { run, read, exit, get } = require('extras')

// Find domain from waveorb.js
let config
try {
  config = read('waveorb.js')
} catch(e) {
  exit(`No waveorb.js file found!`)
}

const domain = (config.domains || config.domains?.[0]?.names || '').split(' ')[0]
if (!domain) exit(`No valid domain name was found!`)

// ssh into domain and run update.js
run(`ssh root@${domain} 'cd waveorb-server && node update.js ${repo}'`)
