const env = require('../lib/env.js')

describe('t', () => {
  it('should lookup a variable', async () => {
    const $ = { app: { config: { routes: { lang: 'en' } } } }
    const result = env($)('app.config.routes.lang')
    expect(result).toBe('en')
  })
})
