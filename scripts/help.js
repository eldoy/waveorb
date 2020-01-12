const t = require('terminal-kit').terminal

t.bold('\nWaveorb command line help page\n\n')

t('Usage: waveorb [command]\n\n')

t.dim('Commands:\n\n')

t.green.bold('  boot')
t.green('     Boot a server\n')

t.green.bold('  install')
t.green('  Install server software\n')

t.green.bold('  update')
t.green('   Update server software\n')

t.green.bold('  create')
t.green('   Create new application\n')

t.green.bold('  build')
t.green('    Build application\n')

t.green.bold('  deploy')
t.green('   Deploy application\n')

t.green.bold('  get')
t.green('      Download web server\n')

t.green.bold('  serve')
t.green('    Start web server\n')

t.green.bold('  cmd')
t.green('      Run command line console\n')

t.green.bold('  help')
t.green('     Display this help text\n\n')

t.bold('Please report bugs to Vidar <vidar@eldoy.com>\n\n')

t('Created by Eldoy Projects, https://eldoy.com').processExit()
