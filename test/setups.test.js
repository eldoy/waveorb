const { i18n, loader, dispatch, locales } = require('../index.js')

describe('setups', () => {
  it('should run setups', async () => {
    const app = await loader({ path: 'test/apps/app12', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {}
    }
    const result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should run nested setups', async () => {
    const app = await loader({ path: 'test/apps/app12', locales })
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
