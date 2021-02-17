const { i18n, loader, actions, locales } = require('../index.js')

describe('keep', () => {
  it('should keep result keys', async () => {
    const app = await loader({ path: 'test/apps/app13', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })

  it('should keep result keys as function', async () => {
    const app = await loader({ path: 'test/apps/app14', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })
})