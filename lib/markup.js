const _ = require('lodash')
const pretty = require('pretty')
const pager = require('./pager.js')

module.exports = async function($) {
  let path = $.req.pathname
  if (path.endsWith('/')) path += 'index.html'
  if (!(/\.html$/).test(path)) return

  const options = _.get($, 'app.config.routes') || {}
  const [name, ext] = path.slice(1).split('.')
  const page = pager(name, $)
  if (!page) return

  // Set up content and apply options
  $.page = { name: page.pageName }
  $.page.content = await page($)
  if (Array.isArray($.page.content)) {
    $.page.content = $.page.content.join('')
  }
  if ($.page.layout !== false) {
    const layout = ($.app.layouts || {})[$.page.layout || 'default']
    if (layout) {
      $.page.content = await layout($)
    }
  }

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

  if ($.page.content) {
    $.res.setHeader('content-type', 'text/html')
  }

  return $.page.content
}
