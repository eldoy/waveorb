const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')
const got = require('got')
const { once } = require('node:events')
const { loader, serve } = require('../index.js')
let server
let base

describe('serve', () => {
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

  it('should return 404 with post to empty app', async () => {
    let result
    try {
      result = await got(`${base}/project/create`, {
        method: 'POST',
        responseType: 'json'
      })
    } catch (e) {
      result = e.response
    }
    assert.deepStrictEqual(result.body, {})
    assert.strictEqual(result.statusCode, 404)
  })

  it('should serve plain HTML', async () => {
    const result = await got(`${base}/about.html`)
    assert.ok(result.body.includes('html>'))
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(
      result.headers['content-type'],
      'text/html; charset=utf-8'
    )
  })

  it('should serve HTML extension', async () => {
    const result = await got(`${base}/contact`)
    assert.ok(result.body.includes('html>'))
    assert.strictEqual(result.statusCode, 200)
  })

  it('should serve XML files', async () => {
    const result = await got(`${base}/sitemap.xml`)
    assert.ok(result.body.includes('xml>'))
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(result.headers['content-type'], 'application/xml')
  })

  it('should serve markdown pages', async () => {
    const result = await got(`${base}/markdown.html`)
    assert.ok(result.body.includes('html>'))
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(
      result.headers['content-type'],
      'text/html; charset=utf-8'
    )
  })

  it('should serve actions', async () => {
    const result = await got(`${base}/project/find`, {
      method: 'POST',
      responseType: 'json'
    })
    assert.deepStrictEqual(result.body, { hello: 'project/find' })
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(
      result.headers['content-type'],
      'application/json; charset=utf-8'
    )
  })

  it('should return from middleware', async () => {
    const result = await got(`${base}/middleware`, {
      responseType: 'json'
    })
    assert.deepStrictEqual(result.body, { hello: 'middle' })
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(
      result.headers['content-type'],
      'text/html; charset=utf-8'
    )
  })

  it('should return from filter', async () => {
    const result = await got(`${base}/project/get`, {
      method: 'POST',
      responseType: 'json'
    })
    assert.deepStrictEqual(result.body, { hello: 'filter' })
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(
      result.headers['content-type'],
      'application/json; charset=utf-8'
    )
  })

  it('should not have a layout', async () => {
    const result = await got(`${base}/nolayout`)
    assert.deepStrictEqual(result.body, '<div>NoLayout</div>')
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(
      result.headers['content-type'],
      'text/html; charset=utf-8'
    )
  })
})
