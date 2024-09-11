var loader = require('../lib/loader.js')
var dispatch = require('../lib/dispatch.js')
var locales = require('../lib/locales.js')
var keep = require('../lib/keep.js')

describe('keep', () => {
  it('should keep keys', async () => {
    var data = { a: 1, b: 2 }
    var result = await keep({})(data, ['a'])
    expect(result.a).toEqual(1)
    expect(result.b).toBeUndefined()
  })

  it('should keep keys nested', async () => {
    var data = { a: { b: 2, c: 3 } }
    var result = await keep({})(data, ['a.c'])
    expect(result.a.c).toEqual(3)
    expect(result.a.b).toBeUndefined()
  })

  it('should keep when data is list', async () => {
    var data = [{ a: { b: 2, c: 3 } }]
    var result = await keep({})(data, ['a.c'])
    expect(result[0].a.c).toEqual(3)
    expect(result[0].a.b).toBeUndefined()
  })

  it('should keep when data is nested', async () => {
    var data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
    var result = await keep({})(data.status, ['a.c'])
    expect(result[0].a.c.d).toEqual(4)
    expect(result[0].a.b).toBeUndefined()
  })

  it('should keep keys', async () => {
    var app = await loader({ path: 'test/apps/app13', locales })
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
    expect(result.something.a).toEqual(1)
    expect(result.something.b).toBeUndefined()
    expect(result.other).toEqual(3)
  })

  it('should keep keys as function', async () => {
    var app = await loader({ path: 'test/apps/app14', locales })
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
