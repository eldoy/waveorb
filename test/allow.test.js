const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { i18n, loader, dispatch, locales } = require('../index.js')

describe('allow', () => {
  it('should not allow extra parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {
        query: { something: 'hello', excess: false }
      },
      t: i18n.t({ locales })
    }
    try {
      await dispatch($)
    } catch (e) {
      assert.strictEqual(e.data.error.message, 'field error')
      assert.strictEqual(e.data.query.length, 1)
      assert.strictEqual(e.data.query[0], 'excess')
    }
  })

  it('should allow with empty parameter keys', async () => {
    const app = await loader({ path: 'test/apps/app10', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {}
    }
    const result = await dispatch($)
    assert.strictEqual(result.error, undefined)
    assert.strictEqual(result.query.evil, undefined)
  })

  it('should allow parameter keys in function', async () => {
    const app = await loader({ path: 'test/apps/app11', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {
        query: { something: 'hello', excess: false }
      },
      t: i18n.t({ locales })
    }
    try {
      await dispatch($)
    } catch (e) {
      assert.strictEqual(e.data.error.message, 'field error')
      assert.strictEqual(e.data.query.length, 1)
      assert.strictEqual(e.data.query[0], 'excess')
    }
  })
})
