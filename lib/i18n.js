var lodash = require('lodash')
var tools = require('extras')
var DEFAULT_LOCALES = require('./locales.js')

var i18n = {}

// Translation function
i18n.t = function (options = {}) {
  if (typeof options === 'string') {
    options = { lang: options }
  }
  if (!options.lang) {
    options.lang = 'en'
  }
  if (!options.locales) {
    options.locales = DEFAULT_LOCALES
  }

  var locales = lodash.merge({}, options.locales)

  return function (path, ...args) {
    try {
      var value = lodash.get(locales[options.lang], path) || path
      return tools.format(value, ...args)
    } catch (e) {
      return path
    }
  }
}

// Link function
i18n.link = function (routes, lang = 'en') {
  return function (link, ...args) {
    if (!link.includes('@')) link = `${lang}@${link}`
    var [_lang, page] = link.split('@')
    var [base, hash] = page.split('#')
    var [name, params] = base.split('?')
    var result = `/${name}`
    if (routes) {
      var entry = Object.entries(routes).find(([route, map]) => map === link)
      if (entry) result = entry[0]
    }
    // Replace dynamic parts of link
    if (result.includes('/_')) {
      var i = 0
      result = result
        .split('/')
        .map((key) => (key[0] === '_' && args[i] ? args[i++] : key))
        .join('/')
    }
    result = result.replace(/index$/, '')
    result = result.replace(/^get#/, '')
    if (params) result += `?${params}`
    if (hash) result += `#${hash}`
    return result
  }
}

module.exports = i18n
