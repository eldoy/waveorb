const lodash = require('lodash')
const compile = require('./compile.js')

module.exports = async function page($) {
  const name = $.req.route
  let page = name && lodash.get($.app.pages, name.split('/'))

  // Check for 404 page
  if (!page && $.res.getHeader('content-type')?.startsWith('text/html')) {
    page = lodash.get($.app.pages, '404')
  }

  if (!page) return

  // Set up content
  $.page = { name }
  $.page.content = await page($)

  if ($.req.redirecting) return ''

  if ($.page.layout !== false) {
    const layoutName = $.page.layout || 'main'
    const layout = lodash.get($.app.layouts, layoutName)
    if (layout) {
      $.page.content = await layout($)
    }
  }

  if ($.app.config?.env?.compile) {
    compile($)
  }

  return $.page.content
}
