const { loader, dispatch, locales } = require('../index.js')
const remove = require('../lib/remove.js')

describe('remove', () => {
  it('should remove keys', async () => {
    const data = { a: 1, b: 2 }
    const result = await remove({})(data, ['a'])
    expect(result.b).toEqual(2)
    expect(result.a).toBeUndefined()
  })

  it('should remove keys nested', async () => {
    const data = { a: { b: 2, c: 3 } }
    const result = await remove({})(data, ['a.c'])
    expect(result.a.b).toEqual(2)
    expect(result.a.c).toBeUndefined()
  })

  it('should remove when data is list', async () => {
    const data = [{ a: { b: 2, c: 3 } }]
    const result = await remove({})(data, ['a.c'])
    expect(result[0].a.b).toEqual(2)
    expect(result[0].a.c).toBeUndefined()
  })

  it('should remove when data is nested', async () => {
    const data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
    const result = await remove({})(data.status, ['a.c'])
    expect(result[0].a.b).toEqual(2)
    expect(result[0].a.c).toBeUndefined()
  })

  it('should remove result keys', async () => {
    const app = await loader({ path: 'test/apps/app15', locales })
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
    expect(result.something.a).toBeUndefined()
    expect(result.something.b).toEqual(2)
    expect(result.other).toEqual(3)
  })

  it('should remove result keys as function', async () => {
    const app = await loader({ path: 'test/apps/app16', locales })
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
