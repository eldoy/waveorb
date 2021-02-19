#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const URL = require('url').URL
const stream = require('stream')
const { promisify } = require('util')
const _ = require('lodash')
const { dir, exist, mkdir, rmdir, read, write, copy, tree, run, sleep } = require('extras')
const got = require('got')
const fport = require('fport')
const loader = require('../lib/loader.js')
const serve = require('../lib/serve.js')
const root = process.cwd()
const dist = path.join(root, 'dist')

async function build() {
  const builder = process.argv[3] || 'build.js'
  const config = exist(builder) ? await read(builder)() : {}

  let urls = config.urls

  // If urls == 'routemap', build from routemap
  if (urls == 'routemap') {
    try {
      urls = Object.keys(read('app/config/routes.yml').routemap)
    } catch (e) {
      console.log('Routemap not found!')
      urls = null
    }
  }

  // No build file or urls means build everything in pages
  // If build file and empty urls, build everything
  if (!urls || !urls.length) {
    const root = `${process.cwd()}/app/pages`
    urls = tree('app/pages').map(f => {
      return f.replace(root, '').replace(/\.js$/, '.html')
    })
  }

  // No hostname means start localhost on random port
  // Hostname with localhost means check if is open or start
  // Hostname without localhost means check if open or fail
  let { protocol, hostname, port } = new URL(config.host || 'http://localhost')
  port = port || (await fport.port())
  const host = `${protocol}//${hostname}:${port}`

  console.log(`Build server: ${host}`)

  const { server, app } = await serve({ port })

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
  await sleep(2)
  console.log(`Shutting down build server...\n`)
  server.http.server.close()
  await sleep(1)

  // Build assets
  const assets = _.get(app, 'config.assets.bundle')
  if (assets) {
    Object.keys(assets).forEach(function(type) {
      console.log(`Building ${type} files...`)
      const files = assets[type] || []
      const bundle = files.map(function(file) {
        const inpath = path.join(root, 'app', 'assets', file)
        return read(inpath, 'utf8')
      }).join(type === 'js' ? ';' : '\n')
      const outpath = path.join(dist, `bundle.${type}`)
      write(outpath, bundle)
    })
  }

  // Copy assets
  copy(path.join('app', 'assets', '*'), 'dist')
  console.log(`\nFiles written to '${dist}'`)
  console.log(`Done.`)
  process.exit(0)
}

build()