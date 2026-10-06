const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { loader, dispatch, locales } = require('../index.js')

describe('setups', () => {
  it('should run setups', async () => {
    const app = await loader({ path: 'test/apps/app12', locales })
    const $ = {
      app,
      req: {
        method: 'GET',
        route: 'hello'
      },
      params: {}
    }
    const result = await dispatch($)
    assert.strictEqual(result, 'bye#log')
  })
})
