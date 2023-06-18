#!/usr/bin/env node
const lodash = require('lodash')
const loader = require('../lib/loader.js')
const builder = require('../lib/sitemap.js')
const CONFIG = require('../lib/config.js')()

async function sitemap() {
  const app = await loader()
  let config = lodash.get(app, 'config.sitemap')
  if (typeof config == 'function') {
    config = await config(app)
  }
  if (
    process.env.NODE_ENV != 'development' &&
    typeof CONFIG.sitemapdir == 'string'
  ) {
    config.outpath = CONFIG.sitemapdir
  }
  if (config) {
    console.log('Building sitemap...')
    await builder(config)
  } else {
    console.log('\nNo sitemap config found.\n')
    console.log('Read about it here:')
    console.log('https://waveorb.com/doc/seo-and-marketing#sitemap')
  }
  process.exit(0)
}

sitemap()
