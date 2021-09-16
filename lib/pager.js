const _ = require('lodash')

function getPage(name, $) {
  return _.get($, `app.pages.${name.split('/').join('.')}`)
}

function getRouteName(name, $) {
  const routemap = Object.assign({}, _.get($, 'app.config.routes.routemap'))
  if (!_.isEmpty(routemap)) {
    const routeName = `/${name}.html`.replace('/index.html', '/')
    const mapping = routemap[routeName]
    if (mapping) {
      return mapping.split('@')[1]
    }
  }
  return name
}

function getDynamicRoute(name, $) {
  let pages = Object.assign({}, $.app.pages)

  const trail = []
  for (const dir of name.split('/')) {
    const dynamic = Object.keys(pages).find(route => route.startsWith('_'))

    // Build trail
    trail.push(dynamic || dir)

    // Add to request query
    if (dynamic) $.req.query[dynamic.slice(1)] = dir

    // Stop if no more pages
    if (!(pages = pages[dynamic || dir])) break
  }
  return trail.join('/')
}

module.exports = function(name, $) {
  // Lookup in routemap config
  name = getRouteName(name, $)
  let page = getPage(name, $)

  // Lookup dynamic routes on disk
  if (!page) {
    name = getDynamicRoute(name, $)
    page = getPage(name, $)
  }

  // Lookup dynamic routes in routemap config
  if (!page) {
    name = getRouteName(name, $)
    page = getPage(name, $)
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
