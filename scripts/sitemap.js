#!/usr/bin/env node
const path = require('path')
const _ = require('lodash')
const extras = require('extras')
const loader = require('../lib/loader.js')
const sitemapBuilder = require('../lib/sitemap.js')

async function sitemap() {
  const app = await loader()
  const sitemapConfig = _.get(app, 'config.sitemap')
  if (sitemapConfig) {
    console.log('Building sitemap.xml...')
    const result = await sitemapBuilder(sitemapConfig)
    const outpath = path.join(process.cwd(), 'app', 'assets', 'sitemap.xml')
    extras.write(outpath, result)
  } else {
    console.log('\nNo sitemap config found.\n')
    console.log('Read about it here:')
    console.log('https://waveorb.com/doc/seo-and-marketing.html#sitemap')
  }
}

sitemap()
