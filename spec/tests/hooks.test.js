var got = require('got')
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
  var result = await got(`${base}/hooks/before`, {
    method: 'POST',
    responseType: 'json'
  })
  t.equal(result.body.before, 'before')
  t.equal(result.statusCode, 200)
})

it('should run after hook', async ({ t }) => {
  var result = await got(`${base}/hooks/after`, {
    method: 'POST',
    responseType: 'json'
  })
  t.equal(result.body.hello, 'bye')
  t.equal(result.statusCode, 200)
})

it('should run error hook', async ({ t }) => {
  var result = await got(`${base}/hooks/error`, {
    method: 'POST',
    responseType: 'json'
  })
  t.equal(result.body.error.message, 'bad action')
  t.equal(result.body.something, 'something')
  t.equal(result.statusCode, 200)
})
