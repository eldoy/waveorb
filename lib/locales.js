const _ = require('lodash')
const { locales } = require('d8a')

// Default locale translations
const defaults = _.merge(
  {
    en: {
      validation: {
        error: 'validation error',
        field: 'field error',
        unique: 'must be unique',
        exist: 'does not exist'
      }
    }
  },
  locales
)

module.exports = defaults
