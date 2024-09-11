var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')
var keep = require('../../lib/keep.js')

it('should keep keys', async ({ t }) => {
  var data = { a: 1, b: 2 }
  var result = await keep({})(data, ['a'])
  t.equal(result.a, 1)
  t.equal(result.b, undefined)
})

it('should keep keys nested', async ({ t }) => {
  var data = { a: { b: 2, c: 3 } }
  var result = await keep({})(data, ['a.c'])
  t.equal(result.a.c, 3)
  t.equal(result.a.b, undefined)
})

it('should keep when data is list', async ({ t }) => {
  var data = [{ a: { b: 2, c: 3 } }]
  var result = await keep({})(data, ['a.c'])
  t.equal(result[0].a.c, 3)
  t.equal(result[0].a.b, undefined)
})

it('should keep when data is nested', async ({ t }) => {
  var data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
  var result = await keep({})(data.status, ['a.c'])
  t.equal(result[0].a.c.d, 4)
  t.equal(result[0].a.b, undefined)
})

it('should keep keys', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app13', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {
      query: {
        evil: 1,
        something: {
          a: 1,
          b: 2
        },
        other: 3
      }
    }
  }
  var result = await dispatch($)
  t.equal(result.evil, undefined)
  t.equal(result.something.a, 1)
  t.equal(result.something.b, undefined)
  t.equal(result.other, 3)
})

it('should keep keys as function', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app14', locales })
  var $ = {
    app,
    req: {
      route: 'createProject'
    },
    params: {
      query: {
        evil: 1,
        something: 2,
        other: 3
      }
    }
  }
  var result = await dispatch($)
  t.equal(result.evil, undefined)
  t.equal(result.something, 2)
  t.equal(result.other, 3)
})
