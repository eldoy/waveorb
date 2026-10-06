const tools = require('extras')
const DEFAULT_LOCALES = require('./locales.js')

const i18n = {}

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

  const locales = {}
  for (const lang in options.locales) {
    locales[lang] = flattenObjectToMap(options.locales[lang])
  }

  return function (path, ...args) {
    if (!/^[a-z0-9_. %-]+$/.test(path)) return path
    if (path.startsWith('__')) return path

    try {
      const value = locales[options.lang].get(path) || path
      return tools.format(value, ...args)
    } catch (e) {
      return path
    }
  }

  function flattenObjectToMap(obj, prefix = undefined) {
    const map = new Map()
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedMap = flattenObjectToMap(value, fullKey)
        for (const [nestedKey, nestedValue] of nestedMap) {
          map.set(nestedKey, nestedValue)
        }
      } else {
        map.set(fullKey, value)
      }
    }
    return map
  }
}

// Link function
i18n.link = function (routes, lang = 'en') {
  return function (link, ...args) {
    if (!link.includes('@')) link = `${lang}@${link}`
    const [_lang, page] = link.split('@')
    const [base, hash] = page.split('#')
    const [name, params] = base.split('?')
    let result = `/${name}`
    if (routes) {
      const entry = Object.entries(routes).find(([route, map]) => map === link)
      if (entry) result = entry[0]
    }
    // Replace dynamic parts of link
    if (result.includes('/_')) {
      let i = 0
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
