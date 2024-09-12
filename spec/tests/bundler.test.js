var bundler = require('../../lib/bundler.js')
var assets

beforeEach(() => {
  assets = bundler()
  process.env.WAVEORB_APP_VERSION = ''
})

it('should create a root js tag', async ({ t }) => {
  var tag = assets.script('/app.js')
  t.equal(tag, '<script src="/app.js"></script>')
})

it('should create a root js tag', async ({ t }) => {
  var tag = assets.script('app.js')
  t.equal(tag, '<script src="app.js"></script>')
})

it('should create multiple js tags', async ({ t }) => {
  var tag = assets.script('app.js', 'hello.js')
  t.equal(tag, '<script src="app.js"></script><script src="hello.js"></script>')
})

it('should expand bundle files', async ({ t }) => {
  var app = {
    config: {
      assets: {
        js: ['app.js']
      }
    }
  }
  assets = bundler(app.config.assets)
  var tag = assets.script('bundle.js')
  t.equal(tag, '<script src="app.js"></script>')
})

it('should not expand bundle files', async ({ t }) => {
  var app = {
    config: {
      assets: {
        js: ['app.js']
      }
    }
  }
  assets = bundler(app.config.assets, { compress: true })
  var tag = assets.script('bundle.js')
  t.equal(tag, '<script src="bundle.js"></script>')
})

it('should create a css tag', async ({ t }) => {
  var tag = assets.style('app.css')
  t.equal(tag, '<link href="app.css" rel="stylesheet" type="text/css">')
})

it('should create multiple css tags', async ({ t }) => {
  var tag = assets.style('app.css', 'hello.css')
  t.equal(
    tag,
    '<link href="app.css" rel="stylesheet" type="text/css"><link href="hello.css" rel="stylesheet" type="text/css">'
  )
})

it('should expand bundle files', async ({ t }) => {
  var app = {
    config: {
      assets: {
        css: ['app.css']
      }
    }
  }
  assets = bundler(app.config.assets)
  var tag = assets.style('bundle.css')
  t.equal(tag, '<link href="app.css" rel="stylesheet" type="text/css">')
})

it('should not expand bundle files', async ({ t }) => {
  var app = {
    config: {
      assets: {
        css: ['app.css']
      }
    }
  }
  assets = bundler(app.config.assets, { compress: true })
  var tag = assets.style('bundle.css')
  t.equal(tag, '<link href="bundle.css" rel="stylesheet" type="text/css">')
})
