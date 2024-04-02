const compile = require('../lib/compile.js')

describe('compile', () => {
  it('should not compile templates if no matches', async () => {
    const $ = { page: { content: 'hello' } }
    compile($)
    expect($.page.content).toBe('hello')
  })

  it('should compile translations', async () => {
    const $ = { page: { content: "hello ${$.t('bye')}" } }
    $.t = () => 'word'
    compile($)
    expect($.page.content).toBe("hello ${'word'}")
  })

  it('should compile links', async () => {
    const $ = { page: { content: "hello ${$.link('bye')}" } }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'}")
  })

  it('should compile links with line breaks', async () => {
    const $ = { page: { content: "hello ${$.link(\n'bye'\n)}" } }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'}")
  })

  it('should compile links with line breaks and spaces', async () => {
    const $ = { page: { content: "hello ${$.link(     \n'bye'\n)}" } }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'}")
  })
})
