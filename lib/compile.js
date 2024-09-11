var re = /\$\.(t|link)\(\s*(['"].+?['"])\s*\)/s

module.exports = function ($) {
  var m
  while ((m = re.exec($.page.content))) {
    if (typeof $[m[1]] == 'function') {
      var arg = m[2].trim().slice(1, -1)
      var result = $[m[1]](arg)
      if (typeof result == 'string') {
        var stringType = m[2].replace(/\s/g, '').charAt(0)
        if (stringType == "'" && result.includes(stringType)) {
          stringType = '"'
          result = result.replace(/"/g, '\\"')
        }
        result = stringType + result + stringType
      }
      $.page.content = $.page.content.replace(m[0], result)
    }
  }
}
