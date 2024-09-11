var i18n = require('../lib/i18n.js')
var loader = require('../lib/loader.js')
var dispatch = require('../lib/dispatch.js')
var locales = require('../lib/locales.js')

describe('filters', () => {
  it('should run filters', async () => {
    var app = await loader({ path: 'test/apps/app6', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {}
    }
    var result = await dispatch($)
    expect(result.hello).toBe('bye')
    expect(result.logger).toBe('log')
  })
})
