const { i18n, loader, actions, locales } = require('../index.js')

describe('assets', () => {
  beforeEach(() => {
    delete process.env.WAVEORB_APP
  })

  it('should include favicon in assets', async () => {
    process.env.WAVEORB_APP = 'test/apps/app26'
    const app = await loader()
    expect(app.assets.has('/file.css')).toBe(true)
    expect(app.assets.has('/favicon.ico')).toBe(true)
  })
})