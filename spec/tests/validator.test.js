var validator = require('../../lib/validator.js')
var locales = require('../../lib/locales.js')

// Test validator no error
it('should pass validate if no error', async ({ t }) => {
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

  t.equal(typeof result, 'object')
  t.equal(Object.keys(result).length, 0)
})

// Test validator error
it('should validate data on error', async ({ t }) => {
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

  t.equal(result.error.message, 'validation error')
  t.deepEqual(result.values.name, ['is required'])
})
