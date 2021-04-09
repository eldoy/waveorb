#!/usr/bin/env node
const path = require('path')
const root = process.cwd()
const pkg = require(path.join(root, 'package.json'))
if (pkg && pkg.main) {
  require(path.join(root, pkg.main))
} else {
  require('../lib/serve.js')()
}
