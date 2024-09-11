var { loader, dispatch, locales } = require('../index.js')

describe('page', () => {
  it('should serve 404 page on not found', async () => {
    var app = await loader({ path: 'test/apps/app3', locales })
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
    expect(result).toBe('404 not found')
  })
})
