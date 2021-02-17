const { i18n, loader, actions, locales } = require('../index.js')

describe('deny', () => {
  it('should deny parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = { app, params: { action: 'createProject', query: { evil: true } } }
    const result = await actions($)
    expect(result.query.evil).toBeUndefined()
  })

  it('should deny with empty parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.error).toBeUndefined()
    expect(result.query.evil).toBeUndefined()
  })

  it('should deny parameter keys in function', async () => {
    const app = await loader({ path: 'test/apps/app11', locales })
    const $ = { app, params: { action: 'createProject', query: { evil: true } } }
    const result = await actions($)
    expect(result.query.evil).toBeUndefined()
  })
})