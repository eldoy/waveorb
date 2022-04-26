const _ = require('lodash')
const { exist, read } = require('extras')

const DEFAULT_PORT = 5000

module.exports = function setup(opt, app) {
  const { middleware, routes } = app
  return _.merge(
    {
      port: getPort(),
      dir: process.env.WAVEORB_ASSETS || 'app/assets'
    },
    { middleware, routes },
    opt
  )
}

function getConfig() {
  const types = ['json', 'js', 'yml']
  for (const type of types) {
    const name = `waveorb.${type}`
    if (exist(name)) {
      return read(name)
    }
  }
  return {}
}

function getPort() {
  if (process.env.WAVEORB_PORT) {
    return parseInt(process.env.WAVEORB_PORT)
  }

  const config = getConfig()
  const isProduction = process.env.NODE_ENV == 'production'
  if (config.proxy && isProduction) {
    return parseInt(config.proxy.split(':').reverse()[0])
  }

  return DEFAULT_PORT
}


