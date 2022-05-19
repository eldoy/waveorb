const _ = require('lodash')

module.exports = async function page($) {
  const name = $.req.route
  let page = name && _.get($.app.pages, name.split('/'))

  // Check for 404 page
  if (!page && $.res.getHeader('content-type')?.startsWith('text/html')) {
    page = _.get($.app.pages, '404')
  }

  if (!page) return

  // Set up content
  $.page = { name }
  $.page.content = await page($)

  if ($.req.redirecting) return ''

  if ($.page.layout !== false) {
    const layoutName = $.page.layout || 'main'
    const layout = _.get($.app.layouts, layoutName)
    if (layout) {
      $.page.content = await layout($)
    }
  }

  return $.page.content
}
