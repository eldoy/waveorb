const fspath = require('path')
const package = require(fspath.join(__dirname, '..', 'package.json'))
const t = require('terminal-kit').terminal

t.bold(`\nWaveorb command line interface v${package.version}\n\n`)

t('Usage: waveorb [command]\n\n')

t.dim('Commands:\n\n')

t.green.bold('  boot')
t.green('     Boot a VPS server\n')

t.green.bold('  install')
t.green('  Install VPS server\n')

t.green.bold('  update')
t.green('   Update VPS server\n')

t.green.bold('  create')
t.green('   Create new app\n')

t.green.bold('  deploy')
t.green('   Deploy app to VPS\n')

t.green.bold('  serve')
t.green('    Start app server\n')

t.green.bold('  build')
t.green('    Build app to dist\n')

t.green.bold('  sitemap')
t.green('  Generate sitemap\n')

t.green.bold('  generate')
t.green(' Generate templates\n')

t.green.bold('  get')
t.green('      Download app server\n')

t.green.bold('  cmd')
t.green('      Run command line console\n')

t.green.bold('  help')
t.green('     Display this help text\n\n')

t.bold('Docs: https://waveorb.com/docs.html\n')
t.bold('Issues: https://github.com/eldoy/waveorb/issues\n\n')

t('Created by Eldøy Projects, https://eldoy.com\n').processExit()
