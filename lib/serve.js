const furu = require('furu')
const orb = require('./orb.js')
const loader = require('./loader.js')
const dispatch = require('./dispatch.js')
const options = require('./options.js')

module.exports = async function(opt, app) {
  if (!app) app = await loader()

  const server = furu(options(opt, app), function(req, res) {
    const $ = orb(app, req, res, server)
    return dispatch($)
  })

  return { server, options, app }
}
