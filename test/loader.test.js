const fs = require('fs')
const path = require('path')
const loader = require('../lib/loader.js')

describe('loader', () => {
  beforeEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should load an application', async () => {
    const app = await loader()
    expect(typeof app).toBe('object')
    expect(typeof app.assets).toBe('object')
  })

  it('should load an application from process env', async () => {
    process.env.WAVEORB_APP = 'test/apps/app1'
    const app = await loader()
    expect(typeof app).toBe('object')
    expect(app.config.env.hello).toBe('bye')
  })

  it('should use default main in actions', async () => {
    process.env.WAVEORB_APP = 'test/apps/app20'
    const app = await loader()
    const api = app.actions.project
    expect(typeof api.create).toBe('function')
    expect(typeof api.update).toBe('function')
    expect(typeof api.get).toBe('function')
    expect(typeof api.find).toBe('function')
    expect(typeof api.count).toBe('function')
    expect(typeof api.update).toBe('function')
    expect(typeof api.delete).toBe('function')
    expect(typeof api.something).toBe('undefined')
  })

  it('should load markdown files', async () => {
    process.env.WAVEORB_APP = 'test/apps/app21'
    const app = await loader()
    expect(typeof app.pages.article).toBe('function')
    expect(typeof app.pages.data).toBe('function')
  })

  it('should load routes', async () => {
    process.env.WAVEORB_APP = 'test/apps/app24'
    const { routes } = await loader()
    expect(Object.keys(routes).length).toBe(14)
    expect(routes['/']).toBe('index')
    expect(routes['/about']).toBe('about')
    expect(routes['/page']).toBe('page')
    expect(routes['/articles/']).toBe('articles/index')
    expect(routes['/articles/way']).toBe('articles/way')
    expect(routes['/docs/hello']).toBe('docs/hello')
    expect(routes['/articles/_show']).toBe('articles/_show')
    expect(routes['/docs/_something/']).toBe('docs/_something/index')
    expect(routes['/_category/']).toBe('_category/index')
    expect(routes['/_link']).toBe('_link')
    expect(routes['/_mix/trix/_flix/deep']).toBe('_mix/trix/_flix/deep')
    expect(routes['/_category/_article']).toBe('_category/_article')
    expect(routes['/_year/_date/_day/']).toBe('_year/_date/_day/index')
    expect(routes['/_year/_date/']).toBe('_year/_date/index')
  })
})
