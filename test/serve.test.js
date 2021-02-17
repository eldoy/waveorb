const axios = require('axios')
const base = `http://localhost:${process.env.WAVEORB_PORT}`

function api(path, data = {}, method = 'post') {
  try {
    return axios({ method, url: base + path, data })
  } catch (e) {
    return e.response
  }
}

describe('serve', () => {
  beforeAll(async () => {
    await new Promise(r => setTimeout(r, 300))
  })

  it('should return success on empty app', async () => {
    const result = await api('/project/create')
    expect(result.data).toBe('')
    expect(result.status).toBe(200)
  })

  it('should serve HTML', async () => {
    const result = await api('/about.html', {}, 'get')
    expect(result.data).toContain('html>')
    expect(result.status).toBe(200)
  })

  it('should serve actions', async () => {
    const result = await api('/project/find')
    expect(result.data).toEqual({ hello: 'project/find' })
    expect(result.status).toBe(200)
  })
})
