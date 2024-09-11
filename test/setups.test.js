var loader = require('../lib/loader.js')
var dispatch = require('../lib/dispatch.js')
var locales = require('../lib/locales.js')

describe('setups', () => {
  it('should run setups', async () => {
    var app = await loader({ path: 'test/apps/app12', locales })
    var $ = {
      app,
      req: {
        method: 'GET',
        route: 'hello'
      },
      params: {}
    }
    var result = await dispatch($)
    expect(result).toBe('bye#log')
  })
})
