module.exports = function host(app) {
  let name = app.config?.env?.host
  if (typeof name == 'string' && !name.startsWith('http')) {
    name = `http://${name}`
  }
  try {
    const uri = new URL(name)
    console.log(`\nServing app at ${uri.origin}\n`)
  } catch (e) {}
}
