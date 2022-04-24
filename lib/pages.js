const _ = require('lodash')

module.exports = async function($) {
  const name = $.req.route
  const page = name && _.get($.app.pages, name.split('/'))
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
