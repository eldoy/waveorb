const _ = require('lodash')
const extras = require('extras')
const furu = require('furu')
const orb = require('./orb.js')
const loader = require('./loader.js')
const dispatch = require('./dispatch.js')

const OPTIONS = require('./options.js')

function getOptions(opt, app) {
  const { middleware, routes } = app
  return _.merge(
    OPTIONS,
    { middleware, routes },
    opt
  )
}

module.exports = async function(opt, app) {
  if (!app) app = await loader()

  const options = getOptions(opt, app)

  const server = furu(options, function(req, res) {
    if (req.params) {
      extras.transform(req.params)
    }
    // Set up orb object ($)
    const $ = orb(app, req, res, server)

    return dispatch($)
  })

  return { server, options, app }
}
