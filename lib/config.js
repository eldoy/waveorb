const { exist, read } = require('extras')

let config = {}
const env =
  process.env.WAVEORB_DEPLOY_ENV || process.env.NODE_ENV || 'development'

const name = ['waveorb', env, 'json'].filter(Boolean).join('.')
try {
  if (exist(name)) {
    config = read(name)
  }
} catch (e) {
  console.log('Can not read config:', e.message)
}

module.exports = config
