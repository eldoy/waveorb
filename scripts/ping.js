let sitemap = process.argv[3]
if (!sitemap) {
  console.log(`\nUsage: waveorb ping [sitemap url]`)
  console.log(`\nExample: waveorb ping https://example.com/sitemap.xml`)
  process.exit(1)
}
sitemap = encodeURIComponent(sitemap)
const taarn = require('taarn')
const bing = `http://bing.com/ping?sitemap=${sitemap}`
const google = `http://www.google.com/ping?sitemap=${sitemap}`

;(async function() {
  console.log('Submitting to', bing)
  await taarn(bing, {}, { method: 'GET' })
  console.log('Submitting to', google)
  await taarn(google, {}, { method: 'POST' })
})()
