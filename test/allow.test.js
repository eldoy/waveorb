const { i18n, loader, actions, locales } = require('../index.js')

describe('allow', () => {
  it('should allow parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = { app, params: { action: 'createProject', query: { something: 'hello', excess: false } } }
    const result = await actions($)
    expect(result.query.something).toBeDefined()
    expect(result.query.excess).toBeUndefined()
  })

  it('should allow with empty parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = { app, params: { action: 'createProject' } }
    const result = await actions($)
    expect(result.error).toBeUndefined()
    expect(result.query.evil).toBeUndefined()
  })

  it('should allow parameter keys in function', async () => {
    const app = await loader({ path: 'test/apps/app11', locales })
    const $ = { app, params: { action: 'createProject', query: { something: 'hello', excess: false } } }
    const result = await actions($)
    expect(result.query.something).toBeDefined()
    expect(result.query.excess).toBeUndefined()
  })
})