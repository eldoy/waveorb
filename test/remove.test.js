var loader = require('../lib/loader.js')
var dispatch = require('../lib/dispatch.js')
var locales = require('../lib/locales.js')

var remove = require('../lib/remove.js')

describe('remove', () => {
  it('should remove keys', async () => {
    var data = { a: 1, b: 2 }
    var result = await remove({})(data, ['a'])
    expect(result.b).toEqual(2)
    expect(result.a).toBeUndefined()
  })

  it('should remove keys nested', async () => {
    var data = { a: { b: 2, c: 3 } }
    var result = await remove({})(data, ['a.c'])
    expect(result.a.b).toEqual(2)
    expect(result.a.c).toBeUndefined()
  })

  it('should remove when data is list', async () => {
    var data = [{ a: { b: 2, c: 3 } }]
    var result = await remove({})(data, ['a.c'])
    expect(result[0].a.b).toEqual(2)
    expect(result[0].a.c).toBeUndefined()
  })

  it('should remove when data is nested', async () => {
    var data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
    var result = await remove({})(data.status, ['a.c'])
    expect(result[0].a.b).toEqual(2)
    expect(result[0].a.c).toBeUndefined()
  })

  it('should remove result keys', async () => {
    var app = await loader({ path: 'test/apps/app15', locales })
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
    expect(result.evil).toBeUndefined()
    expect(result.something.a).toBeUndefined()
    expect(result.something.b).toEqual(2)
    expect(result.other).toEqual(3)
  })

  it('should remove result keys as function', async () => {
    var app = await loader({ path: 'test/apps/app16', locales })
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
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })
})
