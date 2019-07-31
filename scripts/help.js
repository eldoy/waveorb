require('colors')

const help = [
'',
'Waveorb help pages'.bold,
'',
'Usage: waveorb [command]',
'',
'Commands:'.dim,
'',
'  cmd'.bold.green + '      Start the command line console'.green,
'  create'.bold.green + '   Create your application'.green,
'  deploy'.bold.green + '   Deploy your application'.green,
'  help'.bold.green + '     Display this help text (default)'.green,
'  serve'.bold.green + '    Start the web server'.green,
'',
'Please report bugs to Vidar <vidar@eldoy.com>'.bold,
'',
'© Eldoy Projects 2019',
''
]
console.log(help.join('\n'))
