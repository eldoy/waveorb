const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
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
    assert.strictEqual(result, 'validation failed')
  })

  it('should support merging of locales', async () => {
    const locales = {
      en: {
        merged: 'merged'
      }
    }
    const $t = i18n.t({ lang: 'en', locales })
    const result = $t('merged')
    assert.strictEqual(result, 'merged')
  })

  it('should support interpolation', async () => {
    const locales = {
      en: {
        interpolation: 'interpolation %s %s'
      }
    }
    const $t = i18n.t({ lang: 'en', locales })
    const result = $t('interpolation', 'hello', 5)
    assert.strictEqual(result, 'interpolation hello 5')
  })

  it('should not fail and return key if locale missing', async () => {
    const $t = i18n.t()
    const result = $t('non-existant %s', 5)
    assert.strictEqual(result, 'non-existant 5')
  })

  it('should not fail and return key if language missing', async () => {
    const $t = i18n.t({ lang: 'no' })
    const result = $t('non-existant')
    assert.strictEqual(result, 'non-existant')
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
    assert.strictEqual(result, 'hola')
  })

  it('should format translations', async () => {
    const $t = i18n.t({ locales: LOCALES })
    const result = $t('eq', 'hello')
    assert.strictEqual(result, 'must be equal to hello')
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
    assert.strictEqual(result1, 'something')

    const result2 = $t('not_nested')
    assert.strictEqual(result2, 'something else')
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
      assert.strictEqual($t(key), value)
    }
  })

  it('should interpolate missing keys with punctuation', async () => {
    const $t = i18n.t({ locales: { en: {} } })
    assert.strictEqual($t('Hello, %s!', 'Ada'), 'Hello, Ada!')
  })

  it('should resolve array indices and bracket paths', async () => {
    const $t = i18n.t({
      locales: { en: { items: ['one', 'two'], nested: { 'a.b': 'quoted' } } }
    })
    assert.strictEqual($t('items.0'), 'one')
    assert.strictEqual($t('items[1]'), 'two')
    assert.strictEqual($t('nested["a.b"]'), 'quoted')
  })

  it('should prefer literal dotted keys over nested paths', async () => {
    const $t = i18n.t({
      locales: { en: { 'a.b': 'literal', a: { b: 'nested' } } }
    })
    assert.strictEqual($t('a.b'), 'literal')
  })

  it('should format missing paths and falsy translations', async () => {
    const $t = i18n.t({
      locales: { en: { empty: '', zero: 0, disabled: false, nil: null } }
    })
    for (const key of ['empty', 'zero', 'disabled', 'nil']) {
      assert.strictEqual($t(key), key)
    }
    assert.strictEqual($t('missing.path %s', 'value'), 'missing.path value')
    assert.strictEqual($t('nil.path %s', 'value'), 'nil.path value')
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
      assert.strictEqual($t(key), key)
    }
    const missingLanguage = i18n.t({ lang: 'constructor', locales: {} })
    assert.strictEqual(missingLanguage('name'), 'name')
  })

  it('should not allow access to arbitrary properties', async () => {
    const $t = i18n.t({ locales: LOCALES })
    const result = $t('__defineGetter__')
    assert.strictEqual(result, '__defineGetter__')
  })
})

describe('link', () => {
  it('should return the correct link for index', async () => {
    const link = i18n.link()
    const result = link('index')
    assert.strictEqual(result, '/')
  })

  it('should return the correct link for page', async () => {
    const link = i18n.link()
    const result = link('about')
    assert.strictEqual(result, '/about')
  })

  it('should return the correct link for deep page', async () => {
    const link = i18n.link()
    const result = link('docs/about')
    assert.strictEqual(result, '/docs/about')
  })

  it('should support url parameters', async () => {
    const link = i18n.link()
    const result = link('about?test=1')
    assert.strictEqual(result, '/about?test=1')
  })

  it('should support hash link', async () => {
    const link = i18n.link()
    const result = link('about#contact')
    assert.strictEqual(result, '/about#contact')
  })

  it('should support url parameters and hash', async () => {
    const link = i18n.link()
    const result = link('about?test=1#hello')
    assert.strictEqual(result, '/about?test=1#hello')
  })

  it('should return the correct link for routes', async () => {
    const routes = {
      'get#/om-oss': 'no@about'
    }
    const link = i18n.link(routes, 'no')
    const result = link('about')
    assert.strictEqual(result, '/om-oss')
  })

  it('should return the correct link for routes config with language', async () => {
    const routes = {
      'get#/about': 'en@about',
      'get#/om-oss': 'no@about'
    }
    const link = i18n.link(routes)
    let result = link('about')
    assert.strictEqual(result, '/about')

    result = link('en@about')
    assert.strictEqual(result, '/about')

    result = link('no@about')
    assert.strictEqual(result, '/om-oss')
  })

  it('should return the correct link for routes config index', async () => {
    const routes = {
      'get#/': 'no@index',
      'get#/en/': 'en@index'
    }
    const link = i18n.link(routes, 'no')
    let result = link('index')
    assert.strictEqual(result, '/')

    result = link('en@index')
    assert.strictEqual(result, '/en/')
  })

  it('should return the correct link with dynamic routes', async () => {
    const link = i18n.link()
    let result = link('about')
    assert.strictEqual(result, '/about')
  })

  it('should return the correct link with dynamic deep routes', async () => {
    const link = i18n.link()
    let result = link('_month/_year/post')
    assert.strictEqual(result, '/_month/_year/post')

    result = link('_month/_year/post', 12, 20)
    assert.strictEqual(result, '/12/20/post')
  })
})
