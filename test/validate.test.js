const { i18n, validate, locales } = require('../index.js')

const $ = { t: i18n.t({ locales }) }

/** Testing validate functions */

describe('validate', () => {

  // Test unique: true
  xit('should validate unique field', async () => {
    let spec = {
      val: {
        required: true
      }
    }
    let data = {}
    let error = await validate(spec, data, $)
    expect(error.val).toEqual(['is required'])

    data = { val: 'hello' }
    error = await validate(spec, data, $)
    expect(error).toBeNull()
  })
})
