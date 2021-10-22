const { i18n, loader, actions, locales } = require('../index.js')

describe('deny', () => {
  it('should deny parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = {
      app,
      params: {
        action: 'createProject',
        query: { evil: true }
      },
      t: i18n.t({ locales })
    }
    try {
      await actions($)
    } catch (e) {
      expect(e.data.error.message).toBe('is not allowed')
      expect(e.data.query.length).toBe(1)
      expect(e.data.query[0]).toBe('evil')
    }
  })

  it('should deny with empty parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.error).toBeUndefined()
    expect(result.query.evil).toBeUndefined()
  })

  it('should deny parameter keys in function', async () => {
    const app = await loader({ path: 'test/apps/app11', locales })
    const $ = {
      app,
      params: {
        action: 'createProject',
        query: { evil: true }
      },
      t: i18n.t({ locales })
    }
    try {
      await actions($)
    } catch (e) {
      expect(e.data.error.message).toBe('is not allowed')
      expect(e.data.query.length).toBe(1)
      expect(e.data.query[0]).toBe('evil')
    }
  })
})