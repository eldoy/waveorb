var { i18n, loader, dispatch, locales } = require('../index.js')

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
