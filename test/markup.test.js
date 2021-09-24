const markup = require('../lib/markup.js')
const loader = require('../lib/loader.js')

const req = { pathname: '/', query: {} }
const res = {
  setHeader: function() {}
}

const t = function(key) {
  return key
}

let $, app

function flat(result) {
  return (result || '').split('\n').map(x => x.trim()).join('')
}

describe('markup', () => {
  beforeAll(async () => {
    process.env.WAVEORB_APP = 'test/apps/app22'
    app = await loader()
  })

  beforeEach(() => {
    $ = { app, req, res, t, page: {} }
    req.pathname = '/'
  })

  it('should not have a layout', async () => {
    req.pathname = '/nolayout'
    const result = await markup($)
    expect(flat(result)).toBe('<div>NoLayout</div>')
  })

  it('should compile templates', async () => {
    req.pathname = '/compile'
    $.app.config = {
      routes: { compile: true }
    }
    const result = await markup($)
    expect(flat(result)).toBe(
      `<!doctype html><html><head><title>Compile</title></head><body><div>function hello() {return 'name';}</div></body></html>`
    )
  })

  it('should compile templates with backtick', async () => {
    req.pathname = '/backtick'
    $.app.config = {
      routes: { compile: true }
    }
    const result = await markup($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>Compile Backtick</title></head><body><div>function hello(type) {return `name.${type}`;}</div></body></html>'
    )
  })

  it('should compile with escaped strings', async () => {
    req.pathname = '/compile'
    $.app.config = {
      routes: { compile: true }
    }
    $.app.pages.compile = async function($) {
      $.page.title = 'Compile Translation'
      function hello() {
        var hello = $.t('hello')
        var bye = $.t('bye')
      }
      return `<div>${hello}</div>`
    }
    $.t = function (key) {
      if (key === 'hello') return "You don't"
      if (key === 'bye') return "Bye \"YEAH\" don't"
    }
    const result = await markup($)
    expect(flat(result)).toBe(
      "<!doctype html><html><head><title>Compile Translation</title></head><body><div>function hello() {var hello = \"You don't\";var bye = \"Bye \\\"YEAH\\\" don't\";}</div></body></html>"
    )
  })
})
