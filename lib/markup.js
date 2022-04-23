const _ = require('lodash')
const pretty = require('pretty')
const pager = require('./pager.js')

module.exports = async function($) {
  const name = $.req.page || $.req.pathname
  const page = typeof name == 'function'
    ? name
    : pager(name, $)
  if (!page) return

  // Set up content
  $.page = { name: page.pagename || 'internal' }
  $.page.content = await page($)
  if ($.page.redirect) return ''
  if (Array.isArray($.page.content)) {
    $.page.content = $.page.content.join('')
  }
  if ($.page.layout !== false) {
    const layout = ($.app.layouts || {})[$.page.layout || 'default']
    if (layout) {
      $.page.content = await layout($)
    }
  }

  // Set content type
  if ($.page.content) {
    let type = 'text/html'
    if (typeof name == 'string' && name.endsWith('.xml')) {
      type = 'application/xml'
    }
    $.res.setHeader('content-type', `${type}; charset=utf-8`)
  }

  return $.page.content
}
