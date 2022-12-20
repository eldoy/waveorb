const { tree, read, dot, basext } = require('extras')
const root = process.cwd()

// Find missing translations in all locale files

const locales = {}
const all = []
tree('app/locales').forEach(function (file) {
  const [base, ext] = basext(file)
  locales[base] = dot(read(file))
  const keys = Object.keys(locales[base])
  for (const key of keys) {
    if (!all.includes(key)) {
      all.push(key)
    }
  }
})

const missing = {}
for (const lang in locales) {
  const langKeys = Object.keys(locales[lang])
  for (const key of all) {
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

const files = tree('app').filter((f) => f.endsWith('.js'))
const matcher = /\$\.t\('([a-zA-Z0-9.]{1,})'\)/g

const translations = {}
for (const file of files) {
  const content = read(file, 'utf8')
  const name = file.replace(root, '')
  const matches = [...content.matchAll(matcher)]
  for (const match of matches) {
    const key = match[1]
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
