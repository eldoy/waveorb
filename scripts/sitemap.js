#!/usr/bin/env node
const _ = require('lodash')
const loader = require('../lib/loader.js')
const builder = require('../lib/sitemap.js')

async function sitemap() {
  const app = await loader()
  let config = _.get(app, 'config.sitemap')
  if (typeof config == 'function') {
    config = await config(app)
  }
  if (config) {
    console.log('Building sitemap.xml...')
    await builder(config)
  } else {
    console.log('\nNo sitemap config found.\n')
    console.log('Read about it here:')
    console.log('https://waveorb.com/doc/seo-and-marketing#sitemap')
  }
  process.exit(0)
}

sitemap()
