const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { loader, dispatch, locales } = require('../index.js')
const keep = require('../lib/keep.js')

describe('keep', () => {
  it('should keep keys', async () => {
    const data = { a: 1, b: 2 }
    const result = await keep({})(data, ['a'])
    assert.deepStrictEqual(result.a, 1)
    assert.strictEqual(result.b, undefined)
  })

  it('should keep keys nested', async () => {
    const data = { a: { b: 2, c: 3 } }
    const result = await keep({})(data, ['a.c'])
    assert.deepStrictEqual(result.a.c, 3)
    assert.strictEqual(result.a.b, undefined)
  })

  it('should keep when data is list', async () => {
    const data = [{ a: { b: 2, c: 3 } }]
    const result = await keep({})(data, ['a.c'])
    assert.deepStrictEqual(result[0].a.c, 3)
    assert.strictEqual(result[0].a.b, undefined)
  })

  it('should keep when data is nested', async () => {
    const data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
    const result = await keep({})(data.status, ['a.c'])
    assert.deepStrictEqual(result[0].a.c.d, 4)
    assert.strictEqual(result[0].a.b, undefined)
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
    assert.strictEqual(result.evil, undefined)
    assert.deepStrictEqual(result.something.a, 1)
    assert.strictEqual(result.something.b, undefined)
    assert.deepStrictEqual(result.other, 3)
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
    assert.strictEqual(result.evil, undefined)
    assert.deepStrictEqual(result.something, 2)
    assert.deepStrictEqual(result.other, 3)
  })
})
