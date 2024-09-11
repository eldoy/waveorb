var loader = require('../../lib/loader.js')
var dispatch = require('../../lib/dispatch.js')
var locales = require('../../lib/locales.js')

var remove = require('../../lib/remove.js')

it('should remove keys', async ({ t }) => {
  var data = { a: 1, b: 2 }
  var result = await remove({})(data, ['a'])
  t.equal(result.b, 2)
  t.equal(result.a, undefined)
})

it('should remove keys nested', async ({ t }) => {
  var data = { a: { b: 2, c: 3 } }
  var result = await remove({})(data, ['a.c'])
  t.equal(result.a.b, 2)
  t.equal(result.a.c, undefined)
})

it('should remove when data is list', async ({ t }) => {
  var data = [{ a: { b: 2, c: 3 } }]
  var result = await remove({})(data, ['a.c'])
  t.equal(result[0].a.b, 2)
  t.equal(result[0].a.c, undefined)
})

it('should remove when data is nested', async ({ t }) => {
  var data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
  var result = await remove({})(data.status, ['a.c'])
  t.equal(result[0].a.b, 2)
  t.equal(result[0].a.c, undefined)
})

it('should remove result keys', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app15', locales })
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
  t.equal(result.something.a, undefined)
  t.equal(result.something.b, 2)
  t.equal(result.other, 3)
})

it('should remove result keys as function', async ({ t }) => {
  var app = await loader({ path: 'spec/apps/app16', locales })
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
