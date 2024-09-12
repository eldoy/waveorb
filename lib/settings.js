var extras = require('extras')
var config = require('./config.js')()

var DEFAULT_PORT = 5000

function getPort() {
  if (process.env.WAVEORB_PORT) {
    return parseInt(process.env.WAVEORB_PORT)
  }
  var isLocal = ['test', 'development'].includes(process.env.NODE_ENV)
  if (!isLocal && config.proxy) {
    return parseInt(config.proxy.split(':').reverse()[0])
  }
  return DEFAULT_PORT
}

module.exports = function settings(opt, app) {
  return extras.merge(
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
