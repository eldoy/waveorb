var extras = require('extras')
var root = process.cwd()

// Find missing translations in all locale files

var locales = {}
var all = []
extras.tree('app/locales').forEach(function (file) {
  var [base, ext] = extras.basext(file)
  locales[base] = extras.dot(extras.read(file))
  var keys = Object.keys(locales[base])
  for (var key of keys) {
    if (!all.includes(key)) {
      all.push(key)
    }
  }
})

var missing = {}
for (var lang in locales) {
  var langKeys = Object.keys(locales[lang])
  for (var key of all) {
    // Check if key is in all
    if (!langKeys.includes(key)) {
      if (!missing[lang]) {
        missing[lang] = []
      }
      missing[lang].push(key)
    }
  }
}

if (Object.keys(missing).length) {
  console.log(`\nLocale keys missing:`)
  console.log(missing)
} else {
  console.log(`\nNo locale keys missing.`)
}

// Find missing translations in actions, pages, filters, setups

var files = extras.tree('app').filter((f) => f.endsWith('.js'))
var matcher = /\$\.t\(\s*['"](.+?)['"]\s*\)/gs

var translations = {}
for (var file of files) {
  var content = extras.read(file, 'utf8')
  var name = file.replace(root, '')
  var matches = [...content.matchAll(matcher)]
  for (var match of matches) {
    var key = match[1]
    if (!all.includes(key)) {
      if (!translations[name]) {
        translations[name] = []
      }
      translations[name].push(key)
    }
  }
}

if (Object.keys(translations).length) {
  console.log(`\nTranslations missing:`)
  console.log(translations)
} else {
  console.log(`\nNo translations missing.\n`)
}
