var i18n = require('../../lib/i18n.js')
var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')

it('should run filters', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app6', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result.hello, 'bye')
  t.equal(result.logger, 'log')
})
