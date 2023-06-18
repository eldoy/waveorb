const lodash = require('lodash')
const { locales } = require('d8a')

// Default locale translations
const defaults = lodash.merge(
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
