const furu = require('furu')
const orb = require('./orb.js')
const loader = require('./loader.js')
const dispatch = require('./dispatch.js')
const settings = require('./settings.js')

module.exports = async function (opt, app) {
  if (!app) app = await loader()

  const options = settings(opt, app)
  const server = furu(options, function (req, res) {
    const $ = orb(app, req, res, server)
    return dispatch($)
  })

  const host = app.config?.env?.host
  if (host) {
    console.log(`Serving app at ${host}\n`)
  }

  return { server, options, app }
}
