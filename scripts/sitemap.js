#!/usr/bin/env node
const path = require('path')
const _ = require('lodash')
const { write } = require('extras')
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
    const result = await builder(config)
    const outpath = process.env.NODE_ENV == 'production'
      ? path.join(process.cwd(), 'dist', 'sitemap.xml')
      : path.join(process.cwd(), 'app', 'assets', 'sitemap.xml')
    write(outpath, result)
  } else {
    console.log('\nNo sitemap config found.\n')
    console.log('Read about it here:')
    console.log('https://waveorb.com/doc/seo-and-marketing.html#sitemap')
  }
  process.exit(0)
}

sitemap()
