#!/usr/bin/env node
var extras = require('extras')
var loader = require('../lib/loader.js')
var builder = require('../lib/sitemap.js')
var CONFIG = require('../lib/config.js')()

async function sitemap() {
  var app = await loader()
  var config = extras.get(app, 'config.sitemap')
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
  process.exit()
}

sitemap()
