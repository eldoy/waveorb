var loader = require('../lib/loader.js')
var orb = require('../lib/orb.js')

describe('plugins', () => {
  it('should load plugins', async () => {
    var app = await loader({ path: 'test/apps/app5' })
    expect(typeof app.plugins).toBe('object')
    expect(typeof app.plugins.db).toBe('object')
    expect(app.hello).toBe('hello')
    expect(typeof app.objects.db).toBe('object')
    expect(app.objects.db.bye).toBe('bye')
  })

  it('should unpack plugin objects into orb', async () => {
    var app = await loader({ path: 'test/apps/app5' })
    var req = {
      cookie: () => {},
      pathname: '/'
    }
    var $ = orb(app, req)
    expect($.db.bye).toBe('bye')
  })
})
