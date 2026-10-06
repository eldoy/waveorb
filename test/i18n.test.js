const i18n = require('../lib/i18n.js')
const LOCALES = {
  en: {
    validation_failed: 'validation failed',
    required: 'is required',
    eq: 'must be equal to %s'
  }
}

describe('t', () => {
  it('should translate a string', async () => {
    const $t = i18n.t({ lang: 'en', locales: LOCALES })
    const result = $t('validation_failed')
    expect(result).toBe('validation failed')
  })

  it('should support merging of locales', async () => {
    const locales = {
      en: {
        merged: 'merged'
      }
    }
    const $t = i18n.t({ lang: 'en', locales })
    const result = $t('merged')
    expect(result).toBe('merged')
  })

  it('should support interpolation', async () => {
    const locales = {
      en: {
        interpolation: 'interpolation %s %s'
      }
    }
    const $t = i18n.t({ lang: 'en', locales })
    const result = $t('interpolation', 'hello', 5)
    expect(result).toBe('interpolation hello 5')
  })

  it('should not fail and return key if locale missing', async () => {
    const $t = i18n.t()
    const result = $t('non-existant %s', 5)
    expect(result).toBe('non-existant 5')
  })

  it('should not fail and return key if language missing', async () => {
    const $t = i18n.t({ lang: 'no' })
    const result = $t('non-existant')
    expect(result).toBe('non-existant')
  })

  it('should not fail and return correct locale', async () => {
    const locales = {
      en: {
        greeting: 'hello'
      },
      es: {
        greeting: 'hola'
      }
    }
    const $t = i18n.t({ lang: 'es', locales })
    const result = $t('greeting')
    expect(result).toBe('hola')
  })

  it('should format translations', async () => {
    const $t = i18n.t({ locales: LOCALES })
    const result = $t('eq', 'hello')
    expect(result).toBe('must be equal to hello')
  })

  it('should allow nested locales', async () => {
    const $t = i18n.t({
      lang: 'en',
      locales: {
        en: {
          first: {
            second: 'something'
          },
          not_nested: 'something else'
        }
      }
    })

    const result1 = $t('first.second')
    expect(result1).toBe('something')

    const result2 = $t('not_nested')
    expect(result2).toBe('something else')
  })

  it('should translate unrestricted own keys', async () => {
    const entries = {
      Welcome: 'hello',
      'welcome!': 'hello!',
      'blåbær': 'blueberries',
      'invalid/chars': 'slash',
      __whatever: 'explicit',
      '': 'empty'
    }
    const $t = i18n.t({ locales: { en: entries } })
    for (const [key, value] of Object.entries(entries)) {
      expect($t(key)).toBe(value)
    }
  })

  it('should interpolate missing keys with punctuation', async () => {
    const $t = i18n.t({ locales: { en: {} } })
    expect($t('Hello, %s!', 'Ada')).toBe('Hello, Ada!')
  })

  it('should resolve array indices and bracket paths', async () => {
    const $t = i18n.t({
      locales: { en: { items: ['one', 'two'], nested: { 'a.b': 'quoted' } } }
    })
    expect($t('items.0')).toBe('one')
    expect($t('items[1]')).toBe('two')
    expect($t('nested["a.b"]')).toBe('quoted')
  })

  it('should prefer literal dotted keys over nested paths', async () => {
    const $t = i18n.t({
      locales: { en: { 'a.b': 'literal', a: { b: 'nested' } } }
    })
    expect($t('a.b')).toBe('literal')
  })

  it('should format missing paths and falsy translations', async () => {
    const $t = i18n.t({
      locales: { en: { empty: '', zero: 0, disabled: false, nil: null } }
    })
    for (const key of ['empty', 'zero', 'disabled', 'nil']) {
      expect($t(key)).toBe(key)
    }
    expect($t('missing.path %s', 'value')).toBe('missing.path value')
    expect($t('nil.path %s', 'value')).toBe('nil.path value')
  })

  it('should block inherited properties at every path segment', async () => {
    const $t = i18n.t({ locales: { en: { nested: {}, items: [] } } })
    for (const key of [
      '__proto__',
      'constructor',
      'toString',
      'nested.__proto__',
      'nested.constructor',
      'nested.toString',
      'items.map',
      'nested["constructor"]'
    ]) {
      expect($t(key)).toBe(key)
    }
    const missingLanguage = i18n.t({ lang: 'constructor', locales: {} })
    expect(missingLanguage('name')).toBe('name')
  })

  it('should not allow access to arbitrary properties', async () => {
    const $t = i18n.t({ locales: LOCALES })
    const result = $t('__defineGetter__')
    expect(result).toBe('__defineGetter__')
  })
})

describe('link', () => {
  it('should return the correct link for index', async () => {
    const link = i18n.link()
    const result = link('index')
    expect(result).toBe('/')
  })

  it('should return the correct link for page', async () => {
    const link = i18n.link()
    const result = link('about')
    expect(result).toBe('/about')
  })

  it('should return the correct link for deep page', async () => {
    const link = i18n.link()
    const result = link('docs/about')
    expect(result).toBe('/docs/about')
  })

  it('should support url parameters', async () => {
    const link = i18n.link()
    const result = link('about?test=1')
    expect(result).toBe('/about?test=1')
  })

  it('should support hash link', async () => {
    const link = i18n.link()
    const result = link('about#contact')
    expect(result).toBe('/about#contact')
  })

  it('should support url parameters and hash', async () => {
    const link = i18n.link()
    const result = link('about?test=1#hello')
    expect(result).toBe('/about?test=1#hello')
  })

  it('should return the correct link for routes', async () => {
    const routes = {
      'get#/om-oss': 'no@about'
    }
    const link = i18n.link(routes, 'no')
    const result = link('about')
    expect(result).toBe('/om-oss')
  })

  it('should return the correct link for routes config with language', async () => {
    const routes = {
      'get#/about': 'en@about',
      'get#/om-oss': 'no@about'
    }
    const link = i18n.link(routes)
    let result = link('about')
    expect(result).toBe('/about')

    result = link('en@about')
    expect(result).toBe('/about')

    result = link('no@about')
    expect(result).toBe('/om-oss')
  })

  it('should return the correct link for routes config index', async () => {
    const routes = {
      'get#/': 'no@index',
      'get#/en/': 'en@index'
    }
    const link = i18n.link(routes, 'no')
    let result = link('index')
    expect(result).toBe('/')

    result = link('en@index')
    expect(result).toBe('/en/')
  })

  it('should return the correct link with dynamic routes', async () => {
    const link = i18n.link()
    let result = link('about')
    expect(result).toBe('/about')
  })

  it('should return the correct link with dynamic deep routes', async () => {
    const link = i18n.link()
    let result = link('_month/_year/post')
    expect(result).toBe('/_month/_year/post')

    result = link('_month/_year/post', 12, 20)
    expect(result).toBe('/12/20/post')
  })
})
