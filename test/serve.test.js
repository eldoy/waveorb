var got = require('got')
var base = `http://localhost:${process.env.WAVEORB_PORT}`

describe('serve', () => {
  beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 500))
  })

  it('should return 404 with post to empty app', async () => {
    var result
    try {
      result = await got(`${base}/project/create`, {
        method: 'POST',
        responseType: 'json'
      })
    } catch (e) {
      result = e.response
    }
    expect(result.body).toEqual({})
    expect(result.statusCode).toBe(404)
  })

  it('should serve plain HTML', async () => {
    var result = await got(`${base}/about.html`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  it('should serve HTML extension', async () => {
    var result = await got(`${base}/contact`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
  })

  it('should serve XML files', async () => {
    var result = await got(`${base}/sitemap.xml`)
    expect(result.body).toContain('xml>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('application/xml')
  })

  it('should serve markdown pages', async () => {
    var result = await got(`${base}/markdown.html`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  it('should serve actions', async () => {
    var result = await got(`${base}/project/find`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'project/find' })
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    )
  })

  it('should return from middleware', async () => {
    var result = await got(`${base}/middleware`, {
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'middle' })
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  it('should return from filter', async () => {
    var result = await got(`${base}/project/get`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'filter' })
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    )
  })

  it('should not have a layout', async () => {
    var result = await got(`${base}/nolayout`)
    expect(result.body).toEqual('<div>NoLayout</div>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })
})
