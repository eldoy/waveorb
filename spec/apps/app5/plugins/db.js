module.exports = async function(app) {
  app.hello = 'hello'
  return { bye: 'bye' }
}
