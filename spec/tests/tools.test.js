var tools = require('../../lib/tools.js')

// Test validator no error
it('should pass validate if no error', async ({ t }) => {
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

  var result = await tools.validate(validation, { values })

  t.equal(typeof result, 'object')
  t.equal(Object.keys(result).length, 0)
})

// Test validator error
it('should validate data on error', async ({ t }) => {
  var validation = {
    values: {
      name: {
        required: true
      }
    }
  }

  var values = {}
  var result = await tools.validate(validation, { values })

  t.equal(result.error.message, 'validation error')
  t.deepEqual(result.values.name, ['is required'])
})
