const { i18n, loader, actions, locales } = require('../index.js')

describe('filters', () => {
  it('should run filters', async () => {
    const app = await loader({ path: 'test/apps/app6', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('bye')
  })

  it('should run nested filters', async () => {
    const app = await loader({ path: 'test/apps/app6', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.logger).toBe('log')
  })

  it('should run filters as function', async () => {
    const app = await loader({ path: 'test/apps/app12', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.hello).toBe('bye')
  })
})
