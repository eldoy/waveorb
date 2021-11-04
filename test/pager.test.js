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

describe('pager', () => {
  beforeAll(async () => {
    process.env.WAVEORB_APP = 'test/apps/app22'
    app = await loader()
  })

  beforeEach(() => {
    $ = { app, req, res, t, page: {} }
    req.pathname = '/'
  })

  it('should load the home page', async () => {
    const page = pager('/', $)
    expect(await page($)).toBe(`<div>Home</div>`)
  })

  it('should load the about page', async () => {
    const page = pager('/about', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should load the deep page', async () => {
    const page = pager('/docs/deep', $)
    expect(await page($)).toBe(`<div>Deep</div>`)
  })

  it('should load pages via routemap option as string', async () => {
    $.app.config = {
      routes: {
        routemap: { '/om-oss.html': 'en@about' }
      }
    }
    $.app.routes['/om-oss'] = 'about'
    const page = pager('/om-oss', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should load pages via routemap option as string deeply', async () => {
     $.app.config = {
      routes: {
        routemap: { '/hello/om-oss.html': 'en@about' }
      }
    }
    $.app.routes['/hello/om-oss'] = 'about'
    const page = pager('/hello/om-oss', $)
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
    $.app.routes = { _index: '_index' }
    const page = pager('/dynamic', $)
    expect(await page($)).toBe(`<div>HTML</div>`)
  })

  it('should work with dynamic deep non index routes', async () => {
    const _cat = async function($) {
      return `<div>Cat</div>`
    }
    const _show = async function($) {
      return `<div>Show</div>`
    }
    $.app = {
      pages: {
        _hello: {
          _cat
        },
        _show
      }
    }
    $.app.routes = { '/_hello/_cat': '_hello._cat', '/_show': '_show' }
    const page = pager('/dynamic', $)
    expect(await page($)).toBe(`<div>Show</div>`)
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
    $.app.routes = { '/doc/_index': 'doc/_index'}
    const page = pager('/doc/hello', $)
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
    $.app.routes = { '/doc/_actions': 'doc/_actions'}
    const page = pager('/doc/hello', $)
    expect(await page($)).toBe(`<div>hello</div>`)
  })

  it('should match dynamic routes non greedy', async () => {
    const page = pager('/site/hello/form/new', $)
    expect(flat(await page($))).toBe(`<div>New form</div>`)
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
    $.app.routes = { '/_year/_month/article': '_year/_month/article' }
    const page = pager('/2020/12/article', $)
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
    $.app.routes = { '/about': 'about', '/_index': '_index' }
    const page = pager('/about', $)
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
    $.app.routes = { '/about': 'about', '/_index': '_index' }
    const page = pager('/about', $)
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
    $.app.routes = { '/about': 'about', '/_index': '_index', '/something': 'something' }
    const page = pager('/om-oss', $)
    expect(await page($)).toBe(`<div>HTML</div>`)
  })

  it('should work with dynamic routes in routemaps', async () => {
    const _index = async function($) {
      return `<div>HTML</div>`
    }
    $.app = {
      pages: {
        _index
      },
      config: {
        routes: {
          routemap: {
            '/artikkel/_article.html': 'no@_index'
          }
        }
      }
    }
    $.app.routes = { '/_index': '_index', '/artikkel/_article': '_index' }
    const page = pager('/artikkel/om-oss', $)
    expect(await page($)).toBe(`<div>HTML</div>`)
  })

  it('should work with dynamic routes in routemaps deeply', async () => {
    $.app = {
      pages: {
        article: {
          _article: async function($) {
            return `<div>${req.query.article}</div>`
          }
        }
      },
      config: {
        routes: {
          routemap: {
            '/artikkel/_article.html': 'no@article/_article'
          }
        }
      }
    }
    $.app.routes = {
      '/article/_article': 'article/_article',
      '/artikkel/_article': 'article/_article'
    }
    const page = pager('/artikkel/om-oss', $)
    expect(await page($)).toBe(`<div>om-oss</div>`)
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
    $.app.routes = {
      '/_year/_month/artikkel': '_year/_month/article'
    }
    const page = pager('/2020/12/artikkel', $)
    expect(await page($)).toBe(`<div>2020/12</div>`)
  })

  it('should show root markdown', async () => {
    const page = pager('/root', $)
    expect(flat(await page($))).toBe(`<p>root</p>`)
  })

  it('should show deep markdown', async () => {
    const page = pager('/docs/hello', $)
    expect(flat(await page($))).toBe(`<p>hello</p>`)
  })

  it('should show root markdown html', async () => {
    const page = pager('/down.html', $)
    expect(flat(await page($))).toBe(`<p>down</p>`)
  })

  it('should show deep markdown html', async () => {
    const page = pager('/docs/inner.html', $)
    expect(flat(await page($))).toBe(`<p>inner</p>`)
  })
})