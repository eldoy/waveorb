const { i18n, loader, dispatch, locales } = require('../index.js')

describe('action', () => {
  it('should match the action function', async () => {
    const app = await loader({ path: 'test/apps/app2', locales })
    const $ = {
      app,
      req: { route: 'createProject' },
      params: {}
    }
    const result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should match request pathname', async () => {
    const app = await loader({ path: 'test/apps/app8', locales })
    const $ = {
      app,
      req: { route: 'createProject' },
      params: {}
    }
    let result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should match nested action', async () => {
    const app = await loader({ path: 'test/apps/app9', locales })
    const $ = {
      app,
      req: { route: 'project/create' },
      params: {}
    }
    let result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  it('should match deeply nested action', async () => {
    const app = await loader({ path: 'test/apps/app9', locales })
    const $ = {
      app,
      req: { route: 'deep/user/hello' },
      params: {}
    }
    let result = await dispatch($)
    expect(result.hello).toBe('hello')
  })

  it('should match action from pathname for index', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        route: 'index'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await dispatch($)
    expect(result.hello).toBe('index')
  })

  it('should match action from pathname for about', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        route: 'about'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await dispatch($)
    expect(result.hello).toBe('about')
  })

  it('should match action from pathname for project/create', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        route: 'project/create'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await dispatch($)
    expect(result.hello).toBe('project/create')
  })
})
