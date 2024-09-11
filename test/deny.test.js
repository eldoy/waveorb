var i18n = require('../lib/i18n.js')
var loader = require('../lib/loader.js')
var dispatch = require('../lib/dispatch.js')
var locales = require('../lib/locales.js')

describe('deny', () => {
  it('should deny parameter keys', async () => {
    var app = await loader({ path: 'test/apps/app10', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {
        query: { evil: true }
      },
      t: i18n.t({ locales })
    }
    try {
      await dispatch($)
    } catch (e) {
      expect(e.data.error.message).toBe('field error')
      expect(e.data.query.length).toBe(1)
      expect(e.data.query[0]).toBe('evil')
    }
  })

  it('should deny with empty parameter keys', async () => {
    var app = await loader({ path: 'test/apps/app10', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {}
    }
    var result = await dispatch($)
    expect(result.error).toBeUndefined()
    expect(result.query.evil).toBeUndefined()
  })

  it('should deny parameter keys in function', async () => {
    var app = await loader({ path: 'test/apps/app11', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {
        query: { evil: true }
      },
      t: i18n.t({ locales })
    }
    try {
      await dispatch($)
    } catch (e) {
      expect(e.data.error.message).toBe('field error')
      expect(e.data.query.length).toBe(1)
      expect(e.data.query[0]).toBe('evil')
    }
  })
})
