const { exist, read } = require('extras')
const types = ['yml', 'json', 'js']

let config = {}
const env =
  process.env.WAVEORB_DEPLOY_ENV || process.env.NODE_ENV || 'development'

for (const type of types) {
  const name = ['waveorb', env, type].filter(Boolean).join('.')
  try {
    if (exist(name)) {
      config = read(name)
      break
    }
  } catch (e) {
    console.log('Can not read config:', e.message)
  }
}

module.exports = config
