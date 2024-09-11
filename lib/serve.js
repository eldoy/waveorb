var furu = require('furu')
var orb = require('./orb.js')
var loader = require('./loader.js')
var dispatch = require('./dispatch.js')
var settings = require('./settings.js')
var host = require('./host.js')

module.exports = async function (opt, app) {
  process.env.WAVEORB_SERVE = 1
  if (!app) app = await loader()

  var options = settings(opt, app)
  var server = furu(options, function (req, res) {
    var $ = orb(app, req, res, server)
    return dispatch($)
  })

  host(app)

  return { server, options, app }
}
