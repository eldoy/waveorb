const _ = require('lodash')
const { dot } = require('extras')

module.exports = function(actions, pages, config) {
  let routes = {}

  // Add routes from actions
  for (const key in dot(actions, '/')) {
    const id = key.replace(/index$/, '')
    routes[`post#/${id}`] = key
  }

  // Add routes from pages
  for (const key in dot(pages, '/')) {
    const id = key.replace(/index$/, '')
    routes[`get#/${id}`] = key
  }

  // Add routes from route config
  const configRoutes = config.routes || {}
  for (const key in configRoutes) {
    const val = configRoutes[key].replace(/^.+@/, '')
    const page = _.get(pages, val)
    if (typeof page == 'function') {
      routes[key] = val
    }
  }

  // Sort routes
  const sorted = {}
  function comparable(str) {
    return str.split('/').map(y => y[0] == '_' ? '_' : y).join('/')
  }
  Object.keys(routes).sort((a, b) => {
    a = comparable(a)
    b = comparable(b)
    if (a < b) return 1
    else if (a > b) return -1
    return 0
  }).forEach(x => sorted[x] = routes[x])

  return sorted
}