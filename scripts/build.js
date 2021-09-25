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
const root = process.cwd()
const dist = path.join(root, 'dist')

async function build() {
  const app = await loader()
  const builder = process.argv[3] || 'build.js'
  const config = exist(builder) ? await read(builder)(app) : {}

  let { urls } = config

  // If urls not found, build from routemap
  if (!urls) {
    try {
      urls = Object.keys(read('app/config/routes.yml').routemap)
      console.log('Building from routemap config...')
    } catch (e) {
      console.log('Building without routemap config...')
    }
  }

  // No build file or urls means build everything in pages
  // If build file and empty urls, build everything
  if (!urls || !urls.length) {
    const root = `${process.cwd()}/app/pages`
    urls = tree('app/pages').map(f => {
      return f.replace(root, '')
        .replace(/\.(md|js)$/, '')
        .replace(/^index$|\/index$/, '/')
    })
  }

  // No hostname means start localhost on random port
  // Hostname with localhost means check if is open or start
  // Hostname without localhost means check if open or fail
  let { protocol, hostname, port } = new URL(config.host || 'http://localhost')
  port = port || (await fport.port())
  const host = `${protocol}//${hostname}:${port}`

  const { server } = await serve({ port }, app)

  // Wait for server start
  await sleep(1)

  rmdir(dist)
  if (!exist(dist)) mkdir(dist)

  const pipeline = promisify(stream.pipeline)
  const options = { headers: { 'x-waveorb-build': 'true' } }

  for (const url of urls) {
    let name = url
    if (name.endsWith('/')) {
      name += 'index.html'
    }

    const dir = path.dirname(name)
    const file = path.basename(name)
    mkdir(path.join(dist, dir))

    const address = `${host}${url}`
    console.log(`Building ${name}`)
    try {
      await pipeline(
        got.stream(address, options),
        fs.createWriteStream(path.join(dist, dir, file))
      )
    } catch(e) {
      console.log(e)
      console.log(`Can't connect to ${address}!`)
      process.exit(1)
    }
  }
  console.log(`Build complete...\n`)
  server.http.close()
  await sleep(1)

  // Copy assets
  copy(path.join('app', 'assets', '*'), 'dist')

  // Build assets
  const assets = _.get(app, 'config.assets.bundle')

  if (assets) {
    for (const type of Object.keys(assets)) {
      console.log(`Bundling ${type} files...`)
      const files = assets[type] || []
      const bundle = files.map(function(file) {
        const inpath = path.join(root, 'app', 'assets', file)
        return read(inpath, 'utf8')
      }).join(type == 'js' ? ';' : '\n')

      // Write bundle uncompressed to bundle path
      const bundlePath = path.join(dist, `bundle.${type}`)
      write(bundlePath, bundle)

      // Source map path
      const mapPath = bundlePath + '.map'

      // Compress Javascript bundle
      if (type == 'js') {
        const code = {}
        files.forEach(file => {
          code[file] = read(path.join(dist, file), 'utf8')
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

  console.log(`\nFiles written to '${dist}'`)
  process.exit(0)
}

build()