const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { loader, dispatch, locales } = require('../index.js')
const remove = require('../lib/remove.js')

describe('remove', () => {
  it('should remove keys', async () => {
    const data = { a: 1, b: 2 }
    const result = await remove({})(data, ['a'])
    assert.deepStrictEqual(result.b, 2)
    assert.strictEqual(result.a, undefined)
  })

  it('should remove keys nested', async () => {
    const data = { a: { b: 2, c: 3 } }
    const result = await remove({})(data, ['a.c'])
    assert.deepStrictEqual(result.a.b, 2)
    assert.strictEqual(result.a.c, undefined)
  })

  it('should remove when data is list', async () => {
    const data = [{ a: { b: 2, c: 3 } }]
    const result = await remove({})(data, ['a.c'])
    assert.deepStrictEqual(result[0].a.b, 2)
    assert.strictEqual(result[0].a.c, undefined)
  })

  it('should remove when data is nested', async () => {
    const data = { status: [{ a: { b: 2, c: { d: 4 } } }] }
    const result = await remove({})(data.status, ['a.c'])
    assert.deepStrictEqual(result[0].a.b, 2)
    assert.strictEqual(result[0].a.c, undefined)
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
    assert.strictEqual(result.evil, undefined)
    assert.strictEqual(result.something.a, undefined)
    assert.deepStrictEqual(result.something.b, 2)
    assert.deepStrictEqual(result.other, 3)
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
    assert.strictEqual(result.evil, undefined)
    assert.deepStrictEqual(result.something, 2)
    assert.deepStrictEqual(result.other, 3)
  })
})
