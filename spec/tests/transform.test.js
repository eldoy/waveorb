var loader = require('../../lib/loader.js')
var locales = require('../../lib/locales.js')

it('should transform HTML6', async ({ t }) => {
  var app = await loader({
    path: 'spec/apps/app33',
    locales,
    config: {
      transform: true
    }
  })
  var $ = { app, params: {} }
  var result = (await app.pages.home($))
    .split('\n')
    .map((x) => x.trim())
    .join('')
  t.equal(
    result,
    '<h3>Listing products</h3><ul><li>Hoover</li><li>Socks</li><li>Janitor</li></ul>'
  )
})
