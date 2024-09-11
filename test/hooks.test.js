var got = require('got')
var loader = require('../lib/loader.js')
var locales = require('../lib/locales.js')
var base = `http://localhost:${process.env.WAVEORB_PORT}`

describe('hooks', () => {
  beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 500))
  })

  it('should run init hook', async () => {
    var app = await loader({ path: 'test/apps/app25', locales })
    expect(app.init).toBe(true)
  })

  it('should run load hook', async () => {
    var app = await loader({ path: 'test/apps/app25', locales })
    expect(app.load).toBe(true)
  })

  it('should run file hook', async () => {
    var app = await loader({ path: 'test/apps/app25', locales })
    expect(app.filehook).toBe(true)
  })

  it('should run before hook', async () => {
    var result = await got(`${base}/hooks/before`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.before).toBe('before')
    expect(result.statusCode).toBe(200)
  })

  it('should run after hook', async () => {
    var result = await got(`${base}/hooks/after`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.hello).toBe('bye')
    expect(result.statusCode).toBe(200)
  })

  it('should run error hook', async () => {
    var result = await got(`${base}/hooks/error`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.error.message).toBe('bad action')
    expect(result.body.something).toBe('something')
    expect(result.statusCode).toBe(200)
  })
})
