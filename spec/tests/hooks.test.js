var loader = require('../../lib/loader.js')
var locales = require('../../lib/locales.js')
var base = `http://localhost:${process.env.WAVEORB_PORT}`

it('should run init hook', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app25', locales })
  t.equal(app.init, true)
})

it('should run load hook', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app25', locales })
  t.equal(app.load, true)
})

it('should run file hook', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app25', locales })
  t.equal(app.filehook, true)
})

it('should run before hook', async ({ t }) => {
  var response = await fetch(`${base}/hooks/before`, {
    method: 'POST'
  })
  var result = await response.json()
  t.equal(result.before, 'before')
  t.equal(response.status, 200)
})

it('should run after hook', async ({ t }) => {
  var response = await fetch(`${base}/hooks/after`, {
    method: 'POST'
  })
  var result = await response.json()
  t.equal(result.hello, 'bye')
  t.equal(response.status, 200)
})

it('should run error hook', async ({ t }) => {
  var response = await fetch(`${base}/hooks/error`, {
    method: 'POST'
  })
  var result = await response.json()
  t.equal(result.error.message, 'bad action')
  t.equal(result.something, 'something')
  t.equal(response.status, 200)
})
