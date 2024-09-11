module.exports = function host(app) {
  var name = app.config?.env?.host
  if (typeof name == 'string' && !name.startsWith('http')) {
    name = `http://${name}`
  }
  try {
    var uri = new URL(name)
    console.log(`\nServing app at ${uri.origin}\n`)
  } catch (e) {}
}
