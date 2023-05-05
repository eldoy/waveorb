const _ = require('lodash')
const { exist, read } = require('extras')
const types = ['yml', 'json', 'js']

let config = {}
const env = process.env.NODE_ENV || 'development'

for (const type of types) {
  const name = `waveorb.${type}`
  const envname = `waveorb.${env}.${type}`
  try {
    if (exist(name)) {
      config = read(name)
    }
    if (exist(envname)) {
      const data = read(envname)
      _.mergeWith(config, data, function (obj, src) {
        if (_.isArray(obj)) {
          return obj.concat(src)
        }
      })
    }
  } catch (e) {
    console.log('Can not read config:', e.message)
  }
}

module.exports = config
