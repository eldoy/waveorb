const { URL } = require('url')

// Add app version as cache buster
function addCacheBuster(name) {
  name = name.replace(/\/+/g, '/').replace(/^\//, '')
  var url = new URL(`http://localhost/${name}`)
  var version = process.env.WAVEORB_APP_VERSION
  if (version && !url.searchParams.has('v')) {
    url.searchParams.append('v', version)
  }
  return url.pathname + url.search
}

function tag(name, type) {
  name = addCacheBuster(name)
  if (type == 'js') {
    return `<script src="${name}"></script>`
  }
  if (type == 'css') {
    return `<link href="${name}" rel="stylesheet" type="text/css">`
  }
  return name
}

module.exports = function(config = {}, options = {}) {
  function assets(names, type) {
    return names.map(function(name) {
      if (name.endsWith(`bundle.${type}`) && !options.compress) {
        return (config[type] || []).map(file => tag(file, type)).join('')
      }
      return tag(name, type)
    }).join('')
  }
  return {
    script: function(...names) {
      return assets(names, 'js')
    },
    style: function(...names) {
      return assets(names, 'css')
    }
  }
}
