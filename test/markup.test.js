const markup = require('../lib/markup.js')
const pager = require('../lib/pager.js')
const loader = require('../lib/loader.js')

const req = { pathname: '/', query: {} }
const res = {
  setHeader: function() {}
}

const about = async function($) {
  $.page.title = 'About'
  return `<div>About</div>`
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

  // BELONGS HERE

  // TODO: Add test for should have layout

  it('should not have a layout', async () => {
    req.pathname = '/nolayout.html'
    const result = await markup($)
    expect(flat(result)).toBe('<div>NoLayout</div>')
  })

  it('should compile templates', async () => {
    req.pathname = '/compile.html'
    $.app.config = {
      routes: { compile: true }
    }
    const result = await markup($)
    expect(flat(result)).toBe(
      `<!doctype html><html><head><title>Compile</title></head><body><div>function hello() {return 'name';}</div></body></html>`
    )
  })

  it('should compile templates with backtick', async () => {
    req.pathname = '/backtick.html'
    $.app.config = {
      routes: { compile: true }
    }
    const result = await markup($)
    expect(flat(result)).toBe(
      '<!doctype html><html><head><title>Compile Backtick</title></head><body><div>function hello(type) {return `name.${type}`;}</div></body></html>'
    )
  })

  it('should compile with escaped strings', async () => {
    req.pathname = '/compile.html'
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

  // MOVE TO PAGER TEST

  it('should load the home page', async () => {
    const page = await pager('index', $)
    expect(await page($)).toBe(`<div>Home</div>`)
  })

  it('should load the about page', async () => {
    const page = await pager('about', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should not load the about page when path is wrong', async () => {
    const page = await pager('something/about', $)
    expect(page).toBeUndefined()
  })

  it('should load the deep page', async () => {
    const page = await pager('docs/deep', $)
    expect(await page($)).toBe(`<div>Deep</div>`)
  })

  it('should load pages via routemap option as string', async () => {
    $.app.config = {
      routes: {
        routemap: { '/om-oss.html': 'en@about' }
      }
    }
    const page = await pager('om-oss', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should load pages via routemap option as string deeply', async () => {
     $.app.config = {
      routes: {
        routemap: { '/hello/om-oss.html': 'en@about' }
      }
    }
    const page = await pager('hello/om-oss', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should work with dynamic routes', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        _index
      }
    }
    const page = await pager('dynamic', $)
    expect(await page($)).toBe(`<div>HTML</div>`)
  })

  it('should work with nested dynamic index routes', async () => {
    const _index = async function($) {
      return `<div>${$.req.query.index}</div>`
    }
    $.app = {
      pages: {
        doc: {
          _index
        }
      }
    }
    const page = await pager('doc/hello', $)
    expect(await page($)).toBe(`<div>hello</div>`)
  })

  it('should work with nested dynamic non index routes', async () => {
    const _actions = async function($) {
      return `<div>${$.req.query.actions}</div>`
    }
    $.app = {
      pages: {
        doc: {
          _actions
        }
      }
    }
    const page = await pager('doc/hello', $)
    expect(await page($)).toBe(`<div>hello</div>`)
  })

  it('should collect query params from URL', async () => {
    const article = async function($) {
      return `<div>${$.req.query.year}/${$.req.query.month}</div>`
    }
    $.app = {
      pages: {
        _year: {
          _month: {
            article
          }
        }
      }
    }
    const page = await pager('2020/12/article', $)
    expect(await page($)).toBe(`<div>2020/12</div>`)
  })

  it('should avoid dynamic route if template exists', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        about,
        _index
      }
    }
    const page = await pager('about', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should avoid dynamic route if template exists, sorted', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        _index,
        about
      }
    }
    const page = await pager('about', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should work with dynamic route and routemap option', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        about,
        _index
      },
      config: {
        routes: {
          routemap: {
            '/something.html': 'en@something'
          }
        }
      }
    }
    const page = await pager('om-oss', $)
    expect(await page($)).toBe(`<div>HTML</div>`)
  })

  it('should collect query params from URL with routemap option', async () => {
    const article = async function($) {
      return `<div>${$.req.query.year}/${$.req.query.month}</div>`
    }
    $.app = {
      pages: {
        _year: {
          _month: {
            article
          }
        }
      },
      config: {
        routes: {
          routemap: {
            '/_year/_month/artikkel.html': 'en@_year/_month/article'
          }
        }
      }
    }
    const page = await pager('2020/12/artikkel', $)
    expect(await page($)).toBe(`<div>2020/12</div>`)
  })
})
