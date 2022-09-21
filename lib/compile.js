const re = /\$\.([a-zA-Z]+?)\((.+?)\)/s

module.exports = function ($) {
  let m
  while ((m = re.exec($.page.content))) {
    const args = m[2].split(',').map((x) => x.trim().slice(1, -1))
    if (typeof $[m[1]] === 'function') {
      let result = $[m[1]](...args)
      if (typeof result === 'string') {
        let stringType = m[2].replace(/\s/g, '').charAt(0)
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
