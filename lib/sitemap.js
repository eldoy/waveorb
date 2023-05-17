const { exist, mkdir } = require('extras')
const path = require('path')
const { createWriteStream } = require('fs')
const { write } = require('extras')
const {
  SitemapStream,
  SitemapAndIndexStream,
  streamToPromise
} = require('sitemap')

const LIMIT = 45_000

function outPath() {
  return process.env.NODE_ENV != 'development'
    ? path.join(process.cwd(), 'dist')
    : path.join(process.cwd(), 'app', 'assets')
}

// Create simple sitemap and write it to the assets dir
async function createSimpleSitemap({ hostname, urls, outpath }) {
  const sitemap = new SitemapStream({ hostname })
  urls.forEach(function (url) {
    sitemap.write(url)
  })
  sitemap.end()

  const result = await streamToPromise(sitemap)
  const filename = path.join(outpath, 'sitemap.xml')
  write(filename, result.toString())
}

// Create sitemap index with sitemap files in assets/sitemaps dir
async function createSitemapIndex({ hostname, urls, outpath }) {
  const subdir = 'sitemaps'
  const fullpath = path.join(outpath, subdir)
  if (!exist(fullpath)) mkdir(fullpath)

  const indexStream = new SitemapAndIndexStream({
    limit: LIMIT,
    getSitemapStream: function (i) {
      const sitemap = new SitemapStream({ hostname })
      const filename = `sitemap-${i + 1}.xml`
      const destination = path.join(fullpath, filename)
      const writer = createWriteStream(destination)
      sitemap.pipe(writer)
      return [`${hostname}/${subdir}/${filename}`, sitemap, writer]
    }
  })

  const indexFile = path.join(outpath, 'sitemap.xml')
  const mainWriter = createWriteStream(indexFile)

  await new Promise(function (resolve) {
    mainWriter.on('finish', function () {
      resolve()
    })
    indexStream.pipe(mainWriter)
    urls.forEach((url) => indexStream.write(url))
    indexStream.end()
  })
}

module.exports = async function (config) {
  const { hostname, urls = [], outpath = outPath() } = config
  const worker = urls.length < LIMIT ? createSimpleSitemap : createSitemapIndex
  await worker({ hostname, urls, outpath })
}
