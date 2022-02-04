const tags = {
  js: name => `<script src="${name}"></script>`,
  css: name => `<link href="${name}" rel="stylesheet" type="text/css">`
}
module.exports = function(config = {}, options = {}) {
  function assets(names, type) {
    return names.map(function(name) {
      if (name.endsWith(`bundle.${type}`) && !options.bundle) {
        return (config[type] || []).map(tags[type]).join('')
      }
      return tags[type](name)
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
