var path = require('node:path')
var fs = require('node:fs')
var extras = require('extras')
var {
  SitemapStream,
  SitemapAndIndexStream,
  streamToPromise
} = require('sitemap')

var LIMIT = 45_000

function outPath() {
  return process.env.NODE_ENV != 'development'
    ? path.join(process.cwd(), 'dist')
    : path.join(process.cwd(), 'app', 'assets')
}

// Create simple sitemap and write it to the assets dir
async function createSimpleSitemap({ hostname, urls, outpath }) {
  var sitemap = new SitemapStream({ hostname })
  urls.forEach(function (url) {
    sitemap.write(url)
  })
  sitemap.end()

  var result = await streamToPromise(sitemap)
  var filename = path.join(outpath, 'sitemap.xml')
  extras.write(filename, result.toString())
}

// Create sitemap index with sitemap files in assets/sitemaps dir
async function createSitemapIndex({ hostname, urls, outpath }) {
  var subdir = 'sitemaps'
  var fullpath = path.join(outpath, subdir)
  if (!extras.exist(fullpath)) {
    extras.exec(`mkdir -p ${fullpath}`)
  }

  var indexStream = new SitemapAndIndexStream({
    limit: LIMIT,
    getSitemapStream: function (i) {
      var sitemap = new SitemapStream({ hostname })
      var filename = `sitemap-${i + 1}.xml`
      var destination = path.join(fullpath, filename)
      var writer = fs.createWriteStream(destination)
      sitemap.pipe(writer)
      return [`${hostname}/${subdir}/${filename}`, sitemap, writer]
    }
  })

  var indexFile = path.join(outpath, 'sitemap.xml')
  var mainWriter = createWriteStream(indexFile)

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
  var { hostname, urls = [], outpath = outPath() } = config
  var worker = urls.length < LIMIT ? createSimpleSitemap : createSitemapIndex
  await worker({ hostname, urls, outpath })
}
