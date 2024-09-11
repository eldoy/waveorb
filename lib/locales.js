var lodash = require('lodash')
var { locales } = require('d8a')

// Default locale translations
var defaults = lodash.merge(
  {
    en: {
      validation: {
        error: 'validation error',
        field: 'field error',
        unique: 'has been taken',
        exist: 'does not exist'
      }
    }
  },
  locales
)

module.exports = defaults
