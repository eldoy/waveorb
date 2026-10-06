const { describe, it, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const { validator, locales } = require('../index.js')

/** Testing validator functions */

describe('validator', () => {
  beforeEach(() => {})

  // Test validator no error
  it('should pass validate if no error', async () => {
    const app = { locales }
    app.validator = validator({ app })

    const validation = {
      values: {
        name: {
          required: true
        }
      }
    }

    const values = {
      name: 'hello'
    }

    const result = await app.validator(validation, { values })

    assert.deepStrictEqual(typeof result, 'object')
    assert.deepStrictEqual(Object.keys(result).length, 0)
  })

  // Test validator error
  it('should validate data on error', async () => {
    const app = { locales }
    app.validator = validator({ app })

    const validation = {
      values: {
        name: {
          required: true
        }
      }
    }

    const values = {}

    const result = await app.validator(validation, { values })

    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.name, ['is required'])
  })
})
