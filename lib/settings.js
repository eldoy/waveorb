const _ = require('lodash')
const config = require('./config.js')

const DEFAULT_PORT = 5000

function getPort() {
  if (process.env.WAVEORB_PORT) {
    return parseInt(process.env.WAVEORB_PORT)
  }
  const isProduction = process.env.NODE_ENV == 'production'
  if (config.proxy && isProduction) {
    return parseInt(config.proxy.split(':').reverse()[0])
  }
  return DEFAULT_PORT
}

module.exports = function settings(opt, app) {
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
