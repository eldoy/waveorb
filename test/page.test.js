const { loader, dispatch, locales } = require('../index.js')

describe('page', () => {
  it('should serve 404 page on not found', async () => {
    const app = await loader({ path: 'test/apps/app3', locales })
    const $ = {
      app,
      req: {
        method: 'GET',
        route: 'hello'
      },
      params: {}
    }
    const result = await dispatch($)
    expect(result).toBe('404 not found')
  })
})
