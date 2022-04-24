const pages = require('../lib/pages.js')
const loader = require('../lib/loader.js')

const req = { pathname: '/', query: {}, method: 'GET' }
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

describe('pages', () => {
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
    req.route = 'nolayout'
    const result = await pages($)
    expect(flat(result)).toBe('<div>NoLayout</div>')
  })
})
