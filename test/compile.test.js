var compile = require('../lib/compile.js')

describe('compile', () => {
  it('should not compile templates if no matches', async () => {
    var $ = { page: { content: 'hello' } }
    compile($)
    expect($.page.content).toBe('hello')
  })

  it('should compile translations', async () => {
    var $ = { page: { content: "hello ${$.t('bye')}" } }
    $.t = () => 'word'
    compile($)
    expect($.page.content).toBe("hello ${'word'}")
  })

  it('should compile links', async () => {
    var $ = { page: { content: "hello ${$.link('bye')}" } }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'}")
  })

  it('should compile links with line breaks', async () => {
    var $ = { page: { content: "hello ${$.link(\n'bye'\n)}" } }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'}")
  })

  it('should compile links with line breaks and spaces', async () => {
    var $ = { page: { content: "hello ${$.link(     \n'bye'\n)}" } }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'}")
  })

  it('should compile multiple links', async () => {
    var $ = {
      page: { content: "hello ${$.link('bye')} bye ${$.link('bye')}" }
    }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'} bye ${'wordbye'}")
  })
})
