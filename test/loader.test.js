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

  it('should load markdown files', async () => {
    process.env.WAVEORB_APP = 'test/apps/app21'
    const app = await loader()
    expect(typeof app.pages.article).toBe('function')
    expect(typeof app.pages.data).toBe('function')
    const $ = { page: { title: 'hello' } }
    const page1 = await app.pages.article($)
    expect(page1.includes('Hello!')).toEqual(true)
    const page2 = await app.pages.data($)
    expect(page2.includes('Nice!')).toEqual(true)
  })

  it('should load routes', async () => {
    process.env.WAVEORB_APP = 'test/apps/app24'
    const { routes } = await loader()
    expect(Object.keys(routes).length).toBe(14)
    expect(routes['get#/']).toBe('index')
    expect(routes['get#/about']).toBe('about')
    expect(routes['get#/page']).toBe('page')
    expect(routes['get#/articles/']).toBe('articles/index')
    expect(routes['get#/articles/way']).toBe('articles/way')
    expect(routes['get#/docs/hello']).toBe('docs/hello')
    expect(routes['get#/articles/_show']).toBe('articles/_show')
    expect(routes['get#/docs/_something/']).toBe('docs/_something/index')
    expect(routes['get#/_category/']).toBe('_category/index')
    expect(routes['get#/_link']).toBe('_link')
    expect(routes['get#/_mix/trix/_flix/deep']).toBe('_mix/trix/_flix/deep')
    expect(routes['get#/_category/_article']).toBe('_category/_article')
    expect(routes['get#/_year/_date/_day/']).toBe('_year/_date/_day/index')
    expect(routes['get#/_year/_date/']).toBe('_year/_date/index')
  })
})
