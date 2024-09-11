var { util } = require('../index.js')

describe('util', () => {
  it('should rewrite CSS URLs', async () => {
    var css = `url('fonts/hello.otf')`
    var file = 'css/fonts.css'
    var result = util.rewriteCSSUrl(file, css)
    expect(result).toBe(`url('css/fonts/hello.otf')`)
  })

  it('should rewrite relative CSS URLs', async () => {
    var css = `url('../fonts/hello.otf')`
    var file = 'css/fonts.css'
    var result = util.rewriteCSSUrl(file, css)
    expect(result).toBe(`url('fonts/hello.otf')`)
  })

  it('should rewrite absolute CSS URLs', async () => {
    var css = `url('/fonts/hello.otf')`
    var file = 'css/fonts.css'
    var result = util.rewriteCSSUrl(file, css)
    expect(result).toBe(`url('fonts/hello.otf')`)
  })

  it('should not rewrite root CSS URLs', async () => {
    var css = `url('fonts/hello.otf')`
    var file = 'fonts.css'
    var result = util.rewriteCSSUrl(file, css)
    expect(result).toBe(`url('fonts/hello.otf')`)
  })

  it('should not rewrite root absolute CSS URLs', async () => {
    var css = `url('/fonts/hello.otf')`
    var file = 'fonts.css'
    var result = util.rewriteCSSUrl(file, css)
    expect(result).toBe(`url('fonts/hello.otf')`)
  })
})
