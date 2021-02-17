const tags = {
  js: name => `<script src="${name}"></script>`,
  css: name => `<link href="${name}" rel="stylesheet" type="text/css">`
}
module.exports = function(config = {}, options = {}) {
  function assets(names, mode) {
    return names.map(function(name) {
      if (name.endsWith(`bundle.${mode}`) && !options.bundle) {
        return config[mode].map(file => tags[mode](file)).join('')
      }
      return tags[mode](name)
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
