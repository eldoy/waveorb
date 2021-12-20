const _ = require('lodash')
const pretty = require('pretty')
const pager = require('./pager.js')

module.exports = async function($) {
  const name = $.req.page || $.req.pathname
  const page = pager(name, $)
  if (!page) return

  // Set up content
  $.page = { name: page.pagename }
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

  // Apply options
  const options = _.get($, 'app.config.routes') || {}
  if (options.compile !== false) {
    const re = /\$\.([a-zA-Z]+?)\((.+?)\)/
    let m
    while(m = re.exec($.page.content)) {
      const args = m[2].split(',').map(x => x.trim().slice(1, -1))
      if (typeof $[m[1]] === 'function') {
        let result = $[m[1]](...args)
        if (typeof result === 'string') {
          let stringType = m[2].charAt(0)
          if (stringType === "'" && result.includes(stringType)) {
            stringType = '"'
            result = result.replace(/"/g, '\\"')
          }
          result = stringType + result + stringType
        }
        $.page.content = $.page.content.replace(m[0], result)
      }
    }
  }

  if (options.pretty) {
    $.page.content = pretty($.page.content)
  }

  if (options.print) {
    console.log($.page.content)
  }

  // Set content type
  if ($.page.content) {
    let type = 'text/html'
    if (name.endsWith('.xml')) type = 'application/xml'
    $.res.setHeader('content-type', `${type}; charset=utf-8`)
  }

  return $.page.content
}
