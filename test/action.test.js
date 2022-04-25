const { i18n, loader, action, locales } = require('../index.js')

describe('action', () => {
  it('should be a function', async () => {
    expect(typeof action).toBe('function')
  })

  it('should match the action function', async () => {
    const app = await loader({ path: 'test/apps/app2', locales })
    const $ = {
      app,
      req: { pathname: '/createProject' },
      params: {}
    }
    const result = await action($)
    expect(result.hello).toBe('bye')
  })

  it('should match request pathname', async () => {
    const app = await loader({ path: 'test/apps/app8', locales })
    const $ = {
      app,
      req: { pathname: '/createProject' },
      params: {}
    }
    let result = await action($)
    expect(result.hello).toBe('bye')
  })

  it('should match nested action', async () => {
    const app = await loader({ path: 'test/apps/app9', locales })
    const $ = {
      app,
      req: { pathname: '/project/create' },
      params: {}
    }
    let result = await action($)
    expect(result.hello).toBe('bye')
  })

  it('should match deeply nested action', async () => {
    const app = await loader({ path: 'test/apps/app9', locales })
    const $ = {
      app,
      req: { pathname: '/deep/user/hello' },
      params: {}
    }
    let result = await action($)
    expect(result.hello).toBe('hello')
  })

  it('should match action from pathname for index', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await action($)
    expect(result.hello).toBe('index')
  })

  it('should match action from pathname for about', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/about'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await action($)
    expect(result.hello).toBe('about')
  })

  it('should match action from pathname for project/create', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/project/create'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await action($)
    expect(result.hello).toBe('project/create')
  })

  it('should match action from pathname for api/project/create', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/api/project/create'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await action($)
    expect(result.hello).toBe('project/create')
  })
})
