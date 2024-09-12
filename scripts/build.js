#!/usr/bin/env node
var fs = require('node:fs')
var path = require('node:path')
var URL = require('node:url').URL
var stream = require('node:stream')
var { promisify } = require('node:util')
var extras = require('extras')
var got = require('got')
var terser = require('terser')
var sass = require('sass')
var fport = require('fport')
var util = require('../lib/util.js')
var loader = require('../lib/loader.js')
var serve = require('../lib/serve.js')
var ROOT = process.cwd()
var APP_ROOT = process.env.WAVEORB_APP || 'app'
var DIST = path.join(ROOT, 'dist')

async function build() {
  var app = await loader(APP_ROOT)
  var builder = process.argv[3] || 'build.js'
  var config = extras.exist(builder) ? await extras.read(builder)(app) : {}

  var { urls } = config

  // If urls not found, build from routes
  if (!urls) {
    urls = Object.keys(app.routes)
      .filter((x) => x.startsWith('get#') && !x.includes('/_'))
      .map((x) => x.replace(/^get#/, ''))
  }

  // No hostname means start localhost on random port
  var { protocol, hostname, port } = new URL(config.host || 'http://localhost')
  port = port || (await fport.port())
  var host = `${protocol}//${hostname}:${port}`

  var { server } = await serve({ port }, app)

  // Wait for server start
  await extras.sleep(1)

  extras.exec(`rm -rf ${DIST}`)
  if (!extras.exist(DIST)) {
    extras.exec(`mkdir -p ${DIST}`)
  }

  var pipeline = promisify(stream.pipeline)

  for (var url of urls) {
    var name = url
    if (name.endsWith('/')) {
      name += 'index.html'
    }

    var dir = path.dirname(name)
    var file = path.basename(name)
    extras.exec(`mkdir -p ${path.join(DIST, dir)}`)

    var address = `${host}${url}`
    console.log(`Building ${name}`)
    try {
      var writer = fs.createWriteStream(path.join(DIST, dir, file))
      await pipeline(got.stream(address), writer)
    } catch (e) {
      console.log(`Can't build ${name}, skipping...`)
    }
  }
  console.log(`Build complete...\n`)
  server.close()
  await extras.sleep(1)

  // Copy assets
  extras.exec(`cp -R ${path.join(APP_ROOT, 'assets', '*')} dist`)

  // Build assets
  var assets = extras.get(app, 'config.assets.bundle')

  if (assets) {
    for (var type of Object.keys(assets)) {
      console.log(`Bundling ${type} files...`)
      var files = assets[type] || []
      var bundle = files
        .map(function (file) {
          var inpath = path.join(APP_ROOT, 'assets', file)
          var content = extras.read(inpath, 'utf8')
          if (type == 'css') {
            return util.rewriteCSSUrl(file, content)
          }
          return content
        })
        .join(type == 'js' ? ';' : '\n')

      // Write bundle uncompressed to bundle path
      var bundlePath = path.join(DIST, `bundle.${type}`)
      extras.write(bundlePath, bundle)

      // Source map path
      var mapPath = bundlePath + '.map'

      // Compress Javascript bundle
      if (type == 'js') {
        var code = {}
        files.forEach((file) => {
          code[file] = extras.read(path.join(DIST, file), 'utf8')
        })
        var result = await terser.minify(code, {
          sourceMap: {
            filename: 'bundle.js',
            url: 'bundle.js.map'
          }
        })
        extras.write(bundlePath, result.code)
        extras.write(mapPath, result.map)
      }

      // Compress CSS bundle
      if (type == 'css') {
        var result = sass.renderSync({
          file: bundlePath,
          outFile: bundlePath,
          outputStyle: 'compressed',
          sourceMap: true
        })
        extras.write(bundlePath, result.css)
        extras.write(mapPath, result.map)
      }
    }
  }

  console.log(`\nFiles written to '${DIST}'`)
  process.exit()
}

build()
