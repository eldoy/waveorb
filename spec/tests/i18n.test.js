var i18n = require('../../lib/i18n.js')
var LOCALES = {
  en: {
    validation_failed: 'validation failed',
    required: 'is required',
    eq: 'must be equal to %s'
  }
}

it('should translate a string', async ({ t }) => {
  var $t = i18n.t({ lang: 'en', locales: LOCALES })
  var result = $t('validation_failed')
  t.equal(result, 'validation failed')
})

it('should support merging of locales', async ({ t }) => {
  var locales = {
    en: {
      merged: 'merged'
    }
  }
  var $t = i18n.t({ lang: 'en', locales })
  var result = $t('merged')
  t.equal(result, 'merged')
})

it('should support interpolation', async ({ t }) => {
  var locales = {
    en: {
      interpolation: 'interpolation %s %s'
    }
  }
  var $t = i18n.t({ lang: 'en', locales })
  var result = $t('interpolation', 'hello', 5)
  t.equal(result, 'interpolation hello 5')
})

it('should not fail and return key if locale missing', async ({ t }) => {
  var $t = i18n.t()
  var result = $t('non-existant %s', 5)
  t.equal(result, 'non-existant 5')
})

it('should not fail and return key if language missing', async ({ t }) => {
  var $t = i18n.t({ lang: 'no' })
  var result = $t('non-existant')
  t.equal(result, 'non-existant')
})

it('should not fail and return correct locale', async ({ t }) => {
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
  t.equal(result, 'hola')
})

it('should format translations', async ({ t }) => {
  var $t = i18n.t({ locales: LOCALES })
  var result = $t('eq', 'hello')
  t.equal(result, 'must be equal to hello')
})

it('should return the correct link for index', async ({ t }) => {
  var link = i18n.link()
  var result = link('index')
  t.equal(result, '/')
})

it('should return the correct link for page', async ({ t }) => {
  var link = i18n.link()
  var result = link('about')
  t.equal(result, '/about')
})

it('should return the correct link for deep page', async ({ t }) => {
  var link = i18n.link()
  var result = link('docs/about')
  t.equal(result, '/docs/about')
})

it('should support url parameters', async ({ t }) => {
  var link = i18n.link()
  var result = link('about?test=1')
  t.equal(result, '/about?test=1')
})

it('should support hash link', async ({ t }) => {
  var link = i18n.link()
  var result = link('about#contact')
  t.equal(result, '/about#contact')
})

it('should support url parameters and hash', async ({ t }) => {
  var link = i18n.link()
  var result = link('about?test=1#hello')
  t.equal(result, '/about?test=1#hello')
})

it('should return the correct link for routes', async ({ t }) => {
  var routes = {
    'get#/om-oss': 'no@about'
  }
  var link = i18n.link(routes, 'no')
  var result = link('about')
  t.equal(result, '/om-oss')
})

it('should return the correct link for routes config with language', async ({
  t
}) => {
  var routes = {
    'get#/about': 'en@about',
    'get#/om-oss': 'no@about'
  }
  var link = i18n.link(routes)
  var result = link('about')
  t.equal(result, '/about')

  result = link('en@about')
  t.equal(result, '/about')

  result = link('no@about')
  t.equal(result, '/om-oss')
})

it('should return the correct link for routes config index', async ({ t }) => {
  var routes = {
    'get#/': 'no@index',
    'get#/en/': 'en@index'
  }
  var link = i18n.link(routes, 'no')
  var result = link('index')
  t.equal(result, '/')

  result = link('en@index')
  t.equal(result, '/en/')
})

it('should return the correct link with dynamic routes', async ({ t }) => {
  var link = i18n.link()
  var result = link('about')
  t.equal(result, '/about')
})

it('should return the correct link with dynamic deep routes', async ({ t }) => {
  var link = i18n.link()
  var result = link('_month/_year/post')
  t.equal(result, '/_month/_year/post')

  result = link('_month/_year/post', 12, 20)
  t.equal(result, '/12/20/post')
})
