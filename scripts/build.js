#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const URL = require('url').URL
const stream = require('stream')
const { promisify } = require('util')
const _ = require('lodash')
const { dir, exist, mkdir, rmdir, read, write, copy, tree, run, sleep } = require('extras')
const got = require('got')
const terser = require('terser')
const sass = require('sass')
const fport = require('fport')
const loader = require('../lib/loader.js')
const serve = require('../lib/serve.js')
const ROOT = process.cwd()
const APP_ROOT = process.env.WAVEORB_APP || 'app'
const DIST = path.join(ROOT, 'dist')

async function build() {
  const app = await loader(APP_ROOT)
  const builder = process.argv[3] || 'build.js'
  const config = exist(builder) ? await read(builder)(app) : {}

  let { urls } = config

  // If urls not found, build from routes
  if (!urls) {
    urls = Object.keys(app.routes).filter(x => !x.includes('/_'))
  }

  // No hostname means start localhost on random port
  let { protocol, hostname, port } = new URL(config.host || 'http://localhost')
  port = port || (await fport.port())
  const host = `${protocol}//${hostname}:${port}`

  const { server } = await serve({ port }, app)

  // Wait for server start
  await sleep(1)

  rmdir(DIST)
  if (!exist(DIST)) mkdir(DIST)

  const pipeline = promisify(stream.pipeline)

  for (const url of urls) {
    let name = url
    if (name.endsWith('/')) {
      name += 'index.html'
    }

    const dir = path.dirname(name)
    const file = path.basename(name)
    mkdir(path.join(DIST, dir))

    const address = `${host}${url}`
    console.log(`Building ${name}`)
    try {
      const writer = fs.createWriteStream(path.join(DIST, dir, file))
      await pipeline(got.stream(address), writer)
    } catch(e) {
      console.log(`Can't build ${name}, skipping...`)
    }
  }
  console.log(`Build complete...\n`)
  server.http.close()
  await sleep(1)

  // Copy assets
  copy(path.join(APP_ROOT, 'assets', '*'), 'dist')

  // Build assets
  const assets = _.get(app, 'config.assets.bundle')

  if (assets) {
    for (const type of Object.keys(assets)) {
      console.log(`Bundling ${type} files...`)
      const files = assets[type] || []
      const bundle = files.map(function(file) {
        const inpath = path.join(APP_ROOT, 'assets', file)
        return read(inpath, 'utf8')
      }).join(type == 'js' ? ';' : '\n')

      // Write bundle uncompressed to bundle path
      const bundlePath = path.join(DIST, `bundle.${type}`)
      write(bundlePath, bundle)

      // Source map path
      const mapPath = bundlePath + '.map'

      // Compress Javascript bundle
      if (type == 'js') {
        const code = {}
        files.forEach(file => {
          code[file] = read(path.join(DIST, file), 'utf8')
        })
        const result = await terser.minify(code, {
          sourceMap: {
            filename: 'bundle.js',
            url: 'bundle.js.map'
          }
        })
        write(bundlePath, result.code)
        write(mapPath, result.map)
      }

      // Compress CSS bundle
      if (type == 'css') {
        const result = sass.renderSync({
          file: bundlePath,
          outFile: bundlePath,
          outputStyle: 'compressed',
          sourceMap: true
        })
        write(bundlePath, result.css)
        write(mapPath, result.map)
      }
    }
  }

  console.log(`\nFiles written to '${DIST}'`)
  process.exit(0)
}

build()