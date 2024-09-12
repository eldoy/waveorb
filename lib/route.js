var extras = require('extras')

module.exports = function (actions, pages, config) {
  var routes = {}

  // Add routes from actions
  for (var key in extras.dot(actions, '/')) {
    var id = key.replace(/index$/, '')
    routes[`post#/${id}`] = key
  }

  // Add routes from pages
  for (var key in extras.dot(pages, '/')) {
    var id = key.replace(/index$/, '')
    routes[`get#/${id}`] = key
  }

  // Add routes from route config
  var configRoutes = config.routes || {}
  for (var key in configRoutes) {
    var val = configRoutes[key].replace(/^.+@/, '')
    var page = extras.get(pages, val)
    if (typeof page == 'function') {
      routes[key] = val
    }
  }

  // Sort routes
  var sorted = {}
  function comparable(str) {
    return str
      .split('/')
      .map((y) => (y[0] == '_' ? '_' : y))
      .join('/')
  }
  Object.keys(routes)
    .sort((a, b) => {
      a = comparable(a)
      b = comparable(b)
      if (a < b) return 1
      else if (a > b) return -1
      return 0
    })
    .forEach((x) => (sorted[x] = routes[x]))

  return sorted
}
