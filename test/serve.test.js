const got = require('got')
const base = `http://localhost:${process.env.WAVEORB_PORT}`

describe('serve', () => {
  beforeAll(async () => {
    await new Promise(r => setTimeout(r, 300))
  })

  it('should return success on empty app', async () => {
    const result = await got(`${base}/project/create`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toBe('')
    expect(result.statusCode).toBe(200)
  })

  it('should serve HTML', async () => {
    const result = await got(`${base}/about.html`)
    expect(result.body).toContain('html>')
    expect(result.statusCode).toBe(200)
  })

  it('should serve actions', async () => {
    const result = await got(`${base}/project/find`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body).toEqual({ hello: 'project/find' })
    expect(result.statusCode).toBe(200)
  })
})
