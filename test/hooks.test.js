const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')
const got = require('got')
const { loader, locales } = require('../index.js')
const { once } = require('node:events')
const serve = require('../lib/serve.js')
let server
let base

describe('hooks', () => {
  before(async () => {
    const app = await loader({ path: 'test/apps/app' })
    // Furu defaults numeric 0 to port 9090; a string preserves port 0.
    const result = await serve({ port: '0', dir: 'test/apps/app/assets' }, app)
    server = result.server
    if (!server.listening) await once(server, 'listening')
    base = `http://127.0.0.1:${server.address().port}`
  })

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
      })
    }
  })

  it('should run init hook', async () => {
    const app = await loader({ path: 'test/apps/app25', locales })
    assert.strictEqual(app.init, true)
  })

  it('should run load hook', async () => {
    const app = await loader({ path: 'test/apps/app25', locales })
    assert.strictEqual(app.load, true)
  })

  it('should run file hook', async () => {
    const app = await loader({ path: 'test/apps/app25', locales })
    assert.strictEqual(app.filehook, true)
  })

  it('should run before hook', async () => {
    const result = await got(`${base}/hooks/before`, {
      method: 'POST',
      responseType: 'json'
    })
    assert.strictEqual(result.body.before, 'before')
    assert.strictEqual(result.statusCode, 200)
  })

  it('should run after hook', async () => {
    const result = await got(`${base}/hooks/after`, {
      method: 'POST',
      responseType: 'json'
    })
    assert.strictEqual(result.body.hello, 'bye')
    assert.strictEqual(result.statusCode, 200)
  })

  it('should run error hook', async () => {
    const result = await got(`${base}/hooks/error`, {
      method: 'POST',
      responseType: 'json'
    })
    assert.strictEqual(result.body.error.message, 'bad action')
    assert.strictEqual(result.body.something, 'something')
    assert.strictEqual(result.statusCode, 200)
  })
})
