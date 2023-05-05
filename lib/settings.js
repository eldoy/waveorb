const _ = require('lodash')
const config = require('./config.js')

const DEFAULT_PORT = 5000

function getPort() {
  if (process.env.WAVEORB_PORT) {
    return parseInt(process.env.WAVEORB_PORT)
  }
  const isLocal = ['test', 'development'].includes(process.env.NODE_ENV)
  if (!isLocal && config.proxy) {
    return parseInt(config.proxy.split(':').reverse()[0])
  }
  return DEFAULT_PORT
}

module.exports = function settings(opt, app) {
  return _.merge(
    {
      port: getPort(),
      dir: process.env.WAVEORB_ASSETS || 'app/assets'
    },
    {
      middleware: app.middleware,
      routes: app.routes,
      cors: app.config?.cors,
      lang: app.config?.env?.lang
    },
    opt
  )
}
