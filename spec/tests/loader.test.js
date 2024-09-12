var loader = require('../../lib/loader.js')

beforeEach(() => {
  delete process.env.WAVEORB_APP
})

it('should load an application', async ({ t }) => {
  var app = await loader()
  t.equal(typeof app, 'object')
})

it('should load an application from process env', async ({ t }) => {
  process.env.WAVEORB_APP = 'spec/apps/app1'
  var app = await loader()
  t.equal(typeof app, 'object')
  t.equal(app.config.env.hello, 'bye')
})

it('should load markdown files', async ({ t }) => {
  process.env.WAVEORB_APP = 'spec/apps/app21'
  var app = await loader()
  t.equal(typeof app.pages.article, 'function')
  t.equal(typeof app.pages.data, 'function')
  var $ = { page: { title: 'hello' } }
  var page1 = await app.pages.article($)
  t.equal(page1.includes('Hello!'), true)
  var page2 = await app.pages.data($)
  t.equal(page2.includes('Nice!'), true)
})

it('should load routes', async ({ t }) => {
  process.env.WAVEORB_APP = 'spec/apps/app24'
  var { routes } = await loader()
  t.equal(Object.keys(routes).length, 14)
  t.equal(routes['get#/'], 'index')
  t.equal(routes['get#/about'], 'about')
  t.equal(routes['get#/page'], 'page')
  t.equal(routes['get#/articles/'], 'articles/index')
  t.equal(routes['get#/articles/way'], 'articles/way')
  t.equal(routes['get#/docs/hello'], 'docs/hello')
  t.equal(routes['get#/articles/_show'], 'articles/_show')
  t.equal(routes['get#/docs/_something/'], 'docs/_something/index')
  t.equal(routes['get#/_category/'], '_category/index')
  t.equal(routes['get#/_link'], '_link')
  t.equal(routes['get#/_mix/trix/_flix/deep'], '_mix/trix/_flix/deep')
  t.equal(routes['get#/_category/_article'], '_category/_article')
  t.equal(routes['get#/_year/_date/_day/'], '_year/_date/_day/index')
  t.equal(routes['get#/_year/_date/'], '_year/_date/index')
})
