module.exports = async function($) {
  await $.validate({
    query: {
      id: {
        exist: 'project'
      }
    }
  })
  return { hello: 'bye' }
}
