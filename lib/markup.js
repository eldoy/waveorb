const _ = require('lodash')

module.exports = async function($) {
  const name = $.req.route
  const page = name && _.get($.app.pages, name.split('/'))
  if (!page) return

  // Set up content
  $.page = { name }
  $.page.content = await page($)

  if ($.page.redirect) return ''

  if ($.page.layout !== false) {
    const layout = ($.app.layouts || {})[$.page.layout || 'main']
    if (layout) {
      $.page.content = await layout($)
    }
  }

  return $.page.content
}
