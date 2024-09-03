const got = require('got')
const config = require('../lib/config.js')()
let sitemap = process.argv[3]

if (typeof config.sitemap == 'string') {
  sitemap = config.sitemap
} else if (typeof config.domains == 'string') {
  const domain = config.domains.split(' ')[0]
  sitemap = `https://${domain}/sitemap.xml`
}

if (!sitemap) {
  console.log(`\nUsage: waveorb ping [sitemap url]`)
  console.log(`\nExample: waveorb ping https://example.com/sitemap.xml`)
  process.exit()
}
console.log(`Submitting sitemap ${sitemap}...`)
sitemap = encodeURIComponent(sitemap)

const bing = `http://bing.com/ping?sitemap=${sitemap}`
const google = `http://www.google.com/ping?sitemap=${sitemap}`

;(async function () {
  got.get(bing)
  got.post(google)
})()
