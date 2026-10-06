const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { loader, orb } = require('../index.js')

describe('plugins', () => {
  it('should load plugins', async () => {
    const app = await loader({ path: 'test/apps/app5' })
    assert.strictEqual(typeof app.plugins, 'object')
    assert.strictEqual(typeof app.plugins.db, 'object')
    assert.strictEqual(app.hello, 'hello')
    assert.strictEqual(typeof app.objects.db, 'object')
    assert.strictEqual(app.objects.db.bye, 'bye')
  })

  it('should unpack plugin objects into orb', async () => {
    const app = await loader({ path: 'test/apps/app5' })
    const req = {
      cookie: () => {},
      pathname: '/'
    }
    const $ = orb(app, req)
    assert.strictEqual($.db.bye, 'bye')
  })
})
