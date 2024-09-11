var i18n = require('../lib/i18n.js')
var LOCALES = {
  en: {
    validation_failed: 'validation failed',
    required: 'is required',
    eq: 'must be equal to %s'
  }
}

describe('t', () => {
  it('should translate a string', async () => {
    var $t = i18n.t({ lang: 'en', locales: LOCALES })
    var result = $t('validation_failed')
    expect(result).toBe('validation failed')
  })

  it('should support merging of locales', async () => {
    var locales = {
      en: {
        merged: 'merged'
      }
    }
    var $t = i18n.t({ lang: 'en', locales })
    var result = $t('merged')
    expect(result).toBe('merged')
  })

  it('should support interpolation', async () => {
    var locales = {
      en: {
        interpolation: 'interpolation %s %s'
      }
    }
    var $t = i18n.t({ lang: 'en', locales })
    var result = $t('interpolation', 'hello', 5)
    expect(result).toBe('interpolation hello 5')
  })

  it('should not fail and return key if locale missing', async () => {
    var $t = i18n.t()
    var result = $t('non-existant %s', 5)
    expect(result).toBe('non-existant 5')
  })

  it('should not fail and return key if language missing', async () => {
    var $t = i18n.t({ lang: 'no' })
    var result = $t('non-existant')
    expect(result).toBe('non-existant')
  })

  it('should not fail and return correct locale', async () => {
    var locales = {
      en: {
        greeting: 'hello'
      },
      es: {
        greeting: 'hola'
      }
    }
    var $t = i18n.t({ lang: 'es', locales })
    var result = $t('greeting')
    expect(result).toBe('hola')
  })

  it('should format translations', async () => {
    var $t = i18n.t({ locales: LOCALES })
    var result = $t('eq', 'hello')
    expect(result).toBe('must be equal to hello')
  })
})

describe('link', () => {
  it('should return the correct link for index', async () => {
    var link = i18n.link()
    var result = link('index')
    expect(result).toBe('/')
  })

  it('should return the correct link for page', async () => {
    var link = i18n.link()
    var result = link('about')
    expect(result).toBe('/about')
  })

  it('should return the correct link for deep page', async () => {
    var link = i18n.link()
    var result = link('docs/about')
    expect(result).toBe('/docs/about')
  })

  it('should support url parameters', async () => {
    var link = i18n.link()
    var result = link('about?test=1')
    expect(result).toBe('/about?test=1')
  })

  it('should support hash link', async () => {
    var link = i18n.link()
    var result = link('about#contact')
    expect(result).toBe('/about#contact')
  })

  it('should support url parameters and hash', async () => {
    var link = i18n.link()
    var result = link('about?test=1#hello')
    expect(result).toBe('/about?test=1#hello')
  })

  it('should return the correct link for routes', async () => {
    var routes = {
      'get#/om-oss': 'no@about'
    }
    var link = i18n.link(routes, 'no')
    var result = link('about')
    expect(result).toBe('/om-oss')
  })

  it('should return the correct link for routes config with language', async () => {
    var routes = {
      'get#/about': 'en@about',
      'get#/om-oss': 'no@about'
    }
    var link = i18n.link(routes)
    var result = link('about')
    expect(result).toBe('/about')

    result = link('en@about')
    expect(result).toBe('/about')

    result = link('no@about')
    expect(result).toBe('/om-oss')
  })

  it('should return the correct link for routes config index', async () => {
    var routes = {
      'get#/': 'no@index',
      'get#/en/': 'en@index'
    }
    var link = i18n.link(routes, 'no')
    var result = link('index')
    expect(result).toBe('/')

    result = link('en@index')
    expect(result).toBe('/en/')
  })

  it('should return the correct link with dynamic routes', async () => {
    var link = i18n.link()
    var result = link('about')
    expect(result).toBe('/about')
  })

  it('should return the correct link with dynamic deep routes', async () => {
    var link = i18n.link()
    var result = link('_month/_year/post')
    expect(result).toBe('/_month/_year/post')

    result = link('_month/_year/post', 12, 20)
    expect(result).toBe('/12/20/post')
  })
})
