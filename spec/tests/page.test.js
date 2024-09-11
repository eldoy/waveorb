var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')

it('should serve 404 page on not found', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app3', locales })
  var $ = {
    app,
    req: {
      method: 'GET',
      route: 'hello'
    },
    res: {
      getHeader: () => 'text/html'
    },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result, '404 not found')
})
