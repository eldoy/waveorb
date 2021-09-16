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
    const page = await pager('index', $)
    expect(await page($)).toBe(`<div>Home</div>`)
  })

  it('should load the about page', async () => {
    const page = await pager('about', $)
    expect(await page($)).toBe(`<div>About</div>`)
  })

  it('should load 404 when path does not exist', async () => {
    const page = await pager('something/about', $)
    expect(await page($)).toBe('')
    expect($.res.statusCode).toBe(404)
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

  xit('should work with dynamic routes in routemaps', async () => {
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
    const page = await pager('artikkel/om-oss', $)
    expect(await page($)).toBe(`<div>HTML</div>`)
  })

  xit('should work with dynamic routes in routemaps deeply', async () => {
    $.app = {
      pages: {
        article: {
          _article: async function($) {
            return `<div>HTML</div>`
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
    const page = await pager('artikkel/om-oss', $)
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

  it('should issue a default 404 if not found', async () => {
    $.app = {
      pages: {}
    }
    const page = await pager('notfound', $)
    expect(await page($)).toBe('')
    expect($.res.statusCode).toBe(404)
  })

  it('should issue the 404 page if not found', async () => {
    $.app = {
      pages: {
        '404': async function($) {
          return `<div>404</div>`
        }
      }
    }
    const page = await pager('notfound', $)
    expect(await page($)).toBe(`<div>404</div>`)
    expect($.res.statusCode).toBe(404)
  })

  it('should not pick up 404 page for dynamic URL', async () => {
    $.app = {
      pages: {
        '404': async function($) {
          return `<div>404</div>`
        },
        _dynamic: async function($) {
          return `<div>dynamic</div>`
        }
      }
    }
    const page = await pager('match', $)
    expect(await page($)).toBe(`<div>dynamic</div>`)
  })
})
