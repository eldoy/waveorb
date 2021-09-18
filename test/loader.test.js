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
    expect(typeof api.create.main).toBe('function')
    expect(typeof api.update.main).toBe('function')
    expect(typeof api.get.main).toBe('function')
    expect(typeof api.find.main).toBe('function')
    expect(typeof api.count.main).toBe('function')
    expect(typeof api.update.main).toBe('function')
    expect(typeof api.delete.main).toBe('function')
    expect(typeof api.custom.main).toBe('function')
    expect(typeof api.something.main).toBe('undefined')
    expect(api.not.main).toEqual(false)
  })

  it('should load markdown files', async () => {
    process.env.WAVEORB_APP = 'test/apps/app21'
    const app = await loader()
    expect(typeof app.pages.article).toBe('function')
    expect(typeof app.pages.data).toBe('function')
  })

  it('should load routes', async () => {
    process.env.WAVEORB_APP = 'test/apps/app23'
    const app = await loader()
    expect(typeof app.routes).toBe('object')
    expect(app.routes.about).toBe('about')
    expect(app.routes.index).toBe('index')
    expect(app.routes['docs/main']).toBe('docs.main')
    expect(app.routes['article/_show']).toBe('article._show')
  })
})
