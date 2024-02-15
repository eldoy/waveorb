var matcher = /return[\S\s]*?`([\S\s]*?)`/g

var content = `async function($) {
  var hello = 1
  function inner() {
    return \`<div if="hello">What</div>\`
  }
  return /* HTML */\`<div if="!hello">No</div>\`
}`

var matches = [...content.matchAll(matcher)]

console.log(matches)
