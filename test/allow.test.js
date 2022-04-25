const { i18n, loader, action, locales } = require('../index.js')

describe('allow', () => {
  it('should not allow extra parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = {
      app,
      req: {
        pathname: '/createProject'
      },
      params: {
        query: { something: 'hello', excess: false }
      },
      t: i18n.t({ locales })
    }
    try {
      await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('field error')
      expect(e.data.query.length).toBe(1)
      expect(e.data.query[0]).toBe('excess')
    }
  })

  it('should allow with empty parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = {
      app,
      req: {
        pathname: '/createProject'
      },
      params: {}
    }
    const result = await action($)
    expect(result.error).toBeUndefined()
    expect(result.query.evil).toBeUndefined()
  })

  it('should allow parameter keys in function', async () => {
    const app = await loader({ path: 'test/apps/app11', locales })
    const $ = {
      app,
      req: {
        pathname: '/createProject'
      },
      params: {
        query: { something: 'hello', excess: false }
      },
      t: i18n.t({ locales })
    }
    try {
      await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('field error')
      expect(e.data.query.length).toBe(1)
      expect(e.data.query[0]).toBe('excess')
    }
  })
})