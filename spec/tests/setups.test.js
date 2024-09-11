var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')

it('should run setups', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app12', locales })
  var $ = {
    app,
    req: {
      method: 'GET',
      route: 'hello'
    },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result, 'bye#log')
})
