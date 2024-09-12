var extras = require('extras')
var compile = require('./compile.js')

module.exports = async function page($) {
  var name = $.req.route
  var page = name && extras.get($.app.pages, name.split('/'))

  // Check for 404 page
  if (!page && $.res.getHeader('content-type')?.startsWith('text/html')) {
    page = extras.get($.app.pages, '404')
  }

  if (!page) return

  // Set up content
  $.page = { name }
  $.page.content = await page($)

  if ($.req.redirecting) return ''

  if ($.page.layout !== false) {
    var layoutName = $.page.layout || 'main'
    var layout = extras.get($.app.layouts, layoutName)
    if (layout) {
      $.page.content = await layout($)
    }
  }

  if ($.app.config?.env?.compile) {
    compile($)
  }

  return $.page.content
}
