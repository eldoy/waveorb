#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const extras = require('extras')
const request = require('request')
const loader = require('../lib/loader.js')
const root = process.cwd()
const dist = path.join(root, 'dist')

async function build() {

  function find(name) {
    const names = extras.dir(path.join(root, name))
    const result = {}
    for (const x of names) {
      result[x.split('.')[0]] = require(path.join(root, name, x))
    }
    return result
  }

  const buildFile = process.argv[3] || 'build.js'
  let builder
  try {
    builder = await require(path.join(root, buildFile))()
  } catch (e) {
    console.log(`Can not build using file '${buildFile}'`)
    process.exit(1)
  }

  if (!extras.exist(dist)) extras.mkdir(dist)

  for (const url of builder.urls) {
    let name = url
    if (name.endsWith('/')) {
      name += 'index.html'
    }
    const dir = path.dirname(name)
    const file = path.basename(name)
    extras.mkdir(path.join(dist, dir))
    const stream = fs.createWriteStream(path.join(dist, dir, file))
    const address = `${builder.host}${url}`
    try {
      request.get({
        url: address,
        gzip: true,
        headers: { 'x-waveorb-build': 'true' }
      }).pipe(stream)
    } catch(e) {
      console.log(`Can't connect to ${address}`)
    }
  }

  // Build assets
  const app = await loader()
  const assets = _.get(app, 'config.assets.bundle')
  if (assets) {
    Object.keys(assets).forEach(function(type) {
      console.log(`Building ${type} files...`)
      const files = assets[type] || []
      const bundle = files.map(function(file) {
        const inpath = path.join(root, 'app', 'assets', file)
        return extras.read(inpath, 'utf8')
      }).join(type === 'js' ? ';' : '\n')
      const outpath = path.join(dist, `bundle.${type}`)
      extras.write(outpath, bundle)
    })
  }

  // Copy assets
  extras.copy(path.join('app', 'assets', '*'), 'dist')

  console.log(`Files written to '${dist}'`)
}

build()