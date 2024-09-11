var i18n = require('../lib/i18n.js')
var loader = require('../lib/loader.js')
var dispatch = require('../lib/dispatch.js')
var locales = require('../lib/locales.js')

describe('action', () => {
  it('should match the action function', async () => {
    var app = await loader({ path: 'test/apps/app2', locales })
    var $ = {
      app,
      req: { route: 'createProject' },
      params: {}
    }
    var result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should match request pathname', async () => {
    var app = await loader({ path: 'test/apps/app8', locales })
    var $ = {
      app,
      req: { route: 'createProject' },
      params: {}
    }
    var result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should match nested action', async () => {
    var app = await loader({ path: 'test/apps/app9', locales })
    var $ = {
      app,
      req: { route: 'project/create' },
      params: {}
    }
    var result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should match deeply nested action', async () => {
    var app = await loader({ path: 'test/apps/app9', locales })
    var $ = {
      app,
      req: { route: 'deep/user/hello' },
      params: {}
    }
    var result = await dispatch($)
    expect(result.hello).toBe('hello')
  })

  it('should match action from pathname for index', async () => {
    var app = await loader({ path: 'test/apps/app19', locales })
    var $ = {
      app,
      req: {
        route: 'index'
      },
      params: {},
      t: i18n.t({ locales })
    }
    var result = await dispatch($)
    expect(result.hello).toBe('index')
  })

  it('should match action from pathname for about', async () => {
    var app = await loader({ path: 'test/apps/app19', locales })
    var $ = {
      app,
      req: {
        route: 'about'
      },
      params: {},
      t: i18n.t({ locales })
    }
    var result = await dispatch($)
    expect(result.hello).toBe('about')
  })

  it('should match action from pathname for project/create', async () => {
    var app = await loader({ path: 'test/apps/app19', locales })
    var $ = {
      app,
      req: {
        route: 'project/create'
      },
      params: {},
      t: i18n.t({ locales })
    }
    var result = await dispatch($)
    expect(result.hello).toBe('project/create')
  })
})
