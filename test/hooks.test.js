const got = require('got')
const { loader, locales, actions } = require('../index.js')
const base = `http://localhost:${process.env.WAVEORB_PORT}`

describe('hooks', () => {
  beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 500))
  })

  it('should run init hook', async () => {
    const app = await loader({ path: 'test/apps/app25', locales })
    expect(app.init).toBe(true)
  })

  it('should run load hook', async () => {
    const app = await loader({ path: 'test/apps/app25', locales })
    expect(app.load).toBe(true)
  })

  it('should run before hook', async () => {
    const result = await got(`${base}/hooks/before`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.before).toBe('before')
    expect(result.statusCode).toBe(200)
  })

  it('should run after hook', async () => {
    const result = await got(`${base}/hooks/after`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.hello).toBe('bye')
    expect(result.statusCode).toBe(200)
  })

  it('should run error hook', async () => {
    const result = await got(`${base}/hooks/error`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.error.message).toBe('bad action')
    expect(result.body.something).toBe('something')
    expect(result.statusCode).toBe(200)
  })
})
