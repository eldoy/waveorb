const _ = require('lodash')
const { locales } = require('d8a')

// Default locale translations
const defaults = _.merge(
  {
    en: {
      validation: {
        error: 'validation error',
        allow: 'field is not allowed',
        deny: 'field is denied',
        unique: 'must be unique'
      }
    }
  },
  locales
)

module.exports = defaults
