const { describe, it, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const loader = require('../lib/loader.js')

describe('loader', () => {
  beforeEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should load an application', async () => {
    const app = await loader()
    assert.strictEqual(typeof app, 'object')
  })

  it('should load an application from process env', async () => {
    process.env.WAVEORB_APP = 'test/apps/app1'
    const app = await loader()
    assert.strictEqual(typeof app, 'object')
    assert.strictEqual(app.config.env.hello, 'bye')
  })

  it('should load markdown files', async () => {
    process.env.WAVEORB_APP = 'test/apps/app21'
    const app = await loader()
    assert.strictEqual(typeof app.pages.article, 'function')
    assert.strictEqual(typeof app.pages.data, 'function')
    const $ = { page: { title: 'hello' } }
    const page1 = await app.pages.article($)
    assert.deepStrictEqual(page1.includes('Hello!'), true)
    const page2 = await app.pages.data($)
    assert.deepStrictEqual(page2.includes('Nice!'), true)
  })

  it('should load routes', async () => {
    process.env.WAVEORB_APP = 'test/apps/app24'
    const { routes } = await loader()
    assert.strictEqual(Object.keys(routes).length, 14)
    assert.strictEqual(routes['get#/'], 'index')
    assert.strictEqual(routes['get#/about'], 'about')
    assert.strictEqual(routes['get#/page'], 'page')
    assert.strictEqual(routes['get#/articles/'], 'articles/index')
    assert.strictEqual(routes['get#/articles/way'], 'articles/way')
    assert.strictEqual(routes['get#/docs/hello'], 'docs/hello')
    assert.strictEqual(routes['get#/articles/_show'], 'articles/_show')
    assert.strictEqual(routes['get#/docs/_something/'], 'docs/_something/index')
    assert.strictEqual(routes['get#/_category/'], '_category/index')
    assert.strictEqual(routes['get#/_link'], '_link')
    assert.strictEqual(
      routes['get#/_mix/trix/_flix/deep'],
      '_mix/trix/_flix/deep'
    )
    assert.strictEqual(routes['get#/_category/_article'], '_category/_article')
    assert.strictEqual(
      routes['get#/_year/_date/_day/'],
      '_year/_date/_day/index'
    )
    assert.strictEqual(routes['get#/_year/_date/'], '_year/_date/index')
  })
})
