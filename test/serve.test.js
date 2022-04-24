const got = require('got')
const base = `http://localhost:${process.env.WAVEORB_PORT}`

describe('serve', () => {
  beforeAll(async () => {
    await new Promise(r => setTimeout(r, 500))
  })

  it('should return success on empty app', async () => {
    const result = await got(`${base}/project/create`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toBe('')
    expect(result.statusCode).toBe(200)
  })

  it('should serve plain HTML', async () => {
    const result = await got(`${base}/about.html`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  it('should serve HTML extension', async () => {
    const result = await got(`${base}/contact`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
  })

  it('should serve XML files', async () => {
    const result = await got(`${base}/sitemap.xml`)
    expect(result.body).toContain('xml>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('application/xml')
  })

  it('should serve markdown pages', async () => {
    const result = await got(`${base}/markdown.html`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  it('should serve actions', async () => {
    const result = await got(`${base}/project/find`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'project/find' })
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should return from middleware', async () => {
    const result = await got(`${base}/middleware`, {
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'middle' })
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('text/html; charset=utf-8')
  })

  it('should return from filter', async () => {
    const result = await got(`${base}/project/get`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'filter' })
    expect(result.statusCode).toBe(200)
    expect(result.headers['content-type']).toBe('application/json; charset=utf-8')
  })
})
