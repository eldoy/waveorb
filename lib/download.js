const { parse } = require('url')
const http = require('https')
const fs = require('fs')
const { basename } = require('path')

const TIMEOUT = 10000
const BYTES = 1024

module.exports = function(url, path) {
  const uri = parse(url)
  if (!path) {
    path = basename(uri.path)
  }
  const file = fs.createWriteStream(path)

  return new Promise(function(resolve, reject) {
    const request = http.get(uri.href).on('response', function(res) {
      const total = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      let percent = 0
      // NOT IN USE:
      // let downloadedkb = 0
      // let totalkb = 0
      res
        .on('data', function(chunk) {
          file.write(chunk)
          downloaded += chunk.length
          percent = (100.0 * downloaded / total).toFixed(2)
          // NOT IN USE:
          // downloadedkb = (downloaded / BYTES).toFixed(2)
          // totalkb = (total / BYTES).toFixed(2)
          // process.stdout.write(`Downloaded ${percent}%, ${downloadedkb}kb of ${totalkb}kb\r`)
          process.stdout.write(`Server installing, please wait: ${percent}%\r`)
        })
        .on('end', function() {
          file.end()
          // console.log(`${uri.path} downloaded to: ${path}`)
          process.stdout.write('\n')
          resolve()
        })
        .on('error', function (err) {
          reject(err)
        })
    })
    request.setTimeout(TIMEOUT, function() {
      request.abort()
      reject(new Error(`request timeout after ${TIMEOUT / 1000.0}s`))
    })
  })
}
