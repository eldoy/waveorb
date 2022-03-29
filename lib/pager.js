const _ = require('lodash')

module.exports = function(name, $) {
  const routes = $.app.routes || {}
  if (!$.params) $.params = {}

  function getDynamicFile() {
    for (const route in routes) {
      const pattern = route.split('/').map(x => x[0] == '_' ? '[^\/]+' : x).join('/')
      const match = new RegExp(`^\/?${pattern}$`).test(name)
      if (match) {
        // Add params
        route.split('/').forEach((val, i) => {
          if (val.startsWith('_')) {
            $.params[val.slice(1)] = name.split('/')[i]
          }
        })
        return routes[route]
      }
    }
  }

  const file = routes[name] || getDynamicFile()
  const page = file && _.get($.app.pages, file.split('/'))

  // Assign pagename to page function
  if (typeof page == 'function') {
    Object.defineProperty(page, 'pagename', { value: file })
  }

  return page
}
