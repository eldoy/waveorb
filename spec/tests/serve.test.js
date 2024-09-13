var base = `http://localhost:${process.env.WAVEORB_PORT}`

it('should return 404 with post to empty app', async ({ t }) => {
  var response = await fetch(`${base}/project/create`, {
    method: 'POST'
  })
  var result = await response.json()
  t.deepEqual(result, {})
  t.equal(response.status, 404)
})

it('should serve plain HTML', async ({ t }) => {
  var response = await fetch(`${base}/about.html`)
  var result = await response.text()
  t.ok(result.includes('html>'))
  t.equal(response.status, 200)
  t.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
})

it('should serve HTML extension', async ({ t }) => {
  var response = await fetch(`${base}/contact`)
  var result = await response.text()
  t.ok(result.includes('html>'))
  t.equal(response.status, 200)
})

it('should serve XML files', async ({ t }) => {
  var response = await fetch(`${base}/sitemap.xml`)
  var result = await response.text()
  t.ok(result.includes('xml>'))
  t.equal(response.status, 200)
  t.equal(response.headers.get('content-type'), 'application/xml')
})

it('should serve markdown pages', async ({ t }) => {
  var response = await fetch(`${base}/markdown.html`)
  var result = await response.text()
  t.ok(result.includes('html>'))
  t.equal(response.status, 200)
  t.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
})

it('should serve actions', async ({ t }) => {
  var response = await fetch(`${base}/project/find`, {
    method: 'POST'
  })
  var result = await response.json()
  t.deepEqual(result, { hello: 'project/find' })
  t.equal(response.status, 200)
  t.equal(
    response.headers.get('content-type'),
    'application/json; charset=utf-8'
  )
})

it('should return from middleware', async ({ t }) => {
  var response = await fetch(`${base}/middleware`)
  var result = await response.json()
  t.deepEqual(result, { hello: 'middle' })
  t.equal(response.status, 200)
  t.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
})

it('should return from filter', async ({ t }) => {
  var response = await fetch(`${base}/project/get`, {
    method: 'POST'
  })
  var result = await response.json()
  t.deepEqual(result, { hello: 'filter' })
  t.equal(response.status, 200)
  t.equal(
    response.headers.get('content-type'),
    'application/json; charset=utf-8'
  )
})

it('should not have a layout', async ({ t }) => {
  var response = await fetch(`${base}/nolayout`)
  var result = await response.text()
  t.equal(result, '<div>NoLayout</div>')
  t.equal(response.status, 200)
  t.equal(response.headers.get('content-type'), 'text/html; charset=utf-8')
})
