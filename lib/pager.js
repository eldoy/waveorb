const _ = require('lodash')

function getPage(name, $) {
  return _.get($, `app.pages.${name.split('/').join('.')}`)
}

function getRouteName(name, $) {
  const options = _.get($, 'app.config.routes') || {}
  if (options.routemap) {
    const routeName = `/${name}.html`.replace('/index.html', '/')
    const mapping = options.routemap[routeName]
    if (mapping) {
      return mapping.split('@')[1]
    }
  }
  return name
}

function getDynamicRoute(name, $) {
  let pages = $.app.pages
  const dirs = name.split('/')
  const trail = []
  for (let i = 0; i < dirs.length; i++) {
    const key = dirs[i]
    const [any, v] = Object.entries(pages).find(([k, v]) => k[0] === '_') || []
    if (any) $.req.query[any.slice(1)] = key
    trail.push(any || key)
    if (!(pages = pages[any || key])) {
      break
    }
  }
  return trail.join('/')
}

module.exports = function (name, $) {
  name = getRouteName(name, $)
  let page = getPage(name, $)

  if (!page) {
    name = getDynamicRoute(name, $)
    page = getPage(name, $)
  }

  if (!page) {
    name = getRouteName(name, $)
    page = getPage(name, $)
  }

  // Assign name to function in $.page.name
  if (typeof page === 'function') {
    Object.defineProperty(page, 'pageName', { value: name })
  }
  return page
}
