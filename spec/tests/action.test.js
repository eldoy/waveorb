var i18n = require('../../lib/i18n.js')
var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')

it('should match the action function', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app2', locales })
  var $ = {
    app,
    req: { route: 'createProject' },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result.hello, 'bye')
})

it('should match request pathname', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app8', locales })
  var $ = {
    app,
    req: { route: 'createProject' },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result.hello, 'bye')
})

it('should match nested action', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app9', locales })
  var $ = {
    app,
    req: { route: 'project/create' },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result.hello, 'bye')
})

it('should match deeply nested action', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app9', locales })
  var $ = {
    app,
    req: { route: 'deep/user/hello' },
    params: {}
  }
  var result = await dispatch($)
  t.equal(result.hello, 'hello')
})

it('should match action from pathname for index', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app19', locales })
  var $ = {
    app,
    req: {
      route: 'index'
    },
    params: {},
    t: i18n.t({ locales })
  }
  var result = await dispatch($)
  t.equal(result.hello, 'index')
})

it('should match action from pathname for about', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app19', locales })
  var $ = {
    app,
    req: {
      route: 'about'
    },
    params: {},
    t: i18n.t({ locales })
  }
  var result = await dispatch($)
  t.equal(result.hello, 'about')
})

it('should match action from pathname for project/create', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app19', locales })
  var $ = {
    app,
    req: {
      route: 'project/create'
    },
    params: {},
    t: i18n.t({ locales })
  }
  var result = await dispatch($)
  t.equal(result.hello, 'project/create')
})
