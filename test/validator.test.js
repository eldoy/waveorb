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

    expect(typeof result).toEqual('object')
    expect(Object.keys(result).length).toEqual(0)
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

    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['is required'])
  })
})
