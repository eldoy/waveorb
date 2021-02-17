const _ = require('lodash')
const tools = require('extras')
const DEFAULT_LOCALES = require('./locales.js')

const i18n = {}

/** Translation function */
i18n.t = function(options = {}) {
  if (typeof options === 'string') {
    options = { lang: options }
  }
  if (!options.lang) {
    options.lang = 'en'
  }
  if (!options.locales) {
    options.locales = DEFAULT_LOCALES
  }

  const locales = _.merge({}, options.locales)

  return function(path, ...args) {
    try {
      const value = _.get(locales[options.lang], path) || path
      return tools.format(value, ...args)
    } catch (e) {
      return key
    }
  }
}

/** Link function */
i18n.link = function(routes, lang = 'en') {
  return function(link, ...args) {
    if (!link.includes('@')) link = `${lang}@${link}`
    const [_lang, page] = link.split('@')
    const [base, hash] = page.split('#')
    const [name, params] = base.split('?')
    let result = `/${name}.html`
    if (routes && routes.routemap) {
      const entry = Object.entries(routes.routemap).find(([route, map]) => map === link)
      if (entry) result = entry[0]
    }
    // Replace dynamic parts of link
    if (result.includes('/_')) {
      let i = 0
      result = result.split('/').map(key => key[0] === '_' && args[i] ? args[i++] : key).join('/')
    }
    result = result.replace('index.html', '')
    if (params) result += `?${params}`
    if (hash) result += `#${hash}`
    return result
  }
}

/** Get language from path  */
i18n.getLang = function(path, m) {
  if (m = path.match(/^\/([a-z]{2})\//)) return m[1]
}

module.exports = i18n
