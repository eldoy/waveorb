const { loader, orb } = require('../index.js')

describe('plugins', () => {
  it('should load plugins', async () => {
    const app = await loader({ path: 'test/apps/app5' })
    expect(typeof app.plugins).toBe('object')
    expect(typeof app.plugins.db).toBe('object')
    expect(app.hello).toBe('hello')
    // DEPRECATED, remove when app.objects is removed from loader
    expect(app.objects.db.bye).toBe('bye')
  })

  it('should unpack plugin objects into orb', async () => {
    const app = await loader({ path: 'test/apps/app5' })
    const req = {
      cookie: () => {},
      pathname: '/'
    }
    const $ = orb(app, req)
    expect($.db.bye).toBe('bye')
  })
})
