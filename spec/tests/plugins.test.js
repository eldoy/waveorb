var loader = require('../../lib/loader.js')
var orb = require('../../lib/orb.js')

it('should load plugins', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app5' })
  t.equal(typeof app.plugins, 'object')
  t.equal(typeof app.plugins.db, 'object')
  t.equal(app.hello, 'hello')
  t.equal(typeof app.objects.db, 'object')
  t.equal(app.objects.db.bye, 'bye')
})

it('should unpack plugin objects into orb', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app5' })
  var req = {
    cookie: () => {},
    pathname: '/'
  }
  var $ = orb(app, req)
  t.equal($.db.bye, 'bye')
})
