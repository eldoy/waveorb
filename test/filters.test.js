const { i18n, loader, dispatch, locales } = require('../index.js')

describe('filters', () => {
  it('should run filters', async () => {
    const app = await loader({ path: 'test/apps/app6', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {}
    }
    const result = await dispatch($)
    expect(result.hello).toBe('bye')
    expect(result.logger).toBe('log')
  })
})
