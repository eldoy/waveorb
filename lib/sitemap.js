const { SitemapStream, streamToPromise } = require('sitemap')

module.exports = async function(config) {
  const { hostname } = config
  const sitemap = new SitemapStream({ hostname })
  config.urls.forEach(function(url) {
    sitemap.write(url)
  })
  sitemap.end()

  const result = await streamToPromise(sitemap)
  return result.toString()
}
