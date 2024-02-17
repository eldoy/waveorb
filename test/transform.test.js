const { loader, locales } = require('../index.js')

describe('transform', () => {
  it('should transform HTML6', async () => {
    const app = await loader({ path: 'test/apps/app33', locales })
    const $ = { app, params: {} }
    var result = (await app.pages.home($))
      .split('\n')
      .map((x) => x.trim())
      .join('')
    expect(result).toEqual(
      '<h3>Listing products</h3><ul><li>Hoover</li><li>Socks</li><li>Janitor</li></ul>'
    )
  })
})
