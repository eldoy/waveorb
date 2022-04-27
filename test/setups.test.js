const { i18n, loader, dispatch, locales } = require('../index.js')

describe('setups', () => {
  it('should run setups', async () => {
    const app = await loader({ path: 'test/apps/app12', locales })
    const $ = {
      app,
      req: {
        method: 'GET',
        route: 'hello'
      },
      params: {}
    }
    const result = await dispatch($)
    expect(result).toBe('bye#log')
  })
})
