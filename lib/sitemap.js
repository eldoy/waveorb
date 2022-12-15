const path = require('path')
const { write } = require('extras')
const { SitemapStream, streamToPromise } = require('sitemap')

function outPath() {
  return process.env.NODE_ENV == 'production'
    ? path.join(process.cwd(), 'dist', 'sitemap.xml')
    : path.join(process.cwd(), 'app', 'assets', 'sitemap.xml')
}

async function createSimpleSitemap(hostname, urls, outpath) {
  const sitemap = new SitemapStream({ hostname })
  urls.forEach(function (url) {
    sitemap.write(url)
  })
  sitemap.end()

  const result = await streamToPromise(sitemap)
  write(outpath, result.toString())
}

module.exports = async function (config) {
  const { hostname, urls = [], outpath = outPath() } = config
  await createSimpleSitemap(hostname, urls, outpath)
}
