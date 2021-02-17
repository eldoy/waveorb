const { i18n, loader, actions, locales } = require('../index.js')

describe('actions', () => {
  it('should be a function', async () => {
    expect(typeof actions).toBe('function')
  })

  it('should match the route main function', async () => {
    const app = await loader({ path: 'test/apps/app2', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should match the route before function', async () => {
    const app = await loader({ path: 'test/apps/app3', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should match the route after function', async () => {
    const app = await loader({ path: 'test/apps/app4', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should curry function result1', async () => {
    const app = await loader({ path: 'test/apps/app5', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('before')
  })

  it('should curry function result2', async () => {
    const app = await loader({ path: 'test/apps/app5', locales })
    const $ = { app, params: { action: 'updateProject' } }
    const result = await actions($)
    expect(result.hello).toBe('main')
  })

  it('should validate data', async () => {
    const app = await loader({ path: 'test/apps/app7', locales })
    const $ = {
      app,
      params: {
        action: 'createProject',
        data: {
          name: 'hey',
          key: 5
        }
      },
      t: i18n.t({ locales })
    }

    let result = await actions($)
    expect(result.error.message).toBe('validation error')
    expect(result.data.name).toEqual([ 'minimum length is 5' ])
    expect(result.data.key).toEqual([ 'must be one of 7, 8' ])

    $.params.data.name = 'hello'
    $.params.data.key = 7
    result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should match request pathname', async () => {
    const app = await loader({ path: 'test/apps/app8', locales })
    const $ = { app, params: { action: 'createProject' } }
    let result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should match nested actions', async () => {
    const app = await loader({ path: 'test/apps/app9', locales })
    const $ = { app, params: { action: 'project/create' } }
    let result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should match deeply nested actions', async () => {
    const app = await loader({ path: 'test/apps/app9', locales })
    const $ = { app, params: { action: 'deep/user/hello' } }
    let result = await actions($)
    expect(result.hello).toBe('hello')
  })

  it('should match actions from pathname for index', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await actions($)
    expect(result.hello).toBe('index')
  })

  it('should match actions from pathname for about', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/about'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await actions($)
    expect(result.hello).toBe('about')
  })

  it('should match actions from pathname for project/create', async () => {
    const app = await loader({ path: 'test/apps/app19', locales })
    const $ = {
      app,
      req: {
        pathname: '/project/create'
      },
      params: {},
      t: i18n.t({ locales })
    }
    let result = await actions($)
    expect(result.hello).toBe('project/create')
  })
})
