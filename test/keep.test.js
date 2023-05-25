const { loader, dispatch, locales } = require('../index.js')

describe('keep', () => {
  it('should keep keys', async () => {
    const app = await loader({ path: 'test/apps/app13', locales })
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
