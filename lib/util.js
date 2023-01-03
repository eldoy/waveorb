const path = require('path')

// Used with the bundler to rewrite urls in CSS files
function rewriteCSSUrl(file, content) {
  return content.replace(/url\(['"]?(.+?)['"]?\)/g, function (match, url) {
    return match.replace(
      url,
      url[0] == path.sep ? url.slice(1) : path.join(path.dirname(file), url)
    )
  })
}

module.exports = {
  rewriteCSSUrl
}
