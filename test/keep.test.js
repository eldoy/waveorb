const { loader, dispatch, locales } = require('../index.js')
const keep = require('../lib/keep.js')

describe('keep', () => {
  it('should keep keys', async () => {
    const data = { a: 1, b: 2 }
    const result = await keep({})(data, ['a'])
    expect(result.a).toEqual(1)
    expect(result.b).toBeUndefined()
  })

  it('should keep keys nested', async () => {
    const data = { a: { b: 2, c: 3 } }
    const result = await keep({})(data, ['a.c'])
    expect(result.a.c).toEqual(3)
    expect(result.a.b).toBeUndefined()
  })

  it('should keep when data is list', async () => {
    const data = [{ a: { b: 2, c: 3 } }]
    const result = await keep({})(data, ['a.c'])
    expect(result[0].a.c).toEqual(3)
    expect(result[0].a.b).toBeUndefined()
  })

  it('should keep when data is nested', async () => {
    const data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
    const result = await keep({})(data.status, ['a.c'])
    expect(result[0].a.c.d).toEqual(4)
    expect(result[0].a.b).toBeUndefined()
  })

  it('should keep keys', async () => {
    const app = await loader({ path: 'test/apps/app13', locales })
    const $ = {
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
    const result = await dispatch($)
    expect(result.evil).toBeUndefined()
    expect(result.something.a).toEqual(1)
    expect(result.something.b).toBeUndefined()
    expect(result.other).toEqual(3)
  })

  it('should keep keys as function', async () => {
    const app = await loader({ path: 'test/apps/app14', locales })
    const $ = {
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
    const result = await dispatch($)
    expect(result.evil).toBeUndefined()
    expect(result.something).toEqual(2)
    expect(result.other).toEqual(3)
  })
})
