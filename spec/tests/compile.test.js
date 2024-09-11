var compile = require('../../lib/compile.js')

it('should not compile templates if no matches', async ({ t }) => {
  var $ = { page: { content: 'hello' } }
  compile($)
  t.equal($.page.content, 'hello')
})

it('should compile translations', async ({ t }) => {
  var $ = { page: { content: "hello ${$.t('bye')}" } }
  $.t = () => 'word'
  compile($)
  t.equal($.page.content, "hello ${'word'}")
})

it('should compile links', async ({ t }) => {
  var $ = { page: { content: "hello ${$.link('bye')}" } }
  $.link = (a) => 'word' + a
  compile($)
  t.equal($.page.content, "hello ${'wordbye'}")
})

it('should compile links with line breaks', async ({ t }) => {
  var $ = { page: { content: "hello ${$.link(\n'bye'\n)}" } }
  $.link = (a) => 'word' + a
  compile($)
  t.equal($.page.content, "hello ${'wordbye'}")
})

it('should compile links with line breaks and spaces', async ({ t }) => {
  var $ = { page: { content: "hello ${$.link(     \n'bye'\n)}" } }
  $.link = (a) => 'word' + a
  compile($)
  t.equal($.page.content, "hello ${'wordbye'}")
})

it('should compile multiple links', async ({ t }) => {
  var $ = {
    page: { content: "hello ${$.link('bye')} bye ${$.link('bye')}" }
  }
  $.link = (a) => 'word' + a
  compile($)
  t.equal($.page.content, "hello ${'wordbye'} bye ${'wordbye'}")
})
