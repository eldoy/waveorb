const path = require('path')
const package = require(path.join(__dirname, '..', 'package.json'))
const t = require('terminal-kit').terminal

t.bold(`\nWaveorb command line interface v${package.version}\n\n`)

t('Usage: waveorb [command]\n\n')

t.bold('Commands:\n\n')

t.green.bold('  create')
t.green('     Create new app\n')

t.green.bold('  boot')
t.green('       Boot new app server\n')

t.green.bold('  update')
t.green('     Update app server\n')

t.green.bold('  deploy')
t.green('     Deploy app to server\n')

t.green.bold('  serve')
t.green('      Start app server\n')

t.green.bold('  build')
t.green('      Build app to dist\n')

t.green.bold('  sitemap')
t.green('    Create sitemap\n')

t.green.bold('  ping')
t.green('       Ping search engines\n')

t.green.bold('  generate')
t.green('   Generate templates\n')

t.green.bold('  cmd')
t.green('        Run command line console\n')

t.green.bold('  migrate')
t.green('    Run migrations\n')

t.green.bold('  help')
t.green('       Display this help text\n\n')

t('Docs: https://waveorb.com/docs\n')
t('Issues: https://github.com/eldoy/waveorb/issues\n\n')

t.dim('Created by Eldøy Projects, https://eldoy.com').processExit()
