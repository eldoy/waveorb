var extras = require('extras')
var i18n = require('../../lib/i18n.js')
var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')
var db = require('configdb')

beforeEach(() => {
  db('user').clear()
})

// Test validate data
it('should validate data', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app7', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {
      query: {
        name: 'hey',
        key: 5
      }
    },
    t: i18n.t()
  }

  var result = await dispatch($)
  t.equal(result.error.message, 'validation error')
  t.deepEqual(result.query.name, ['minimum length is 5'])
  t.deepEqual(result.query.key, ['must be one of 7, 8'])

  $.params.query.name = 'hello'
  $.params.query.key = 7

  result = await dispatch($)
  t.equal(result.hello, 'bye')
})

// Test multiple required
it('should work with multiple required fields', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app30', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    db,
    params: {},
    t: i18n.t()
  }

  var result = await dispatch($)
  t.equal(result.error.message, 'validation error')
  t.deepEqual(result.values.name, ['is required'])
  t.deepEqual(result.values.email, ['is required'])
})

// Test custom validations
it('should use custom validations', async ({ t }) => {
  var customLocales = extras.cloneDeep(locales)
  customLocales.en.validation.required = 'custom required'

  var app = await loader({
    path: 'spec/apps/app30',
    locales: customLocales
  })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    db,
    params: {},
    t: i18n.t()
  }

  var result = await dispatch($)
  t.equal(result.error.message, 'validation error')
  t.deepEqual(result.values.name, ['custom required'])
  t.deepEqual(result.values.email, ['custom required'])
})

// Test custom validations, other language
it('should use custom validations', async ({ t }) => {
  var customLocales = Object.assign({}, locales)
  customLocales.no = {
    validation: {
      required: 'er påkrevet'
    }
  }

  var app = await loader({
    path: 'spec/apps/app30',
    locales: customLocales
  })
  var $ = {
    app,
    lang: 'no',
    req: {
      route: 'createProject'
    },
    db,
    params: {},
    t: i18n.t()
  }

  var result = await dispatch($)
  t.equal(result.error.message, 'validation error')
  t.deepEqual(result.values.name, ['er påkrevet'])
  t.deepEqual(result.values.email, ['er påkrevet'])
})
