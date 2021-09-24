const _ = require('lodash')

module.exports = function(name, $) {
  const routes = $.app.routes || {}

  // Lookup direct routes
  let page = _.get($.app.pages, routes[name])

  // Lookup dynamic routes
  if (!page) {
    for (const route in routes) {
      const pattern = route.split('/').map(x => x.startsWith('_') ? '(.+)' : x).join('/')
      const match = new RegExp(`^${pattern}$`).test(name)
      if (match) {
        const trail = routes[route].split('/').join('.')
        page = _.get($.app.pages, trail)

        // Add query parameters
        route.split('/').forEach((val, i) => {
          if (val.startsWith('_')) {
            $.req.query[val.slice(1)] = name.split('/')[i]
          }
        })
        break
      }
    }
  }

  // Assign default 404 page if none found
  if (!page) {
    $.res.statusCode = 404
    page = $.app.pages['404'] || function() { return '' }
  }

  // Assign name to function in $.page.pageName
  if (typeof page == 'function' && !page.pageName) {
    Object.defineProperty(page, 'pageName', { value: name })
  }

  return page
}
