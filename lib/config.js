const { exist, read } = require('extras')
const types = ['json', 'js', 'yml']

let config = {}

for (const type of types) {
  const name = `waveorb.${type}`
  try {
    if (exist(name)) {
      config = read(name)
    }
  } catch(e) {
    console.log('Can not read config:', e.message)
  }
}

module.exports = config
