const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { i18n, loader, dispatch, locales } = require('../index.js')

describe('filters', () => {
  it('should run filters', async () => {
    const app = await loader({ path: 'test/apps/app6', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {}
    }
    const result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')
    assert.strictEqual(result.logger, 'log')
  })
})
