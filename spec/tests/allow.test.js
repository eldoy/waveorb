var i18n = require('../../lib/i18n.js')
var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')

it('should not allow extra parameter keys', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app10', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {
      query: { something: 'hello', excess: false }
    },
    t: i18n.t({ locales })
  }
  try {
    await dispatch($)
  } catch (e) {
    t.equal(e.data.error.message, 'field error')
    t.equal(e.data.query.length, 1)
    t.equal(e.data.query[0], 'excess')
  }
})

it('should allow with empty parameter keys', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app10', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result.error, undefined)
  t.equal(result.query.evil, undefined)
})

it('should allow parameter keys in function', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app11', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {
      query: { something: 'hello', excess: false }
    },
    t: i18n.t({ locales })
  }
  try {
    await dispatch($)
  } catch (e) {
    t.equal(e.data.error.message, 'field error')
    t.equal(e.data.query.length, 1)
    t.equal(e.data.query[0], 'excess')
  }
})
