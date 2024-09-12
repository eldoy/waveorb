var extras = require('extras')
var { locales } = require('d8a')

// Default locale translations
var defaults = extras.merge(
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
