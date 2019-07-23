#!/usr/bin/env node
const nodemon = require('nodemon')
const path = require('path')
const server = path.join(__dirname, '..', 'scripts', 'server.js')
console.log({ server })

// Options: https://github.com/remy/nodemon/blob/master/doc/sample-nodemon.md
nodemon({
  script: server,
  stdout: false,
  ignore: [
    '.git',
    'node_modules/**/node_modules'
  ],
  verbose: true,
  env: {
    NODE_ENV: 'development'
  }
})
.on('start', function () {
  console.log('nodemon started')
})
.on('crash', function () {
  console.log('script crashed for some reason')
})
.on('exit', function () {
  console.log('script exited cleanly')
})
.on('stderr', function(data) {
  // console.log('STDERR')
  // console.log(data.toString())
  process.stdout.write(data.toString())
})
.on('stdout', function(data) {
  // console.log('STDOUT')
  // console.log(data.toString())
  process.stdout.write(data.toString())
})
.on('readable', function() { // the `readable` event indicates that data is ready to pick up
  console.log('SOMETHING READABLE')
  // this.stdout.pipe(fs.createWriteStream('output.txt'))
  // this.stderr.pipe(fs.createWriteStream('err.txt'))
})
.on('quit', function () {
  console.log('App has quit')
  process.exit()
})
.on('restart', function (files) {
  console.log('App restarted due to: ', files)
})