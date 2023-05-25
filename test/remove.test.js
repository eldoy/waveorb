const { loader, dispatch, locales } = require('../index.js')

describe('remove', () => {
  it('should remove result keys', async () => {
    const app = await loader({ path: 'test/apps/app15', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {
        query: {
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
