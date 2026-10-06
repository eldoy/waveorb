const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { util } = require('../index.js')

describe('util', () => {
  it('should rewrite CSS URLs', async () => {
    const css = `url('fonts/hello.otf')`
    const file = 'css/fonts.css'
    const result = util.rewriteCSSUrl(file, css)
    assert.strictEqual(result, `url('css/fonts/hello.otf')`)
  })

  it('should rewrite relative CSS URLs', async () => {
    const css = `url('../fonts/hello.otf')`
    const file = 'css/fonts.css'
    const result = util.rewriteCSSUrl(file, css)
    assert.strictEqual(result, `url('fonts/hello.otf')`)
  })

  it('should rewrite absolute CSS URLs', async () => {
    const css = `url('/fonts/hello.otf')`
    const file = 'css/fonts.css'
    const result = util.rewriteCSSUrl(file, css)
    assert.strictEqual(result, `url('fonts/hello.otf')`)
  })

  it('should not rewrite root CSS URLs', async () => {
    const css = `url('fonts/hello.otf')`
    const file = 'fonts.css'
    const result = util.rewriteCSSUrl(file, css)
    assert.strictEqual(result, `url('fonts/hello.otf')`)
  })

  it('should not rewrite root absolute CSS URLs', async () => {
    const css = `url('/fonts/hello.otf')`
    const file = 'fonts.css'
    const result = util.rewriteCSSUrl(file, css)
    assert.strictEqual(result, `url('fonts/hello.otf')`)
  })
})
