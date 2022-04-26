const furu = require('furu')
const orb = require('./orb.js')
const loader = require('./loader.js')
const dispatch = require('./dispatch.js')
const setup = require('./setup.js')

module.exports = async function(opt, app) {
  if (!app) app = await loader()

  const options = setup(opt, app)
  const server = furu(options, function(req, res) {
    const $ = orb(app, req, res, server)
    return dispatch($)
  })

  return { server, options, app }
}
