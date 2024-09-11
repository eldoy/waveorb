var got = require('got')
var base = `http://localhost:${process.env.WAVEORB_PORT}`

it('should return 404 with post to empty app', async ({ t }) => {
  var result
  try {
    result = await got(`${base}/project/create`, {
      method: 'POST',
      responseType: 'json'
    })
  } catch (e) {
    result = e.response
  }
  t.deepEqual(result.body, {})
  t.equal(result.statusCode, 404)
})

it('should serve plain HTML', async ({ t }) => {
  var result = await got(`${base}/about.html`)
  t.ok(result.body.includes('html>'))
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'text/html; charset=utf-8')
})

it('should serve HTML extension', async ({ t }) => {
  var result = await got(`${base}/contact`)
  t.ok(result.body.includes('html>'))
  t.equal(result.statusCode, 200)
})

it('should serve XML files', async ({ t }) => {
  var result = await got(`${base}/sitemap.xml`)
  t.ok(result.body.includes('xml>'))
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'application/xml')
})

it('should serve markdown pages', async ({ t }) => {
  var result = await got(`${base}/markdown.html`)
  t.ok(result.body.includes('html>'))
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'text/html; charset=utf-8')
})

it('should serve actions', async ({ t }) => {
  var result = await got(`${base}/project/find`, {
    method: 'POST',
    responseType: 'json'
  })
  t.deepEqual(result.body, { hello: 'project/find' })
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'application/json; charset=utf-8')
})

it('should return from middleware', async ({ t }) => {
  var result = await got(`${base}/middleware`, {
    responseType: 'json'
  })
  t.deepEqual(result.body, { hello: 'middle' })
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'text/html; charset=utf-8')
})

it('should return from filter', async ({ t }) => {
  var result = await got(`${base}/project/get`, {
    method: 'POST',
    responseType: 'json'
  })
  t.deepEqual(result.body, { hello: 'filter' })
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'application/json; charset=utf-8')
})

it('should not have a layout', async ({ t }) => {
  var result = await got(`${base}/nolayout`)
  t.equal(result.body, '<div>NoLayout</div>')
  t.equal(result.statusCode, 200)
  t.equal(result.headers['content-type'], 'text/html; charset=utf-8')
})
