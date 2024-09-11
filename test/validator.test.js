var { validator, locales } = require('../index.js')

/** Testing validator functions */

describe('validator', () => {
  beforeEach(() => {})

  // Test validator no error
  it('should pass validate if no error', async () => {
    var app = { locales }
    app.validator = validator({ app })

    var validation = {
      values: {
        name: {
          required: true
        }
      }
    }

    var values = {
      name: 'hello'
    }

    var result = await app.validator(validation, { values })

    expect(typeof result).toEqual('object')
    expect(Object.keys(result).length).toEqual(0)
  })

  // Test validator error
  it('should validate data on error', async () => {
    var app = { locales }
    app.validator = validator({ app })

    var validation = {
      values: {
        name: {
          required: true
        }
      }
    }

    var values = {}

    var result = await app.validator(validation, { values })

    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['is required'])
  })
})
