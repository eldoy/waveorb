const got = require('got')
const { loader, locales, actions } = require('../index.js')
const base = `http://localhost:${process.env.WAVEORB_PORT}`

describe('hooks', () => {

  beforeAll(async () => {
    await new Promise(r => setTimeout(r, 500))
  })

  it('should run init hook', async () => {
    const app = await loader({ path: 'test/apps/app25', locales })
    expect(app.init).toBe(true)
  })

  it('should run dispatch hook', async () => {
    const result = await got(`${base}/hooks/dispatch`, {
      method: 'POST',
      responseType: 'json'
    })
    expect(result.body.dispatch).toBe('dispatch')
    expect(result.statusCode).toBe(200)
  })

  it('should run result hook', async () => {
    const result = await got(`${base}/hooks/result`, {
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

  it('should run asset hook', async () => {
    const result = await got(`${base}/asset.txt`)
    expect(result.body).toBe('hello')
    expect(result.statusCode).toBe(200)
  })

  it('should run the validate hook', async () => {
    const app = await loader({ path: 'test/apps/app33', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('valid')
  })
})
