var util = require('../../lib/util.js')

it('should rewrite CSS URLs', async ({ t }) => {
  var css = `url('fonts/hello.otf')`
  var file = 'css/fonts.css'
  var result = util.rewriteCSSUrl(file, css)
  t.equal(result, `url('css/fonts/hello.otf')`)
})

it('should rewrite relative CSS URLs', async ({ t }) => {
  var css = `url('../fonts/hello.otf')`
  var file = 'css/fonts.css'
  var result = util.rewriteCSSUrl(file, css)
  t.equal(result, `url('fonts/hello.otf')`)
})

it('should rewrite absolute CSS URLs', async ({ t }) => {
  var css = `url('/fonts/hello.otf')`
  var file = 'css/fonts.css'
  var result = util.rewriteCSSUrl(file, css)
  t.equal(result, `url('fonts/hello.otf')`)
})

it('should not rewrite root CSS URLs', async ({ t }) => {
  var css = `url('fonts/hello.otf')`
  var file = 'fonts.css'
  var result = util.rewriteCSSUrl(file, css)
  t.equal(result, `url('fonts/hello.otf')`)
})

it('should not rewrite root absolute CSS URLs', async ({ t }) => {
  var css = `url('/fonts/hello.otf')`
  var file = 'fonts.css'
  var result = util.rewriteCSSUrl(file, css)
  t.equal(result, `url('fonts/hello.otf')`)
})
