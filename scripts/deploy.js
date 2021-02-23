const { run, read, exit, get } = require('extras')

// Find git repo address
let repo = get(`git config --get remote.origin.url`)
if (!repo) exit('Git repository URL not found!')

if (/github\.com/.test(repo)) {
  repo = repo.replace(/\.git$/, '')
}
console.log(`Found repo ${repo}`)

// Find domain from waveorb.js
let config
try {
  config = read('waveorb.js')
} catch(e) {
  exit(`No waveorb.js file found!`)
}

const domain = (config.domains || config.domains?.[0]?.names || '').split(' ')[0]
if (!domain) exit(`No valid domain name was found`)

// ssh into domain and run deploy.js
run(`ssh root@${domain} 'cd waveorb-server && node deploy.js ${repo}'`)
