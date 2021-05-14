#!/usr/bin/env node
const path = require('path')
const root = process.cwd()
let pkg
try {
  pkg = require(path.join(root, 'package.json'))
} catch (e) {}
if (pkg && pkg.main) {
  require(path.join(root, pkg.main))
} else {
  require('../lib/serve.js')()
}
