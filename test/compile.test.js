const compile = require('../lib/compile.js')
const i18n = require('../lib/i18n.js')

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

  it('should compile multiple links', async () => {
    const $ = {
      page: { content: "hello ${$.link('bye')} bye ${$.link('bye')}" }
    }
    $.link = (a) => 'word' + a
    compile($)
    expect($.page.content).toBe("hello ${'wordbye'} bye ${'wordbye'}")
  })

  it('should disallow most characters for t', async () => {
    const $ = {
      page: { content: "hello ${$.t('invalid/chars')}" },
      t: i18n.t({
        lang: 'en',
        locales: { en: { 'invalid/chars': 'something' } }
      })
    }
    compile($)
    expect($.page.content).toBe("hello ${'invalid/chars'}")
  })

  it('should disallow "__" lookups for t', async () => {
    const $ = {
      page: { content: "hello ${$.t('__whatever')}" },
      t: i18n.t({
        lang: 'en',
        locales: { en: { __whatever: 'something' } }
      })
    }
    compile($)
    expect($.page.content).toBe("hello ${'__whatever'}")
  })
})
