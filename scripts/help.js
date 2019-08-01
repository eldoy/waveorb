const t = require('terminal-kit').terminal

t.bold('\nWaveorb help pages\n\n')

t('Usage: waveorb [command]\n\n')

t.dim('Commands:\n\n')

t.green.bold('  cmd')
t.green('      Start the command line console\n')
t.green.bold('  create')
t.green('   Create your application\n')
t.green.bold('  deploy')
t.green('   Deploy your application\n')
t.green.bold('  help')
t.green('     Display this help text (default)\n')
t.green.bold('  serve')
t.green('    Start the web server\n\n')

t.bold('Please report bugs to Vidar <vidar@eldoy.com>\n\n')

t('© Eldoy Projects 2019\n')
